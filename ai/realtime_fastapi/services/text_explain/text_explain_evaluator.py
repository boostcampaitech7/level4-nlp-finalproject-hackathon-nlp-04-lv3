# 1. Text Explain 샘플 데이터 생성
# 2. Text Explain 모델 평가
import json, os, sys, re
import time
from dotenv import load_dotenv, find_dotenv
from text_explain import CompletionExecutor

sys.path.append("C:/aitech7_final/level4-nlp-finalproject-hackathon-nlp-04-lv3/ai")
from batch_airflow.tuning.llm_api import OpenAIApi

with open(
    f"../../services/text_explain/text_explain_prompt.json", "r", encoding="utf-8"
) as file:
    prompts = json.load(file)


load_dotenv(find_dotenv())


class TextExplainProcessor:
    """긴 글 설명 생성 + 평가"""

    def __init__(self):
        self._input_file = "data/text_focused.jsonl"
        self._explain_output = "data/text_explain.jsonl"
        self._evaluation_output = "data/text_explain_evaluation.jsonl"

        # HCX 모델 설정
        self.executor = CompletionExecutor(
            host=os.getenv("CLOVASTUDIO_HOST"),
            api_key=os.getenv("CLOVASTUDIO_API_KEY"),
            system_prompt=prompts["system_prompt"],
        )

        # GEMINI 모델 설정
        self.gemini_api = OpenAIApi(
            api_key=os.getenv("GEMINI_API_KEY"), base_url=os.getenv("GEMINI_BASE_URL")
        )

        # 프롬프트 템플릿 로드
        with open("./text_explain_prompt.json", "r", encoding="utf-8") as file:
            self.prompts = json.load(file)

    def classify_type(self, focused):
        """단어 개수에 따라 유형(word/phrase/sentence/paragraph) 결정"""
        count = len(focused.split(" "))
        return (
            "word"
            if count == 1
            else (
                "phrase"
                if 2 <= count <= 5
                else "sentence" if 6 <= count <= 20 else "paragraph"
            )
        )

    def generate_prompt(self, text, focused):
        """유형에 따라 적절한 프롬프트 생성"""
        type = self.classify_type(focused)

        # CoT, Explain, Few-shot 프롬프트 적용
        cot_prompt = self.prompts["cot_prompt"][type].format(text=text, focused=focused)
        explain_prompt = self.prompts["explain_prompt"][type].format(
            text=text, focused=focused
        )
        fewshot_prompt = self.prompts["fewshot_prompt"][type].format(
            text=text, focused=focused
        )

        # 문단 유형은 CoT 제외
        prompt = (
            explain_prompt + fewshot_prompt
            if type == "paragraph"
            else cot_prompt + explain_prompt + fewshot_prompt
        )
        return prompt

    def generate_explanation(self):
        """HCX를 활용해 긴 글 설명 생성 후 저장"""
        with open(self._input_file, "r", encoding="utf-8") as file:
            dataset = [json.loads(line) for line in file]

        explanation_results = []

        for item in dataset:
            text = item["text"]
            focused = item["focused"][9:]
            explanations = []

            for focus in focused:
                # HCX에 설명 요청
                prompt = self.generate_prompt(text, focus)
                response = self.executor.execute(prompt)
                print("✍🏻 HCX 전체 응답:")
                print(response)

                if response["result"] is None:
                    print(f"❌ HCX 응답 없음: {focus}")
                    explanation = "설명 생성 실패 (응답 없음)"
                    continue
                else:
                    response_text = response["result"]["message"]["content"]
                    explanation = re.sub(
                        r"1. 글의 주제 :.*?\n2. 주요 키워드 :.*?\n3. 핵심 개념 여부 :.*?\n",
                        "",
                        response_text,
                        flags=re.DOTALL,
                    )
                print(explanation)
                explanations.append(explanation)
                time.sleep(2)

            explanation_results.append(
                {"text": text, "focused": focused, "explanation": explanations}
            )
            print(f"✅ {text[:10]} 설명 생성 완료")

        # JSONL로 저장
        with open(self._explain_output, "w", encoding="utf-8") as jsonl_file:
            for result in explanation_results:
                jsonl_file.write(json.dumps(result, ensure_ascii=False) + "\n")

        print(f"\n📂 긴 글 설명 저장 완료: {self._explain_output}")

    def evaluate_explanation(self):
        """GEMINI를 활용해 설명 평가 후 저장"""
        evaluated_data = []

        with open(self._explain_output, "r", encoding="utf-8") as jsonl_file:
            for line in jsonl_file:
                data = json.loads(line)
                text, focused, explanation = (
                    data["text"],
                    data["focused"],
                    data["explanation"],
                )

                # GEMINI에 평가 요청
                prompt = f"""
                긴 글:
                {text}

                설명할 부분 (Focused):
                {focused}

                생성된 설명:
                {explanation}

                평가 기준 (각 1~10점):
                1️. **정확성 (Accuracy)**: 설명이 긴 글 내용과 일치하는가?
                2️. **명확성 (Clarity)**: 설명이 모호하지 않고 쉽게 이해되는가? (Flesch-Kincaid 지수 고려)
                3️. **창의성 / 다양성 (Creativity & Diversity)**: 다양한 설명 방식(비유, 예시 등)을 활용했는가?
                4️. **적절성 (Appropriateness)**: 설명이 문맥을 해치지 않고 보완하는 역할을 하는가?

                💡 **점수를 1~10점으로 매기고, 개선점을 분석하세요.**

                🚨 **반드시 아래 JSON 형식으로 응답하세요.**
                ```json
                {{
                    "evaluation": {{
                        "accuracy": X,
                        "clarity": X,
                        "creativity": X,
                        "appropriateness": X
                    }},
                    "final_score": "총 XX점"
                }}
                ```
                """
                response = self.gemini_api.call(
                    [
                        {
                            "role": "system",
                            "content": "당신은 긴 글 설명을 평가하는 전문가입니다.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    model_name="gemini-2.0-flash-thinking-exp",
                    structured_output=None,
                )

                try:
                    evaluation = json.loads(response)
                    data["evaluation"] = evaluation
                except json.JSONDecodeError:
                    print(f"❌ JSON 파싱 실패: {focused} 평가 불가")
                    data["evaluation"] = "평가 실패"

                evaluated_data.append(data)

        # 평가 결과 저장
        with open(self._evaluation_output, "w", encoding="utf-8") as jsonl_file:
            for item in evaluated_data:
                jsonl_file.write(json.dumps(item, ensure_ascii=False) + "\n")

        print(f"✅ 설명 평가 완료: {self._evaluation_output}")


if __name__ == "__main__":
    processor = TextExplainProcessor()

    # 설명 생성
    processor.generate_explanation()

    # 생성된 설명 평가
    processor.evaluate_explanation()
