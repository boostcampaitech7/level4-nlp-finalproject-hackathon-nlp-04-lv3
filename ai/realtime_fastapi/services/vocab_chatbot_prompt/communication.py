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


# 주어진 단어를 활용하여 일상생활 대화를 생성하는 프롬프트
prompt = """
#목적: 한글 단어를 이해시키기

[내용]
단어: 독실한
설명: 어떤 믿음이나 신념을 매우 깊고 진지하게 믿고 따르는 것을 뜻해요 주로 종교를 열심히 믿는 사람을 말할 때 많이 사용하지만, 꼭 종교가 아니어도 어떤 생각이나 가치를 진심으로 지키는 사람에게도 쓸 수 있어요.

#요구 사항:
1. [내용] 에 대해서 일상생활 대화를 생성합니다.
2. '철수', '영희' 등 이름을 붙입니다.
3. '친구', 'AI' 이름을 제외시킵니다.

#대상:
- 느린 학습자
- 경계선 지능인
"""

if __name__ == "__main__":
    completion_executor = CompletionExecutor(
        host="https://clovastudio.stream.ntruss.com",
        api_key="Bearer nv-8cb3966e22374ab892ca9a397d81672cBIlR",
        request_id="89ef25479e574f83817a80e6b8512586",
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
