import requests
import json
import csv
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

# https://clovastudio.ncloud.com/tuning/api
# API 가이드: https://api.ncloud-docs.com/docs/clovastudio-gettask
# 사용 가이드: https://guide.ncloud-docs.com/docs/clovastudio-tuning


def construct_instruction_dataset(data_file, save_file):
    # 1. format에 맞추기
    records = list()
    with open(data_file, "r", encoding="utf-8") as file:
        for idx, line in enumerate(file):
            data = json.loads(line)
            system_prompt = data["prompt"][0]["content"]
            text = data["prompt"][1]["content"]
            completion = data["feedback"]

            records.append(
                {
                    "System_Prompt": system_prompt,
                    "C_ID": idx,
                    "T_ID": 0,
                    "Text": text,
                    "Completion": completion,
                }
            )

    # .csv 파일에 저장하기
    with open(f"{save_file}.csv", mode="w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=records[0].keys())

        writer.writeheader()
        writer.writerows(records)

    # .jsonl 파일에 저장하기
    with open(f"{save_file}.jsonl", "w", encoding="utf-8") as file:
        for record in records:
            file.write(json.dumps(record, ensure_ascii=False) + "\n")


class CreateTaskExecutor:
    def __init__(self):
        self._host = "https://clovastudio.stream.ntruss.com"
        self._uri = "/tuning/v2/tasks"
        self._api_key = os.getenv("NAVER_API_KEY")

        self.request_data = {
            "tuningType": "PEFT",
            "taskType": "GENERATION",
            "trainingDatasetBucket": os.getenv("BUCKET_NAME"),
            "trainingDatasetAccessKey": os.getenv("NAVER_ACCESS_KEY"),
            "trainingDatasetSecretKey": os.getenv("NAVER_SECRET_KEY"),
        }

    def execute(self, name, model, train_epochs, learning_rate, file_path):
        self.request_data["name"] = name
        self.request_data["model"] = model
        self.request_data["trainEpochs"] = train_epochs
        self.request_data["learningRate"] = learning_rate
        self.request_data["trainingDatasetFilePath"] = file_path

        # send request
        headers = {
            "Authorization": self._api_key,
        }
        request = requests.post(
            self._host + self._uri, json=self.request_data, headers=headers
        ).json()

        if "status" in request and request["status"]["code"] == "20000":
            return request["result"]
        else:
            return request


class FindTaskExecutor:
    def __init__(self):
        self._host = "https://clovastudio.stream.ntruss.com"
        self._uri = "/tuning/v2/tasks/"
        self._api_key = os.getenv("NAVER_API_KEY")

    def execute(self, task_id):
        # send request
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": self._api_key,
        }

        response = requests.get(
            self._host + self._uri + task_id, headers=headers
        ).json()
        if "status" in response and response["status"]["code"] == "20000":
            return response["result"]
        else:
            return response

    def execute_list(self, page, size):
        # send request
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": self._api_key,
        }
        response = requests.get(
            self._host + self._uri[:-1] + f"?page={page}&size={size}", headers=headers
        ).json()
        if "status" in response and response["status"]["code"] == "20000":
            return response["result"]
        else:
            return response


if __name__ == "__main__":
    """
    # 1. HCX 전용 instruction dataset 만들기
    data_file = f"{os.getenv('AIRFLOW_DIR')}/tuning/data/train_feedback.jsonl"
    save_file = f"{os.getenv('AIRFLOW_DIR')}/tuning/data/train_instruction_dataset"
    construct_instruction_dataset(data_file, save_file)
    """

    # 2. HCX tuning 작업 생성하기
    name = "feedback_train_dash"
    model = "HCX-DASH-001"  # HCX-003
    train_epochs = "8"
    learning_rate = "1e-5f"
    file_path = "train_instruction_dataset.jsonl"
    completion_executor = CreateTaskExecutor()
    response_text = completion_executor.execute(
        name, model, train_epochs, learning_rate, file_path
    )
    print(
        f"name: {name}, train_epochs: {train_epochs}, learning_rate: {learning_rate}, file_path: {file_path}"
    )
    print(response_text)

    """
    # 3. HCX tuning 작업 보기
    task_id = "lmh7w4qy"
    completion_executor = FindTaskExecutor()
    response_text = completion_executor.execute(task_id)
    print(task_id)
    print(response_text)

    response_text = completion_executor.execute_list(0, 20)
    print(response_text)
    """
