import json
import requests
from openai import OpenAI


class OpenAIApi:

    def __init__(self, api_key, base_url=None):
        self.client = OpenAI(api_key=api_key, base_url=base_url)

    def call(self, prompt, model_name, structured_output=None):
        response = self.client.beta.chat.completions.parse(
            model=model_name,
            messages=prompt,
            **({"response_format": structured_output} if structured_output else {}),
        )

        try:
            response_data = json.loads(
                response.choices[0].to_dict()["message"]["content"]
            )
            reasoning_content = response.choices[0].message.reasoning_content
        except:
            response_data = response.choices[0].to_dict()["message"]["content"]

        reasoning_content = (
            response.choices[0].to_dict()["message"].get("reasoning_content", "")
        )

        print(f"resoning_content :{reasoning_content}")
        print(f"content: {response_data}")

        return response_data


class HcxApi:

    def __init__(self, api_key):
        self._host = "https://clovastudio.stream.ntruss.com"
        self._api_key = api_key

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

    def call(self, prompt, model_name, structured_output=None):
        headers = {
            "Authorization": self._api_key,
            "Content-Type": "application/json; charset=utf-8",
        }
        self.request_data["messages"] = prompt
        if "HCX" in model_name:
            uri = f"/testapp/v1/chat-completions/{model_name}"
        else:
            uri = f"/testapp/v2/tasks/{model_name}/chat-completions"

        response = requests.post(
            self._host + uri,
            headers=headers,
            json=self.request_data,
        )

        response_body = response.json()
        response_data = response_body["result"]["message"]["content"]
        print(f"content: {response_data}")
        return response_data
