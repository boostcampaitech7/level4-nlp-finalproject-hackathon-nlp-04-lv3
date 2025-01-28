import json
from llm_api import OpenAIApi, HcxApi


class FeedbackGenerator:

    def __init__(self, api_keys, model_name, diaries):

        if "deepseek" in model_name:
            self.api = OpenAIApi(api_keys["deepseek"], base_url="https://api.deepseek.com")
        elif "o1" in model_name or "gpt" in model_name:
            self.api = OpenAIApi(api_keys["openai"])
        else:
            self.api = HcxApi(api_keys["naver"])

        self.model_name = model_name
        self.diaries = diaries

    def test(self, instruction, idx, structured_output=None):

        # 1. 프롬프트 생성
        if "o1" in self.model_name:
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
        feedback = self.api.call(prompt, self.model_name, structured_output)
        return prompt, feedback

    def run(self, save_file, instruction, start_idx, end_idx):

        for index, diary in self.diaries.iterrows():
            if start_idx > index:
                continue
            if end_idx < index:
                break
            prompt, feedback = self.test(instruction, index)

            new_record = {"id": diary["id"], "model": self.model_name, "prompt": prompt, "feedback": feedback}
            with open(save_file, "a", encoding="utf-8") as file:
                file.write(json.dumps(new_record, ensure_ascii=False) + "\n")
