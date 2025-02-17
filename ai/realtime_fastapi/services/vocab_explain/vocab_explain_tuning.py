# 1. Vocab Explain 모델 생성 (HCX 튜닝)
import requests, os, sys, json
import pandas as pd
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

sys.path.append("C:/level4-nlp-finalproject-hackathon-nlp-04-lv3/ai")
from batch_airflow.tuning.llm_api import OpenAIApi

with open(
    f"./services/vocab_explain/vocab_explain_prompt.json",
    "r",
    encoding="utf-8",
) as file:
    prompts = json.load(file)


## 1-1. Instruction Dataset 생성
class InstructionDatasetGenerator:
    def __init__(self):
        self._api_key = os.getenv("GEMINI_API_KEY")
        self._base_url = os.getenv("GEMINI_BASE_URL")

    # Gemini를 사용하여 단어 설명 및 예문을 생성
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
        return response

    # 단어별로 Instruction Dataset을 생성하고 저장
    def generate_vocab_explain(self, file_path, output_path):
        df = pd.read_csv(file_path)

        for idx, row in df.iterrows():
            vocab = row["vocab"]
            hanja = row["hanja"]
            dict_mean = row["dict_mean"].replace("\n", " ")

            # 1️. 단어별 쉬운 설명 생성 (5가지 스토리텔링 방식)
            explain_prompt = prompts["easy_explain_prompt"].format(
                vocab=vocab, dict_mean=dict_mean, hanja=hanja
            )
            df.loc[idx, "easy_explain"] = str(self.query_gemini(explain_prompt))

            # 2️. 난이도별 옳은 예문 생성 (난이도 1~5)
            correct_ex_prompt = prompts["correct_ex_prompt"].format(vocab=vocab)
            df.loc[idx, "correct_example"] = str(self.query_gemini(correct_ex_prompt))

            # 3️. 틀린 예문 & 이유 생성
            incorrect_ex_prompt = prompts["incorrect_ex_prompt"].format(vocab=vocab)
            df.loc[idx, "incorrect_example"] = str(
                self.query_gemini(incorrect_ex_prompt)
            )

        df.to_csv(output_path, index=False, encoding="utf-8-sig")
        print(f"✅ Vocab Explain Dataset이 {output_path}에 저장되었습니다.")

    # CSV to JSONL
    def generate_jsonl_file(csv_file_path, jsonl_file_path):
        # Vocab Explain CSV 파일 불러오기
        df = pd.read_csv(csv_file_path)

        # 시스템 프롬프트 불러오기
        system_prompt = prompts["system_prompt"]

        # Instruction Dataset JSONL 파일 생성
        with open(jsonl_file_path, "w", encoding="utf-8") as jsonl_file:
            for idx, row in df.iterrows():
                # 각 단어의 정보 구성
                text = f"단어: {row['vocab']}\n한자뜻음: {row['hanja']}\n사전적 정의: {row['dict_mean']}"
                completion = f"쉬운 설명: {row['easy_explain']}\n옳은 예시: {row['correct_example']}\n틀린 예시: {row['incorrect_example']}"

                # JSON 객체 생성
                json_obj = {
                    "system_prompt": system_prompt,
                    "c_id": idx,  # 0부터 시작하는 고유 ID
                    "t_id": 0,
                    "text": text,
                    "completion": completion,
                }

                # JSONL 형식으로 저장
                jsonl_file.write(json.dumps(json_obj, ensure_ascii=False) + "\n")

        print(
            f"✅ Instruction Dataset 파일이 성공적으로 생성되었습니다: {jsonl_file_path}"
        )


## 1-2. HCX 튜닝 작업 생성
class CreateTaskExecutor:
    def __init__(self):
        self._host = os.getenv("CLOVASTUDIO_HOST")
        self._uri = "/tuning/v2/tasks"
        self._api_key = os.getenv("CLOVASTUDIO_API_KEY")

        self.request_data = {
            "tuningType": "PEFT",
            "taskType": "GENERATION",
            "trainingDatasetBucket": os.getenv("BUCKET_NAME"),
            "trainingDatasetAccessKey": os.getenv("NAVER_ACCESS_KEY"),
            "trainingDatasetSecretKey": os.getenv("NAVER_SECRET_KEY"),
        }

    def execute(self, name, model, train_epochs, learning_rate, file_path):
        self.request_data["name"] = name
        self.request_data["model"] = model
        self.request_data["trainEpochs"] = train_epochs
        self.request_data["learningRate"] = learning_rate
        self.request_data["trainingDatasetFilePath"] = file_path

        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
        }

        request = requests.post(
            self._host + self._uri, json=self.request_data, headers=headers
        ).json()

        if "status" in request and request["status"]["code"] == "20000":
            return request["result"]
        else:
            return request


## 1-3. HCX 튜닝 작업 조회
class FindTaskExecutor:
    def __init__(self):
        self._host = os.getenv("CLOVASTUDIO_HOST")
        self._uri = "/tuning/v2/tasks"
        self._api_key = os.getenv("CLOVASTUDIO_API_KEY")

    def execute(self, task_id):
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": f"Bearer {self._api_key}",
        }

        response = requests.get(
            self._host + self._uri + task_id, headers=headers
        ).json()
        if "status" in response and response["status"]["code"] == "20000":
            return response["result"]
        else:
            return response


if __name__ == "__main__":
    # 1-1. Instruction Dataset 생성
    instruction_generator = InstructionDatasetGenerator()
    vocab_explain = instruction_generator.generate_vocab_explain(
        file_path=f"../vocab_explain/data/vocab.csv",
        output_path="data/vocab_explain.csv",
    )
    csv_to_jsonl = instruction_generator.generate_jsonl_file(
        csv_file_path=f"../vocab_explain/data/vocab_explain.csv",
        jsonl_file_path="data/instruction_dataset.jsonl",
    )

    # 1-2. HCX 튜닝 작업 생성
    name = "vocab_explain_task"
    model = "HCX-003"  # HCX-DASH-001
    train_epochs = "8"
    learning_rate = "0.00001"
    file_path = "vocab_explain_instruction_dataset.jsonl"
    completion_executor = CreateTaskExecutor()
    response_text = completion_executor.execute(
        name, model, train_epochs, learning_rate, file_path
    )
    print(
        f"name: {name}, train_epochs: {train_epochs}, learning_rate: {learning_rate}, file_path: {file_path}"
    )
    print(response_text)

    # 1-3. HCX 튜닝 작업 조회
    task_id = "2wk3wvmg"
    completion_executor = FindTaskExecutor()
    response_text = completion_executor.execute(task_id)
    print(task_id)
    print(response_text)

    response_text = completion_executor.execute_list(0, 20)
    print(response_text)
