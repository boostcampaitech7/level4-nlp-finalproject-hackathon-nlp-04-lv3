import os
import re
import json
import requests
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())


with open(f"{os.getenv('AIRFLOW_DIR')}/prompt.json", "r", encoding="utf-8") as f:
    prompt = json.load(f)
feedback_prompt = prompt["feedback_prompt"]


class CompletionExecutor:
    def __init__(self, model_name):
        if "HCX" in model_name:
            self._host = f"https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/{model_name}"
        else:
            self._host = f"https://clovastudio.stream.ntruss.com/testapp/v2/tasks/{model_name}/chat-completions"
        self._api_key = os.getenv("NAVER_API_KEY")

        self.request_data = {
            "topP": 0.3,
            "topK": 0,
            "maxTokens": 4096,
            "temperature": 0.5,
            "repeatPenalty": 5.0,
            "stopBefore": [],
            "includeAiFilters": True,
            "seed": 0,
        }

        self.prompt = [
            {
                "role": "system",
                "content": feedback_prompt,
            },
            {"role": "user", "content": None},
        ]

    def execute(self, diary):
        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json; charset=utf-8",
        }
        self.prompt[1]["content"] = f"**일기**:  \n{diary}"
        self.request_data["messages"] = self.prompt
        print(self.request_data)

        response = requests.post(
            self._host,
            headers=headers,
            json=self.request_data,
        )

        response_body = response.json()
        return response_body["result"]["message"]["content"]


def parse_feedback_review(diary, feedback):
    patterns = {
        "original_sentence": r"\d+\.\s*\*\*기존 문장\*\*:\s*(.*?)\*\*이유 및 개선점\*\*",
        "feedback": r"\*\*이유 및 개선점\*\*:\s*(.*?)\*\*수정 문장\*\*",
        "updated_sentence": r"\*\*수정 문장\*\*:\s*(.*?)(?=\d+\.\s*\*\*기존 문장\*\*|\*\*총평\*\*)",
        "review": r"\*\*총평\*\*:(.*)",
    }

    data = {
        "original_sentence": list(),
        "feedback": list(),
        "updated_sentence": list(),
        "review": list(),
    }

    # 1. 일기 피드백과 리뷰 파싱하기
    for key, pattern in patterns.items():
        matches = re.findall(pattern, feedback, re.DOTALL)
        for match in matches:
            data[key].append(match.strip().strip('"'))

    # 2. 형식에 맞게 변환 (start_idx, end_idx, feedback, updated_sentence)
    feedbacks = []
    for idx, original_sentence in enumerate(data["original_sentence"]):
        matches = re.search(re.escape(original_sentence), diary)
        if matches:
            feedbacks.append(
                [
                    matches.start(),
                    matches.end(),
                    data["feedback"][idx],
                    data["updated_sentence"][idx],
                ]
            )
        else:
            feedbacks.append(
                [-1, -1, data["feedback"][idx], data["updated_sentence"][idx]]
            )

    if data["review"]:
        review = data["review"][0]
    else:
        review = ""

    return feedbacks, review


def generate_save_diary_feedback(api, **kwargs):
    diaries = kwargs["ti"].xcom_pull(task_ids="fetch_yesterday_diary")
    # SQL 결과가 dict이 아닌 list로 전달
    pg_hook = PostgresHook(postgres_conn_id="my_postgres_conn")

    for diary in diaries:
        diary_id = diary[0]
        text = diary[1]

        # 1. HCX로 일기 피드백 생성
        feedback = api.execute(text)
        print(f"Generated Feedback for Diary {diary_id}: {feedback}")

        # 2. 생성한 content에서 일기 피드백과 리뷰 파싱하기
        feedbacks, review = parse_feedback_review(text, feedback)
        if isinstance(feedbacks, (list, dict)):
            feedbacks = json.dumps(feedbacks, ensure_ascii=False)
        print(f"feedbacks: {feedbacks}")
        print(f"review: {review}")

        # 3. 일기 피드백과 리뷰 DB에 저장히기
        sql = """
        UPDATE DIARIES
        SET FEEDBACK = %s, REVIEW = %s, STATUS = 2
        WHERE DIARY_ID = %s
        """
        pg_hook.run(sql, parameters=(feedbacks, review, diary_id), autocommit=True)


default_args = {"owner": "airflow", "retries": 1, "retry_delay": timedelta(seconds=5)}

with DAG(
    dag_id="diary_feedback",
    default_args=default_args,
    start_date=datetime(2025, 1, 25),
    schedule_interval="0 1 * * *",
    catchup=True,
    tags=["diary_feedback"],
) as dag:
    completion_executor = CompletionExecutor(model_name="lmh7w4qy")

    # 1. 어제 제출한 일기 가져오기
    get_yesterday_diaries_task = PostgresOperator(
        task_id="fetch_yesterday_diary",
        postgres_conn_id="my_postgres_conn",
        sql="""
            SELECT diary_id, text
            FROM DIARIES
            WHERE created_at::date = '{{ macros.ds_add(ds, -1) }}'::date AND status = 1
        """,
        do_xcom_push=True,
    )

    # 2. 일기 피드백 생성하고 저장하기
    generate_save_diary_feedback_task = PythonOperator(
        task_id="generate_save_diary_feedback",
        python_callable=generate_save_diary_feedback,
        op_kwargs={"api": completion_executor},
    )

    get_yesterday_diaries_task >> generate_save_diary_feedback_task
