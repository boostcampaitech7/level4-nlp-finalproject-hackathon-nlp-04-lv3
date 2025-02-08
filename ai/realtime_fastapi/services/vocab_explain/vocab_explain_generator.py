# 2. 튜닝된 HCX 모델로 Vocab Explain 데이터셋 생성
import pandas as pd
import json, ast, os, re, requests
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

with open(
    f"./services/vocab_explain/vocab_explain_prompt.json",
    "r",
    encoding="utf-8",
) as file:
    prompts = json.load(file)


class VocabExplainGenerator:
    def __init__(self, host, api_key, request_id):
        self._host = host
        self._api_key = api_key
        self._request_id = request_id

    def query_model(self, content):
        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "X-NCP-CLOVASTUDIO-REQUEST-ID": self._request_id,
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json",
        }

        preset_text = [
            {
                "role": "system",
                "content": prompts["system_prompt"],
            },
            {"role": "user", "content": content},
        ]

        request_data = {
            "messages": preset_text,
            "topP": 0.8,
            "topK": 0,
            "maxTokens": 1024,
            "temperature": 0.25,
            "repeatPenalty": 5.0,
            "stopBefore": [],
            "includeAiFilters": True,
            "seed": 0,
        }

        response = requests.post(
            self._host + "/testapp/v2/tasks/2wk3wvmg/chat-completions",
            headers=headers,
            json=request_data,
            stream=True,
        ).json()
        response_text = response["result"]["message"]["content"]

        return response_text

    def generate_prompt(self, vocab, hanja, dict_mean):
        return f"단어: {vocab}\n한자 뜻음: {hanja}\n사전적 정의: {dict_mean}"

    def extract_data(self, generated_data):
        matches = re.findall(r": (\[[^\]]+\])", generated_data)

        easy_explain = matches[0][1:-1].split(", ")
        correct_example = matches[1][1:-1].split(", ")
        incorrect_example = matches[2][1:-1].split(", ")

        return easy_explain, correct_example, incorrect_example

    def create_dataset(self, vocab_csv_path, output_jsonl_path):
        df = pd.read_csv(vocab_csv_path)
        dataset = []

        with open(output_jsonl_path, "w", encoding="utf-8") as jsonl_file:
            for _, row in df.iterrows():
                vocab, hanja, dict_mean = row["vocab"], row["hanja"], row["dict_mean"]

                # hanja 문자열을 리스트로 변환
                hanja_list = ast.literal_eval(hanja)

                # 모델에 전달할 입력 생성
                prompt = self.generate_prompt(vocab, hanja, dict_mean)
                generated_data = self.query_model(prompt)
                print(generated_data)

                if generated_data:
                    # 데이터 정제
                    easy_explain, correct_example, incorrect_example = (
                        self.extract_data(generated_data)
                    )

                    json_data = {
                        "vocab": vocab,
                        "hanja": hanja_list,
                        "dict_mean": dict_mean,
                        "easy_explain": easy_explain,
                        "correct_example": correct_example,
                        "incorrect_example": incorrect_example,
                    }

                    jsonl_file.write(json.dumps(json_data, ensure_ascii=False) + "\n")
                    dataset.append(json_data)
                    print(f"✅ {vocab} 데이터 생성 완료")

        print(f"\n📂 데이터셋 저장 완료: {output_jsonl_path}")
        return dataset


if __name__ == "__main__":
    # 튜닝된 HCX 모델로 Vocab Explain 데이터셋 생성
    generator = VocabExplainGenerator(
        host=os.getenv("CLOVASTUDIO_HOST"),
        api_key=os.getenv("CLOVASTUDIO_API_KEY"),
        request_id=os.getenv("EXPLAIN_REQUEST_ID"),
    )

    dataset = generator.create_dataset(
        f"../vocab_explain/data/arabugi_vocab.csv",
        "data/2wk3wvmg_arabugi_vocab_explain.jsonl",
    )
