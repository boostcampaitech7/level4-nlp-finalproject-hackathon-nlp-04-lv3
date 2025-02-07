import os
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
REQUEST_LIMIT = 10  # 1분당 최대 요청 수
SLEEP_TIME = 30  # 30초 대기
BATCH_SIZE = 50  # 50개씩 저장 후 다음 작업 진행
MAX_RETRIES = 5  # 최대 재시도 횟수
RETRY_DELAY = 10  # 재시도 대기 시간 (초)


def generate_hyperclova_dataset():
    api_keys = {
        "openai": os.getenv("OPENAI_API_KEY"),
        "google": os.getenv("GOOGLE_API_KEY"),
        "naver": os.getenv("NAVER_API_KEY"),
    }

    print(api_keys)

    # 데이터 준비
    csv_path = f"{os.getenv('FastAPI_DIR')}/services/text_quiz/data/text.csv"
    context_data = pd.read_csv(csv_path)
    context_data = context_data[159:]

    quiz_gen = QuizGenerator(
        api_keys, "gemini-2.0-flash-thinking-exp-01-21", context_data
    )

    output_file = (
        f"{os.getenv('FastAPI_DIR')}/services/text_quiz/data/tuning_quiz_dataset.jsonl"
    )

    request_count = 0

    with open(output_file, "w", encoding="utf-8") as f:
        for idx in range(len(context_data)):
            text_id = int(context_data.iloc[idx]["text_id"])
            title = context_data.iloc[idx]["title"]
            category = context_data.iloc[idx]["category"]
            content = context_data.iloc[idx]["content"]

            for level in range(1, 6):  # 난이도 1~5
                level_prompt_key = f"level_{level}_prompt"
                if level_prompt_key in prompt_data:
                    prompt_with_level = f"{prompt_data['quiz_prompt']}\n{prompt_data[level_prompt_key]}\n\n제목: {title}\n카테고리: {category}\n본문: {content}"
                else:
                    logger.error(f"❌ {level_prompt_key}가 prompt.json에 없음")
                    continue

                retries = 0
                while retries < MAX_RETRIES:
                    try:
                        # 챗봇을 호출하여 퀴즈 생성
                        _, generated_quiz = quiz_gen.generate_quiz(
                            prompt_with_level, idx
                        )

                        # JSONL 형식으로 저장할 데이터 생성
                        json_data = {
                            "C_ID": text_id,
                            "T_ID": level - 1,
                            "Text": prompt_with_level,
                            "Completion": generated_quiz.strip(),
                        }

                        # JSONL 파일에 한 줄씩 저장
                        f.write(json.dumps(json_data, ensure_ascii=False) + "\n")

                        request_count += 1
                        logger.info(
                            f"✅ 데이터 샘플 (text_id={text_id}, level={level}) 저장 완료"
                        )

                        time.sleep(8)  # 각 요청마다 8초 대기

                        # 요청 제한 초과 시 대기
                        if request_count >= REQUEST_LIMIT:
                            logger.info(f"⏳ {SLEEP_TIME}초 동안 대기 중...")
                            time.sleep(SLEEP_TIME)
                            request_count = 0  # 요청 개수 초기화

                        break  # 정상 실행되면 반복문 탈출

                    except openai.error.RateLimitError as e:
                        retry_after = int(e.headers.get("Retry-After", RETRY_DELAY))
                        logger.warning(
                            f"⚠️ API 요청 제한 초과! {retry_after}초 후 재시도..."
                        )
                        time.sleep(retry_after)
                        retries += 1

                    except openai.error.OpenAIError as e:
                        logger.error(f"🚨 OpenAI API 에러 발생: {e}")
                        time.sleep(RETRY_DELAY)
                        retries += 1

                # 최대 재시도 횟수를 초과하면 에러 로그 출력 후 진행
                if retries >= MAX_RETRIES:
                    logger.error(
                        f"❌ 최대 재시도 횟수 초과! text_id={text_id}, level={level} 스킵"
                    )

            # 50개 저장 후 다음 작업 진행
            if (idx + 1) % BATCH_SIZE == 0:
                logger.info(f"🚀 50개 저장 완료! 다음 작업 진행 중...")

    logger.info(
        f"🎯 퀴즈 데이터셋이 {output_file} 파일에 JSONL 형식으로 저장되었습니다."
    )


def tune_model():
    task_executor = CreateTaskExecutor()

    # 튜닝 파라미터 설정
    task_name = "quiz_tuning_task"
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
    while True:
        try:
            # 1. 퀴즈 데이터 생성
            generate_hyperclova_dataset()
            break  # 성공적으로 실행되면 종료
        except Exception as e:
            logger.error(f"❌ 예상치 못한 에러 발생: {e}, 30초 후 재시작")
            time.sleep(30)  # 30초 대기 후 다시 실행

    # 2. 데이터 생성 완료 후, 튜닝 실행
    tune_model()
