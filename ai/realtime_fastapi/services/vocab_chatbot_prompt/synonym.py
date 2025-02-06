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


# 유의어 버튼 프롬프트
prompt = """
#목적: 한글 단어를 이해시키기

#내용
[단어]: 매혹하다
설명: 어떤 대상이 사람의 마음을 강하게 끌어당겨 넋을 잃게 하거나 깊이 빠지게 하다는 뜻이에요. 주로 아름다움, 매력, 독특함, 또는 특별한 무언가가 사람을 사로잡을 때 사용됩니다.

#요구 사항:
1. [단어]에 대한 유의어를 나열합니다.
2. 나열된 각각 유의어와 한글 단어에 대한 차이점을 설명합니다.
3. 동사를 무조건 '~요' 로 합니다.

#대상: 경계선 지능인

#예시:
[단어] : 매혹하다

**유의어**
* 끌리다 : 시선이나 마음이 자꾸 한쪽으로 향해요.
- 매혹하다는 어떤 대상에 대해 강하게 끌려 관심을 가지게 되는 것이고, 끌리다는 어떠한 것에 대한 호기심이나 흥미가 생겨 그것에 집중하게 되는 것이에요.

유의어가 여러개 있으면 여러개도 설명합니다.
"""

if __name__ == "__main__":
    completion_executor = CompletionExecutor(
        host="https://clovastudio.stream.ntruss.com",
        api_key="Bearer nv-8cb3966e22374ab892ca9a397d81672cBIlR",
        request_id="c3f82c8f4570422091190c36c17904cb",
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
