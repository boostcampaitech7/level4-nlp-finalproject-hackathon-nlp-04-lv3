import requests
import logging


class CompletionExecutor:
    def __init__(self, host, api_key, system_prompt):
        self._host = host
        self._api_key = api_key
        self.system_prompt = system_prompt
        self.logger = logging.getLogger(__name__)

        self.request_data = {
            "topP": 0.3,
            "topK": 0,
            "maxTokens": 2048,
            "temperature": 0.5,
            "repeatPenalty": 5.0,
            "stopBefore": [],
            "includeAiFilters": True,
            "seed": 0,
        }

    def execute(self, content):
        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json; charset=utf-8",
        }
        prompt = [{"role": "system", "content": self.system_prompt}]
        prompt.append({"role": "user", "content": content})

        self.request_data["messages"] = prompt
        print(self.request_data)
        self.logger.info(f"request_body: {self.request_data}")

        response = requests.post(
            self._host + "/testapp/v1/chat-completions/HCX-003",
            headers=headers,
            json=self.request_data,
        )
        response_body = response.json()
        self.logger.info(f"response: {response_body}")
        return response_body
