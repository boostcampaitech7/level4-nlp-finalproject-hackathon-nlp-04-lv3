import json
from openai import OpenAI


class FeedbackGenerator:

    def __init__(self, api_key, diaries, base_url=None):

        self.api = OpenAIApi(api_key, base_url)
        self.diaries = diaries
        self.running_batch = dict()

    def test(self, instruction, idx, model_name, structured_output):

        # 1. 프롬프트 생성
        if model_name == "o1-mini" or model_name == "o1":
            prompt = [
                {"role": "assistant", "content": instruction},
                {
                    "role": "user",
                    "content": f"**일기**:  \n{self.diaries.iloc[idx]['text']}",
                },
            ]
        else:
            prompt = [
                {"role": "system", "content": instruction},
                {
                    "role": "user",
                    "content": f"**일기**:  \n{self.diaries.iloc[idx]['text']}",
                },
            ]

        print(prompt)

        # 2. API 호출
        response = self.api.call(prompt, model_name, structured_output)
        return prompt, response

    def run(self, save_file, instruction, model_name, start_idx, end_idx):

        for index, diary in self.diaries.iterrows():
            if start_idx > index:
                continue
            if end_idx < index:
                break
            prompt, response = self.test(instruction, index, model_name, None)

            new_record = {"id": diary["id"], "prompt": prompt, "feedback": response}
            with open(save_file, "a", encoding="utf-8") as file:
                file.write(json.dumps(new_record, ensure_ascii=False) + "\n")


class OpenAIApi:

    def __init__(self, api_key, base_url):
        super().__init__()
        if not base_url:
            self.client = OpenAI(api_key=api_key)
        else:
            self.client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

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
        except:
            response_data = response.choices[0].to_dict()["message"]["content"]

        return response_data
