import logging
import requests
import json


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

    def execute(self, vocab, explain, prev_chat, current_chat):
        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json; charset=utf-8",
        }
        prompt = [
            {
                "role": "system",
                "content": self.system_prompt.format(vocab=vocab, explain=explain),
            }
        ]
        for chat in prev_chat[::-1]:
            prompt.append({"role": "user", "content": chat["question"]})
            prompt.append({"role": "assistant", "content": chat["answer"]})
        prompt.append({"role": "user", "content": current_chat})

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


"""
if __name__ == '__main__':
    completion_executor = CompletionExecutor(
        host='https://clovastudio.stream.ntruss.com',
        api_key='Bearer nv-8cb3966e22374ab892ca9a397d81672cBIlR',
        request_id='0df942f681f84eeda381a9a29100c33e'
    )

    a = communication # API 백엔드 주소?

    preset_text = [{"role":"system","content":prompt},

                   {"role":"user","content":a}]

    request_data = {
        'messages': preset_text,
        'topP': 0.01,
        'topK': 0,
        'maxTokens': 2048,
        'temperature': 0.5,
        'repeatPenalty': 5.0,
        'stopBefore': [],
        'includeAiFilters': True,
        'seed': 0
    }

    json_prompt = {"prompt": prompt,
                   "synonym": synonym,
                   "antonym": antonym,
                   "communication": communication}
    with open('prompt.json', 'w', encoding="utf-8") as f:
        json.dump(json_prompt, f, ensure_ascii=False)

    # print(preset_text)
    completion_executor.execute(request_data)
"""
