import os
import ast
import json
import time
import logging
import requests
import pandas as pd
import re
import openai
from dotenv import load_dotenv, find_dotenv

# 환경 변수 로드
load_dotenv(find_dotenv())

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -------------------------------------------------------
# 1) prompt.json 불러오기
# -------------------------------------------------------
prompt_json_path = os.path.join(
    os.getenv("FastAPI_DIR", ""), "services", "text_quiz", "prompt.json"
)
with open(prompt_json_path, "r", encoding="utf-8") as f:
    prompt_data = json.load(f)


# -------------------------------------------------------
# 2) 전역 JSON 추출 및 파싱 함수
# -------------------------------------------------------
def extract_json_from_markdown(text):
    """
    마크다운 코드 블록 내 JSON 문자열 추출
    """
    pattern = r"```(?:json)?\s*([\s\S]+?)\s*```"
    match = re.search(pattern, text)
    if match:
        return match.group(1)
    return text


def parse_json_response(response_text):
    """
    JSON 문자열을 파싱.
    기본 json.loads, 단일 인용부호 치환, ast.literal_eval 순으로 시도.
    실패 시 ValueError 발생.
    """
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        logger.debug("기본 json.loads 실패", exc_info=True)
    try:
        corrected = response_text.replace("'", '"')
        return json.loads(corrected)
    except json.JSONDecodeError:
        logger.debug("단일 인용부호 치환 후 json.loads 실패", exc_info=True)
    try:
        return ast.literal_eval(response_text)
    except Exception as e:
        logger.debug("ast.literal_eval 시도 실패", exc_info=True)
        raise ValueError("JSON 변환 실패: " + str(e))


# -------------------------------------------------------
# 3) 튜닝한 HyperClova X 모델에 요청을 보내는 CompletionExecutor 클래스
# -------------------------------------------------------
class CompletionExecutor:
    def __init__(self, model_id):
        self._host = f"https://clovastudio.stream.ntruss.com/testapp/v2/tasks/{model_id}/chat-completions"
        self._api_key = os.getenv("NAVER_API_KEY")
        if not self._api_key:
            logger.warning("NAVER_API_KEY가 설정되지 않았습니다")
        self.request_data = {
            "topP": 0.8,
            "topK": 0,
            "maxTokens": 4096,
            "temperature": 0.3,
            "repeatPenalty": 1,
            "stopBefore": [],
            "includeAiFilters": True,
        }

    def generate_quiz(self, prompt_text):
        headers = {
            "Authorization": self._api_key,
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json",
        }
        self.request_data["messages"] = [
            {"role": "system", "content": ""},
            {"role": "user", "content": prompt_text},
        ]

        retries = 0
        while retries < MAX_RETRIES:
            try:
                logger.info(f"🔄 퀴즈 생성 요청 중... (재시도 {retries}/{MAX_RETRIES})")
                response = requests.post(
                    self._host,
                    headers=headers,
                    json=self.request_data,
                    timeout=(10, 120),
                )
                if response.status_code == 429:
                    logger.warning(
                        "🚨 429 Too Many Requests: 요청 한도 초과! 60초 대기 후 재시도합니다."
                    )
                    time.sleep(60)
                    retries += 1
                    continue
                if response.status_code == 408:
                    logger.warning(
                        "🚨 408 Request Timeout: 서버 응답 시간이 초과되었습니다. 60초 대기 후 재시도합니다."
                    )
                    time.sleep(60)
                    retries += 1
                    continue

                response.raise_for_status()
                try:
                    resp_body = response.json()
                except json.JSONDecodeError as e:
                    logger.error("응답 JSON 디코드 실패", exc_info=True)
                    raise ValueError("응답 JSON 디코드 실패")
                if "result" in resp_body and resp_body["result"]:
                    content = resp_body["result"]["message"]["content"].strip()
                    json_content = extract_json_from_markdown(content)
                    try:
                        quiz_json = parse_json_response(json_content)
                    except ValueError as e:
                        logger.error("응답 JSON 파싱 실패", exc_info=True)
                        # 포맷이 맞지 않을 경우 원본 응답 내용을 저장
                        return {
                            "raw_response": content,
                            "error": "JSON 변환 실패: " + str(e),
                        }
                    required_keys = [
                        "level",
                        "question",
                        "answer",
                        "answer_explain",
                        "options",
                    ]
                    if isinstance(quiz_json, dict) and all(
                        k in quiz_json for k in required_keys
                    ):
                        return quiz_json
                    else:
                        logger.error(
                            "퀴즈 JSON 구조가 올바르지 않음",
                            extra={"quiz_json": quiz_json},
                        )
                        raise ValueError("퀴즈 JSON 구조가 올바르지 않음")
            except (
                requests.exceptions.ReadTimeout,
                requests.exceptions.RequestException,
                ValueError,
            ) as e:
                logger.error(f"🚨 요청 중 예외 발생: {e}", exc_info=True)
                time.sleep(60)
                retries += 1
        logger.error("❌ 퀴즈 생성 실패: 최대 재시도 횟수 초과")
        return None


# -------------------------------------------------------
# 4) 최종 데이터셋 생성 → JSONL 저장 (포맷 오류가 있더라도 원본 응답을 저장)
# -------------------------------------------------------
REQUEST_LIMIT = 5  # 1분당 최대 요청 수
SLEEP_TIME = 90  # 대기 시간 (초)
BATCH_SIZE = 10  # 진행 알림 배치 크기
MAX_RETRIES = 5  # 최대 재시도 횟수
RETRY_DELAY = 60  # 재시도 대기 시간 (초)


def generate_final_dataset():
    csv_path = os.path.join(
        os.getenv("FastAPI_DIR", ""), "services", "text_quiz", "data", "text.csv"
    )
    context_data = pd.read_csv(csv_path)
    model_id = "bjljrkma"
    executor = CompletionExecutor(model_id)
    output_file = os.path.join(
        os.getenv("FastAPI_DIR", ""),
        "services",
        "text_quiz",
        "data",
        "final_quiz_dataset.jsonl",
    )

    with open(output_file, "a", encoding="utf-8") as f:
        request_count = 0

        for idx, row in context_data.iterrows():
            text_id = row["text_id"]
            title = row["title"]
            category = row["category"]
            content = row["content"]

            for level in range(1, 6):
                prompt_with_level = f"{prompt_data['quiz_prompt']}\n\n난이도: {level}\n\n제목: {title}\n카테고리: {category}\n본문: {content}\n\n"
                retries = 0
                while retries < MAX_RETRIES:
                    try:
                        generated_quiz = executor.generate_quiz(prompt_with_level)
                        if not generated_quiz:
                            logger.error(
                                "❌ 퀴즈 생성 실패 (응답이 None). 재시도 중..."
                            )
                            raise ValueError("퀴즈 생성 실패")

                        # 만약 JSON 변환에 실패하여 raw_response가 포함되어 있으면 그대로 저장
                        if "raw_response" in generated_quiz:
                            json_data = {
                                "text_id": text_id,
                                "raw_response": generated_quiz["raw_response"],
                                "error": generated_quiz.get("error", ""),
                            }
                        else:
                            json_data = {
                                "text_id": text_id,
                                "level": generated_quiz["level"],
                                "question": generated_quiz["question"],
                                "answer": generated_quiz["answer"],
                                "answer_explain": generated_quiz["answer_explain"],
                                "options": generated_quiz["options"],
                            }
                        f.write(json.dumps(json_data, ensure_ascii=False) + "\n")
                        request_count += 1
                        logger.info(f"✅ (text_id={text_id}, level={level}) 저장 완료")
                        time.sleep(10)
                        if request_count >= REQUEST_LIMIT:
                            logger.info(f"⏳ {SLEEP_TIME}초 대기...")
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
                            f"⚠️ API 요청 제한 초과! {retry_after}초 후 재시도...",
                            exc_info=True,
                        )
                        time.sleep(retry_after)
                        retries += 1
                    except openai.OpenAIError as e:
                        logger.error(f"🚨 OpenAI API 에러 발생: {e}", exc_info=True)
                        time.sleep(RETRY_DELAY)
                        retries += 1
                    except ValueError as e:
                        logger.error(f"🚨 {str(e)}", exc_info=True)
                        time.sleep(RETRY_DELAY)
                        retries += 1
                if retries >= MAX_RETRIES:
                    logger.error(
                        f"❌ 최대 재시도 횟수 초과! text_id={text_id}, level={level} 스킵"
                    )
            if (idx + 1) % BATCH_SIZE == 0:
                logger.info(f"🚀 현재 {idx+1}개 진행 완료. 다음 작업 진행 중...")
    logger.info(f"🎯 최종 퀴즈 데이터셋이 {output_file} 에 JSONL 형식으로 저장됨")


if __name__ == "__main__":
    generate_final_dataset()
