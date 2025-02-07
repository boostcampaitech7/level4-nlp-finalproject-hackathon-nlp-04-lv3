import os
import requests
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())


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

        headers = {"Authorization": self._api_key}
        request = requests.post(
            self._host + self._uri, json=self.request_data, headers=headers
        ).json()

        if "status" in request and request["status"]["code"] == "20000":
            return request["result"]
        else:
            return request
