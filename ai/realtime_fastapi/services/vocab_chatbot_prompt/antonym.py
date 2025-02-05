# -*- coding: utf-8 -*-

import requests


class CompletionExecutor:
    def __init__(self, host, api_key, request_id):
        self._host = host
        self._api_key = api_key
        self._request_id = request_id

    def execute(self, completion_request):
        headers = {
            "Authorization": self._api_key,
            "X-NCP-CLOVASTUDIO-REQUEST-ID": self._request_id,
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "text/event-stream",
        }

        full_response = ""
        with requests.post(
            self._host + "/testapp/v1/chat-completions/HCX-003",
            headers=headers,
            json=completion_request,
            stream=True,
        ) as r:
            for line in r.iter_lines():
                if line:
                    data = line.decode("utf-8")
                    if "data:" in data:
                        try:
                            json_data = eval(data.replace("data:", ""))
                            if (
                                "message" in json_data
                                and "content" in json_data["message"]
                            ):
                                content = json_data["message"]["content"]
                                if content:  # 내용이 있을 때만 추가
                                    full_response += content
                        except:
                            pass

        print(full_response)


prompt = """
#목적: 한글 단어를 이해시키기

#내용
[단어]: 추상적인
설명: 직접적으로 눈에 보이거나 만질 수 없는 개념이나 생각을 나타내는 것을 말해요. 현실에 존재하는 사물이나 사건을 기반으로 하되, 그것들을 일반화하거나 개념화하여 보다 보편적이고 이론적인 의미로 표현하는 방식이에요.

#요구 사항:
1. [단어]에 대한 반의어를 나열합니다.
2. 나열된 각각 반의어와 한글 단어에 대한 차이점을 설명합니다.
3. 동사를 무조건 '~요' 로 합니다.

#대상: 경계선 지능인

#예시:
[단어] : 추상적인

**반의어**
구체적인 : 구체적인은 어떤 사물이나 개념이 실제로 존재하거나 경험할 수 있는 것을 의미하며, 추상적인은 눈에 보이지 않거나 손으로 만질 수 없는 것을 의미해요. 예를 들어, 사랑이라는 감정은 추상적이지만, 사랑하는 사람의 얼굴은 구체적이에요.

반의어가 여러개 있으면 여러개도 설명합니다.
"""

if __name__ == "__main__":
    completion_executor = CompletionExecutor(
        host="https://clovastudio.stream.ntruss.com",
        api_key="Bearer nv-8cb3966e22374ab892ca9a397d81672cBIlR",
        request_id="d487ef3e49c3471fa1af313f535000d5",
    )

    preset_text = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": ""},
    ]
    request_data = {
        "messages": preset_text,
        "topP": 0.01,
        "topK": 0,
        "maxTokens": 2048,
        "temperature": 0.5,
        "repeatPenalty": 5.0,
        "stopBefore": [],
        "includeAiFilters": True,
        "seed": 0,
    }

    completion_executor.execute(request_data)
