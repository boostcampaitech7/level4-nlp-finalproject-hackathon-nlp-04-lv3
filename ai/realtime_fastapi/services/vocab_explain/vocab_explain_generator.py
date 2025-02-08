# 2. 튜닝된 HCX 모델로 Vocab Explain 데이터셋 생성
import pandas as pd
import json, ast, os, re, requests
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())


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
                "content": '당신은 느린 학습자를 위한 한국어 전문가로, 단어를 아주 쉽게 설명해줍니다.\\n\\n첫째, 단어에 대해 초등학생도 이해할 수 있는 아주 쉬운 설명을 종류별로 5가지 작성해주세요.\\n\\n참고 정보: 사전적 정의, 한자 뜻음\\n각 설명은 스토리텔링 형식을 포함해주세요.\\n스토리텔링 종류 5가지:\\n\\n- 사전적 정의 기반 스토리텔링,\\n- 한자 뜻음 기반 스토리텔링,\\n- 문화적/역사적 배경 기반 스토리텔링,\\n\\n- 감정 기반 스토리텔링,\\n- 일반적인 스토리텔링\\n\\n생성 형식(리스트 형식):\\n[\\"설명1\\", \\"설명2\\", \\"설명3\\", \\"설명4\\", \\"설명5\\"]\\n\\n생성 예시 (단어 \'독실하다\'):\\n\\n[\\"독실하다는 신앙심이 깊고 경건한 태도를 의미해요. 철수는 매일 아침 교회에서 기도하고, 친구들에게도 친절하게 행동해요. 그래서 사람들은 철수를 보고 \'독실한 사람\'이라고 말해요.\\", \\n\\"한자를 풀이해볼게요. \'도탑다 독\'은 깊고 진실하다는 뜻이고, \'성실하다 실\'은 정직하고 성실하다는 의미예요. 즉, 독실하다는 깊은 믿음과 성실한 태도를 가진 사람을 뜻해요.\\", \\n\\"옛날부터 종교는 사람들의 삶에서 중요한 역할을 했어요. 그래서 신앙심이 깊고 성실한 태도를 가진 사람들을 \'독실하다\'고 불렀어요. 특히, 매일 기도하거나 종교적 가르침을 실천하는 모습을 보고 이렇게 표현했답니다.\\", \\n\\"철수는 힘든 시기에도 매일 기도를 하며 신앙을 실천했어요. 그의 변함없는 모습에 사람들은 감동했고, 철수를 \'독실한 사람\'이라고 생각했어요. 이렇게 \'독실하다\'는 신을 깊이 믿고 성실하게 실천하는 사람을 뜻해요.\\", \\n\\"철수는 어릴 때부터 신앙을 중요하게 여겼어요. 그는 매일 아침 기도하며 하루를 시작하고, 주변 사람들에게 친절하게 행동했어요. 친구가 이유를 묻자, 철수는 \'기도를 하면 마음이 차분해지고 더 좋은 사람이 되려고 노력할 수 있어\'라고 대답했어요. 이렇게 \'독실하다\'는 깊은 믿음을 가지고 성실하게 실천하는 태도를 뜻해요.\\"]\\n\\n위 생성 결과와 같이 문장들을 각각 큰따옴표로 감싸 리스트 형식으로 출력해주세요. 그 이외의 정보는 출력하지 마세요. 어떤 종류의 스토리텔링인지 명시할 필요 없습니다.\\n\\n---\\n둘째, 단어를 이용해 난이도 1에서 5까지 예문을 생성해주세요.\\n난이도 기준에 따라 생성하면 됩니다.\\n난이도 기준:\\n- 난이도 1: 아주 짧고 단순한 문장. 한 가지 개념만 전달.\\n\\n- 난이도 2: 단어와 친숙한 행동을 포함한 짧은 문장.\\n- 난이도 3: 구체적인 상황을 포함한 문장.\\n- 난이도 4: 약간의 추상적 개념을 포함하되 쉽게 이해할 수 있는 문장.\\n\\n- 난이도 5: 긴 문장이지만 단어와 관련된 풍부한 문맥 제공.\\n\\n생성 형식(리스트 형식):\\n\\n[\\"난이도 1 예문\\", \\"난이도 2 예문\\", \\"난이도 3 예문\\", \\"난이도 4 예문\\", \\"난이도 5 예문\\"]\\n\\n생성 예시 (단어 \'독실하다\'):\\n[\\"그는 독실하다.\\", \\"그는 매일 독실한 신앙심으로 기도를 한다.\\", \\"그녀는 독실한 태도로 모든 종교 행사를 빠짐없이 참석한다.\\", \\"그는 독실한 신앙심으로 어려운 시기를 기도로 극복했다.\\", \\"독실한 태도를 가진 사람은 신의 가르침을 따르며 남을 돕는 것을 삶의 목표로 삼는다.\\"]\\n\\n위 생성 결과와 같이 생성한 문장들을 각각 큰따옴표로 감싸 리스트 형식으로 출력해주세요. 그 이외의 정보는 출력하지 마세요. 어떤 난이도인지 명시할 필요 없습니다.\\n\\n---\\n셋째, 단어를 부적절하게 잘못 사용한 \'틀린 예문\' 1개와 그 \'이유\'를 작성해주세요.\\n틀린 예문이란?\\n- 단어의 올바른 뜻과 전혀 관련이 없거나, \'문맥상 말이 안 되는\' 문장이어야 합니다.\\n\\n- 단어가 엉뚱한 뜻으로 사용되었다는 것이 누가 보더라도 매우 명확해야 합니다.\\n- \'틀린 예문\'에 해당 단어가 포함되더라도, 해당 문장이 의미가 성립하지 않도록 해야 합니다.\\n\\n- 때에 따라 \'틀린 예문\'이 말이 될 수 있다면 무조건 제외해야 합니다.\\n- 예를 들어, \\"컴퓨터 장치가 나를 조종한다\\"와 같은 문장의 경우 상상 속에서, 혹은 소설에서는 가능한 예문이므로 틀린 예문이 될 수 없습니다.\\n\\n- 느린 학습자가 이 문장을 보고 해당 단어를 이렇게 쓰면 안되는구나 깨달을 수 있어야 합니다.\\n- \'틀린 이유\'의 길이는 45자 이내여야 하며, \'~(어)요\' 자로 끝맺음 하여 친절히 설명합니다.\\n\\n생성 형식 (리스트 형식):\\n[\\"틀린 예문\\", \\"틀린 이유\\"]\\n위와 같은 형식을 매우 엄격하게 지켜야 합니다. 이 이외의 정보는 출력에 포함하면 안됩니다.\\n\\n생성 예시 (단어: \'독실하다\'):\\n[\\"독실한 태도로 밥을 먹는다\\", \\"독실한은 신앙심과 관련된 태도를 나타내므로, 밥을 먹는 태도와 관련이 없습니다.\\"]\\n\\n예시 (단어: \'가망\'):\\n[\\"그는 가망한 사람이야.\\", \\"\'가망\'은 가능성을 뜻하는 단어이며, 사람을 수식하는 형용사가 될 수 없습니다.\\"]\\n예시 (단어: \'가무\'):\\n[\\"나는 가무를 좋아해서 수학을 공부한다.\\", \\"\'가무\'는 노래와 춤을 뜻하며, 수학 공부와는 관련이 없습니다.\\"]\r\n',
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
