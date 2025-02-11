import os
import re
import ast
import json
import time
import pandas as pd
import logging
import openai
from quiz_generator import QuizGenerator
from dotenv import load_dotenv, find_dotenv
from hcx_tuning import CreateTaskExecutor


# 환경 변수 로드
load_dotenv(find_dotenv())

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# prompt.json 로드
with open(
    f"{os.getenv('FastAPI_DIR')}/services/text_quiz/prompt.json", "r", encoding="utf-8"
) as f:
    prompt_data = json.load(f)

# 요청 제한 설정
REQUEST_LIMIT = 8  # 1분당 최대 요청 수
SLEEP_TIME = 30  # 30초 대기
BATCH_SIZE = 50  # 50개씩 저장 후 다음 작업 진행
MAX_RETRIES = 5  # 최대 재시도 횟수
RETRY_DELAY = 10  # 재시도 대기 시간 (초)
# MAX_RETRIES, REQUEST_LIMIT, SLEEP_TIME, RETRY_DELAY, BATCH_SIZE, logger, prompt_data, QuizGenerator 등은 미리 정의되어 있다고 가정


def extract_json_from_markdown(text):
    # 마크다운 코드 블록 내 JSON 문자열 추출
    pattern = r"```(?:json)?\s*([\s\S]+?)\s*```"
    match = re.search(pattern, text)
    if match:
        return match.group(1)
    return text


def parse_json_response(response_text):
    # 첫번째 시도: 기본 json.loads
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        pass
    # 두번째 시도: 단일 인용부호를 이중 인용부호로 변경 후 시도
    try:
        corrected = response_text.replace("'", '"')
        return json.loads(corrected)
    except json.JSONDecodeError:
        pass
    # 세번째 시도: ast.literal_eval 사용 (JSON 형식과 유사한 파이썬 리터럴)
    try:
        return ast.literal_eval(response_text)
    except Exception:
        raise ValueError("JSON 변환 실패")


def generate_tuning_dataset():
    api_keys = {
        "openai": os.getenv("OPENAI_API_KEY"),
        "google": os.getenv("GOOGLE_API_KEY"),
        "naver": os.getenv("NAVER_API_KEY"),
    }
    print(api_keys)

    csv_path = f"{os.getenv('FastAPI_DIR')}/services/text_quiz/data/text.csv"
    context_data = pd.read_csv(csv_path)

    quiz_gen = QuizGenerator(
        api_keys, "gemini-2.0-flash-thinking-exp-01-21", context_data
    )

    tuning_output_file = (
        f"{os.getenv('FastAPI_DIR')}/services/text_quiz/data/tuning_quiz_dataset.jsonl"
    )
    db_output_file = (
        f"{os.getenv('FastAPI_DIR')}/services/text_quiz/data/db_quiz_dataset.jsonl"
    )

    # "a" 모드로 파일을 열면 기존에 저장된 내용 위에 덮어쓰지 않고 이어서 저장함
    with open(tuning_output_file, "a", encoding="utf-8") as tuning_f, open(
        db_output_file, "a", encoding="utf-8"
    ) as db_f:

        request_count = 0
        c_id = 0

        for idx in range(len(context_data)):
            text_id = int(context_data.iloc[idx]["text_id"])
            title = context_data.iloc[idx]["title"]
            category = context_data.iloc[idx]["category"]
            content = context_data.iloc[idx]["content"]

            for level in range(1, 6):
                prompt_with_level = f"{prompt_data['quiz_prompt']}\n\n난이도: {level}\n\n제목: {title}\n카테고리: {category}\n본문: {content}\n\n"
                retries = 0
                while retries < MAX_RETRIES:
                    try:
                        _, generated_quiz = quiz_gen.generate_quiz(
                            prompt_with_level, idx
                        )
                        raw_quiz = generated_quiz.strip()
                        json_str = extract_json_from_markdown(raw_quiz)
                        quiz_json = parse_json_response(json_str)
                        if not all(
                            k in quiz_json
                            for k in [
                                "level",
                                "question",
                                "answer",
                                "answer_explain",
                                "options",
                            ]
                        ):
                            logger.error("🚨 응답 JSON 형식이 올바르지 않음")
                            raise ValueError("응답 JSON 형식 오류")
                        tuning_data = {
                            "C_ID": c_id,
                            "T_ID": 0,
                            "Text": prompt_with_level,
                            "Completion": raw_quiz,
                        }
                        tuning_f.write(
                            json.dumps(tuning_data, ensure_ascii=False) + "\n"
                        )
                        db_data = {
                            "text_id": text_id,
                            "level": quiz_json["level"],
                            "question": quiz_json["question"],
                            "answer": quiz_json["answer"],
                            "answer_explain": quiz_json["answer_explain"],
                            "options": quiz_json["options"],
                        }
                        db_f.write(json.dumps(db_data, ensure_ascii=False) + "\n")
                        request_count += 1
                        logger.info(
                            f"✅ 데이터 샘플 (text_id={text_id}, level={level}) 저장 완료"
                        )
                        time.sleep(8)
                        if request_count >= REQUEST_LIMIT:
                            logger.info(f"⏳ {SLEEP_TIME}초 동안 대기 중...")
                            time.sleep(SLEEP_TIME)
                            request_count = 0
                        break
                    except openai.RateLimitError as e:
                        if hasattr(e, "headers"):
                            retry_after = int(e.headers.get("Retry-After", RETRY_DELAY))
                        else:
                            logger.warning(
                                "RateLimitError에 headers 속성이 없음. 기본 대기 시간 사용"
                            )
                            retry_after = RETRY_DELAY
                        logger.warning(
                            f"⚠️ API 요청 제한 초과! {retry_after}초 후 재시도..."
                        )
                        time.sleep(retry_after)
                        retries += 1
                    except openai.OpenAIError as e:
                        logger.error(f"🚨 OpenAI API 에러 발생: {e}")
                        time.sleep(RETRY_DELAY)
                        retries += 1
                    except ValueError as e:
                        logger.error(f"🚨 {str(e)}")
                        retries += 1
                if retries >= MAX_RETRIES:
                    logger.error(
                        f"❌ 최대 재시도 횟수 초과! text_id={text_id}, level={level} 스킵"
                    )
                c_id += 1
            if (idx + 1) % BATCH_SIZE == 0:
                logger.info("🚀 50개 저장 완료! 다음 작업 진행 중...")
    logger.info(
        f"🎯 퀴즈 데이터셋이 {tuning_output_file} 및 {db_output_file} 파일에 JSONL 형식으로 저장되었습니다."
    )


def tune_model():
    task_executor = CreateTaskExecutor()

    # 튜닝 파라미터 설정
    task_name = "text_quiz_model_tuning"
    model = "HCX-003"  # 사용할 모델 (변경 가능)
    train_epochs = "8"
    learning_rate = "1e-4"
    dataset_file_path = "tuning_quiz_dataset.jsonl"  # JSONL 데이터셋 경로

    logger.info(
        f"🔍 튜닝 시작: {task_name}, 모델: {model}, Epochs: {train_epochs}, LR: {learning_rate}"
    )

    # 튜닝 요청 실행
    tuning_result = task_executor.execute(
        task_name, model, train_epochs, learning_rate, dataset_file_path
    )

    # 튜닝 결과 출력
    logger.info(f"🚀 튜닝 결과: {tuning_result}")

    print(tuning_result)


if __name__ == "__main__":
    try:
        # 1. 퀴즈 데이터 생성
        generate_tuning_dataset()
    except Exception as e:
        logger.error(f"❌ 예상치 못한 에러 발생: {e}")

    # 2. 데이터 생성 완료 후, 튜닝 실행
    tune_model()
