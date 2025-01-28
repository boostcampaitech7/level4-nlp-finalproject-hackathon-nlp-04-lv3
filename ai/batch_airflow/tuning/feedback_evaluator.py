import re
import json
from llm_api import OpenAIApi, HcxApi


class FeedbackComparator:

    def __init__(self, api_keys, model_name, model1_feedbacks, model2_feedbacks):

        if "deepseek" in model_name:
            self.api = OpenAIApi(
                api_keys["deepseek"], base_url="https://api.deepseek.com"
            )
        elif "o1" in model_name or "gpt" in model_name:
            self.api = OpenAIApi(api_keys["openai"])

        self.model_name = model_name
        self.model1_feedbacks = model1_feedbacks
        self.model2_feedbacks = model2_feedbacks

    def test(self, instruction, idx, structured_output=None):

        model1_feedback = self.model1_feedbacks[idx]["feedback"]
        model2_feedback = self.model2_feedbacks[idx]["feedback"]
        # 1. 프롬프트 생성
        if "o1" in self.model_name:
            prompt = [
                {"role": "assistant", "content": instruction},
                {
                    "role": "user",
                    "content": f"#### 모델1 피드백:\n{model1_feedback}\n\n#### 모델2 피드백:\n{model2_feedback}",
                },
            ]
        else:
            prompt = [
                {"role": "system", "content": instruction},
                {
                    "role": "user",
                    "content": f"#### 모델1 피드백:\n{model1_feedback}\n\n#### 모델2 피드백:\n{model2_feedback}",
                },
            ]
        print(f"prompt: {prompt}")

        # 2. API 호출
        evaluate = self.api.call(prompt, self.model_name, structured_output)
        return prompt, evaluate

    def run(self, save_file, instruction, start_idx, end_idx):

        for index, feedback in enumerate(self.feedbacks):
            if start_idx > index:
                continue
            if end_idx < index:
                break
            prompt, evaluate = self.test(instruction, index)

            new_record = {
                "id": feedback["id"],
                "model": self.model_name,
                "prompt": prompt,
                "evaluate": evaluate,
            }
            with open(save_file, "a", encoding="utf-8") as file:
                file.write(json.dumps(new_record, ensure_ascii=False) + "\n")


class FeedbackEvaluator:

    def __init__(self, api_keys, model_name, feedbacks):

        if "deepseek" in model_name:
            self.api = OpenAIApi(
                api_keys["deepseek"], base_url="https://api.deepseek.com"
            )
        elif "o1" in model_name or "gpt" in model_name:
            self.api = OpenAIApi(api_keys["openai"])
        else:
            self.api = HcxApi(api_keys["naver"])

        self.model_name = model_name
        self.feedbacks = feedbacks

    def test(self, instruction, idx, structured_output=None):

        feedback = self.feedbacks[idx]["feedback"]
        # 1. 프롬프트 생성
        if "o1" in self.model_name:
            prompt = [
                {"role": "assistant", "content": instruction},
                {
                    "role": "user",
                    "content": feedback,
                },
            ]
        else:
            prompt = [
                {"role": "system", "content": instruction},
                {
                    "role": "user",
                    "content": feedback,
                },
            ]
        print(f"prompt: {prompt}")

        # 2. API 호출
        evaluate = self.api.call(prompt, self.model_name, structured_output)
        return prompt, evaluate

    def run(self, save_file, instruction, start_idx, end_idx):

        for index, feedback in enumerate(self.feedbacks):
            if start_idx > index:
                continue
            if end_idx < index:
                break
            prompt, evaluate = self.test(instruction, index)

            new_record = {
                "id": feedback["id"],
                "model": self.model_name,
                "prompt": prompt,
                "evaluate": evaluate,
            }
            with open(save_file, "a", encoding="utf-8") as file:
                file.write(json.dumps(new_record, ensure_ascii=False) + "\n")


def calculate_score(evaluate_file):
    with open(evaluate_file, "r", encoding="utf-8") as file:
        evaluates = [json.loads(line) for line in file]

    patterns = {
        "compliance": r"피드백 기준 준수\**: (\d+)/\d+",
        "validity": r"피드백 타당성\**: (\d+)/\d+",
        "consistency": r"피드백 일관성\**: (\d+)/\d+",
    }

    scores = {
        "compliance": [],
        "validity": [],
        "consistency": [],
    }

    for idx, evaluate in enumerate(evaluates):
        for key, pattern in patterns.items():
            matches = re.findall(pattern, evaluate["evaluate"])
            scores[key].append(int(matches[0]))

    for key, val in scores.items():
        print(f"{key}: len={len(val)}, sum={sum(val)}, avg={sum(val)/len(val)}")


if __name__ == "__main__":
    # Test Results Summary:
    # -----------------------------------------------------------------
    #                compliance  validity    consistency
    # HCX-003:        22          22          23
    # Tuning:         27          27          27
    # -----------------------------------------------------------------
    hcx_003 = "/data/ephemeral/home/gj/level4-nlp-finalproject-hackathon-nlp-04-lv3/ai/batch_airflow/tuning/data/HCX-003_evaluate.jsonl"
    tuning = "/data/ephemeral/home/gj/level4-nlp-finalproject-hackathon-nlp-04-lv3/ai/batch_airflow/tuning/data/lmh7w4qy_evaluate.jsonl"
    calculate_score(hcx_003)
    calculate_score(tuning)
