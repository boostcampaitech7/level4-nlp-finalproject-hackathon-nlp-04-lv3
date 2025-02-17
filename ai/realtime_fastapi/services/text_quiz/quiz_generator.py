from llm_api import OpenAIApi, HcxApi


class QuizGenerator:

    def __init__(self, api_keys, model_name, context):

        if "o1" in model_name or "gpt" in model_name:
            self.api = OpenAIApi(api_keys["openai"])
        elif "gemini-2.0-flash-thinking-exp-01-21" in model_name:
            self.api = OpenAIApi(
                api_keys["google"],
                base_url="https://generativelanguage.googleapis.com/v1beta/",
            )
        else:
            self.api = HcxApi(api_keys["naver"])

        self.model_name = model_name
        self.context = context

    def generate_quiz(self, instruction, idx, structured_output=None):

        # 1. 필요한 열 추출
        row = self.context.iloc[idx]  # 한 행을 가져옴
        title = row["title"]
        category = row["category"]
        content = row["content"]

        # 2. 프롬프트 생성
        user_content = (
            f"**제목**: {title}\n**카테고리**: {category}\n**내용**:\n{content}"
        )

        if "o1" in self.model_name:
            prompt = [
                {"role": "assistant", "content": instruction},
                {"role": "user", "content": user_content},
            ]
        else:
            prompt = [
                {"role": "system", "content": instruction},
                {"role": "user", "content": user_content},
            ]

        print(prompt)

        # 3. API 호출
        quiz = self.api.call(prompt, self.model_name, structured_output)
        return prompt, quiz
