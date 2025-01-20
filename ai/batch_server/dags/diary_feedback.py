import os
import requests
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from dotenv import load_dotenv

load_dotenv()


class CompletionExecutor:
    def __init__(self):
        self._host = "https://clovastudio.stream.ntruss.com"
        self._api_key = os.getenv("NAVER_API_KEY")

        self.request_data = {
            "topP": 0.3,
            "topK": 0,
            "maxTokens": 1882,
            "temperature": 0.5,
            "repeatPenalty": 5.0,
            "stopBefore": [],
            "includeAiFilters": True,
            "seed": 0,
        }

        self.prompt = [
            {
                "role": "system",
                "content": "당신은 서울대 국문학과 교수입니다. \n학생이 작성한 일기를 읽고 글의 흐름이 매끄럽지 못한 부분을 찾아주세요.\n",
            },
            {"role": "user", "content": None},
        ]

    def execute(self, diary):
        headers = {
            "Authorization": self._api_key,
            "Content-Type": "application/json; charset=utf-8",
        }
        self.prompt[1]["content"] = diary
        self.request_data["messages"] = self.prompt
        print(self.request_data)

        response = []
        response = requests.post(
            self._host + "/testapp/v1/chat-completions/HCX-003",
            headers=headers,
            json=self.request_data,
        )

        response_body = response.json()
        feedback = response_body["result"]["message"]["content"]
        return feedback


def generate_save_diary_feedback(api, **kwargs):
    diaries = kwargs["ti"].xcom_pull(
        task_ids="fetch_yesterday_diary"
    )  # dict이 아닌 list로 전달
    pg_hook = PostgresHook(postgres_conn_id="my_postgres_conn")

    for diary in diaries:
        diary_id = diary[0]
        text = diary[1]

        # Feedback 생성
        feedback = api.execute(text)
        print(f"Generated Feedback for Diary {diary_id}: {feedback}")

        # 매개변수화된 쿼리 실행
        sql = """
        UPDATE DIARIES
        SET FEEDBACK = %s
        WHERE DIARY_ID = %s
        """
        pg_hook.run(sql, parameters=(feedback, diary_id))


default_args = {"owner": "airflow", "retries": 1, "retry_delay": timedelta(seconds=5)}

with DAG(
    dag_id="diary_feedback",
    default_args=default_args,
    start_date=datetime(2025, 1, 15),
    schedule_interval="0 1 * * *",
    catchup=True,
    tags=["diary_feedback"],
) as dag:
    completion_executor = CompletionExecutor()

    # 1. 어제 제출한 일기 가져오기
    get_yesterday_diaries_task = PostgresOperator(
        task_id="fetch_yesterday_diary",
        postgres_conn_id="my_postgres_conn",
        sql="""
            SELECT diary_id, text
            FROM DIARIES
            WHERE created_at::date = '{{ macros.ds_add(ds, -1) }}'::date
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
