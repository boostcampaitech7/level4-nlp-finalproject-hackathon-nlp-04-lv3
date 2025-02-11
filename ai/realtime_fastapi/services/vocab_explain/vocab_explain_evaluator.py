# 3. HCX-003 vs (Instruction Tuning)HCX-003
import json, os, sys, time
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

sys.path.append("C:/level4-nlp-finalproject-hackathon-nlp-04-lv3/ai")
from batch_airflow.tuning.llm_api import OpenAIApi


class VocabExplainEvaluator:
    def __init__(self):
        self._api_key = os.getenv("GEMINI_API_KEY")
        self._base_url = os.getenv("GEMINI_BASE_URL")

    def query_gemini(self, content):
        openai_api = OpenAIApi(self._api_key, base_url=self._base_url)

        prompt = [
            {
                "role": "system",
                "content": "당신은 느린 학습자를 위한 한국어 전문가입니다.",
            },
            {"role": "user", "content": content},
        ]
        response = openai_api.call(
            prompt, model_name="gemini-2.0-flash-thinking-exp", structured_output=None
        )

        # response가 JSON인지 문자열인지 확인한 후 변환
        if isinstance(response, str):
            parsed_response = self.parse_response(response)
        else:
            parsed_response = response  # 이미 JSON인 경우

        return parsed_response

    def parse_response(self, response_text):
        try:
            if isinstance(response_text, dict):
                return response_text  # 이미 JSON이면 그대로 반환

            response_text = response_text.strip()

            # ```json 태그 제거
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]

            return json.loads(response_text)  # 변환 시도
        except json.JSONDecodeError:
            print("❌ JSON 파싱 실패: 응답이 JSON 형식이 아닙니다.")
            return None

    def evaluate_response(self, original_data, tuned_data):
        """Gemini Flash Thinker를 사용해 HCX 원본 모델 vs 튜닝 모델 비교 평가"""
        prompt = f"""
        당신은 한국어 단어 설명이 느린학습자에게 적합한지 평가하는 전문가입니다.
        다음 두 개의 단어 설명을 **객관적 기준에 따라 비교 평가**하고, 점수를 매긴 후 분석을 제공하세요.

        ---
        ### **📊 평가 기준 (각각 1~10점으로 평가)**
        1️. **정확성 (Accuracy)**: 설명이 단어의 사전적 정의와 잘 일치하는가?
        2️. **명확성 (Clarity)**: 설명이 모호하지 않고 쉽게 이해되는가? 쉬운 단어를 사용했는가? (Flesch-Kincaid 지수 고려)
        3️. **창의성 / 다양성 (Creativity & Diversity)**: 여러 설명 방식(비유, 스토리텔링 등)을 활용했는가?
        4️. **적절성 (Appropriateness)**: 예문이 실제 사용 사례와 맞아떨어지는가?

        ---
        ### **원본 HCX 모델 출력 (튜닝 전)**
        {original_data}

        ---
        ### **튜닝된 HCX 모델 출력 (튜닝 후)**
        {tuned_data}

        ---
        ### **점수 평가 방식**
        1. **튜닝 전**과 **튜닝 후** 각각의 점수를 1~10점으로 매기세요.
        2. 최종적으로 **튜닝 후 모델이 총 몇점 개선되었는지 요약**하세요.

        ---
        ### **최종 출력 형식  (반드시 JSON 형태로 출력)**
        출력 결과는 아래 JSON 형식으로 반드시 작성하세요. 그 이외의 형식은 절대 안됩니다.

        ```json
        {{
        "evaluation": {{
            "accuracy": {{"before": X, "after": X}},
            "clarity": {{"before": X, "after": X}},
            "creativity": {{"before": X, "after": X}},
            "appropriateness": {{"before": X, "after": X}}
        }},
        "final_score": "튜닝 후 모델이 총 XX점 향상되었습니다."
        }}
        ```
        """

        response = self.query_gemini(prompt)

        # 응답이 문자열이면 JSON 변환, 그렇지 않으면 그대로 사용
        if isinstance(response, str):
            try:
                evaluation = json.loads(response)
                return evaluation
            except json.JSONDecodeError:
                print("❌ JSON 파싱 실패: 응답 형식이 올바르지 않습니다.")
                return None
        else:
            evaluation = response  # 이미 dict이면 그대로 사용
            return evaluation

    def calculate_average_scores(self, evaluation_results):
        """전체 평가 결과의 평균 점수를 계산"""
        total_scores = {
            "accuracy": {"before": 0, "after": 0},
            "clarity": {"before": 0, "after": 0},
            "creativity": {"before": 0, "after": 0},
            "appropriateness": {"before": 0, "after": 0},
        }

        num_samples = len(evaluation_results)

        # 모든 단어의 점수 합산
        for result in evaluation_results:
            for criterion in total_scores.keys():
                total_scores[criterion]["before"] += result["evaluation"][criterion][
                    "before"
                ]
                total_scores[criterion]["after"] += result["evaluation"][criterion][
                    "after"
                ]

        # 평균 계산
        average_scores = {
            criterion: {
                "before": round(total_scores[criterion]["before"] / num_samples, 2),
                "after": round(total_scores[criterion]["after"] / num_samples, 2),
            }
            for criterion in total_scores.keys()
        }

        print("\n📊 **평균 평가 점수 (튜닝 전 vs. 튜닝 후)**")
        print(json.dumps(average_scores, indent=4, ensure_ascii=False))

        return average_scores

    def evaluate_dataset(self, original_jsonl, tuned_jsonl, output_jsonl):
        """데이터셋 전체를 평가하고 결과를 저장"""
        with open(original_jsonl, "r", encoding="utf-8") as file1, open(
            tuned_jsonl, "r", encoding="utf-8"
        ) as file2:
            original_data = [json.loads(line) for line in file1]
            tuned_data = [json.loads(line) for line in file2]

        evaluation_results = []

        for orig, tuned in zip(original_data, tuned_data):
            time.sleep(2)
            # 단어별 평가 수행
            evaluation = self.evaluate_response(orig, tuned)

            # JSON 형식으로 결과 저장
            result = {
                "vocab": orig["vocab"],
                "evaluation": evaluation["evaluation"],
                "final_score": evaluation["final_score"],
            }

            evaluation_results.append(result)
            print(result)
            print(f"✅ {orig['vocab']} 평가 완료")

        print(f"\n📊 전체 평가 완료!")

        # 평가 결과를 JSONL 파일로 저장
        with open(output_jsonl, "w", encoding="utf-8") as jsonl_file:
            for result in evaluation_results:
                jsonl_file.write(json.dumps(result, ensure_ascii=False) + "\n")

        print(f"\n📂 평가 결과 저장 완료: {output_jsonl}")

        # 평균 점수 계산
        self.calculate_average_scores(evaluation_results)

        return evaluation_results


if __name__ == "__main__":
    evaluator = VocabExplainEvaluator()
    evaluation_results = evaluator.evaluate_dataset(
        "./data/HCX_arabugi_vocab_explain.jsonl",
        "./data/2wk3wvmg_arabugi_vocab_explain.jsonl",
        "./data/arabugi_vocab_explain_evaluation.jsonl",
    )
