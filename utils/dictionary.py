import os
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
import pandas as pd
from tqdm import tqdm

load_dotenv()


class Dictionary:

    def __init__(self, api_key):
        self.api_key = api_key

    def meaning(self, vocab):
        url = f"https://opendict.korean.go.kr/api/search?key={self.api_key}&q={vocab}&req_type=json"
        response = requests.get(url)
        data = response.json()
        if "item" not in data["channel"]:
            return None

        item = data["channel"]["item"][0]
        return {
            "vocab": vocab,
            "dict_mean": item.get("sense")[0]["definition"],
            "hanja": item.get("sense")[0]["origin"],
            "hanja_mean": self.extract_hanja(item.get("sense")[0]["link"]),
        }

    def extract_hanja(self, link):
        headers = {"User-Agent": "Mozilla/5.0"}  # User-Agent 추가
        response = requests.get(link, headers=headers)

        if response.status_code != 200:
            print(f"⚠ 요청 실패: {response.status_code}")
            return []

        soup = BeautifulSoup(response.text, "html.parser")
        hanja_list = []

        # 한자와 첫 번째 뜻음 추출
        for dl in soup.select(".hanja dl"):
            hanja_char_elem = dl.select_one(".hanja_font")
            first_meaning_elem = dl.select_one("dd:not(.chi_boosu)")

            if hanja_char_elem and first_meaning_elem:
                hanja_char = hanja_char_elem.text.strip()
                first_meaning = first_meaning_elem.text.strip()
                hanja_list.append((hanja_char, first_meaning))

        return hanja_list


def generate_initial_vocabs(api_key):
    df = pd.read_csv("hf://datasets/binjang/NIKL-korean-english-dictionary/2024_01.csv")
    # 1. 고급 단어만 선택
    df = df[df["Vocabulary Level"] == "고급"]
    # 2. 명사, 동사, 형용사, 부사 단어만 선택
    df = df[df["Part of Speech"].isin({"명사", "동사", "형용사", "부사"})]
    # 3. 단어 길이가 2 이상인 단어만 선택
    df = df[df["Form"].astype(str).str.len().gt(1)].reset_index(drop=True)

    dictionary = Dictionary(api_key)
    meaning_list = list()
    for index, row in tqdm(df.iterrows(), total=len(df)):
        meaning = dictionary.meaning(row["Form"])
        # 4. 한자가 없으면 제외
        if len(meaning["hanja"]) != 0:
            meaning_list.append(meaning)
        if index == 100:
            break

    meaning_df = pd.DataFrame(meaning_list)
    # CSV 저장 (튜플 리스트 그대로 유지)
    csv_filename = "korean_vocab_meaning.csv"
    meaning_df.to_csv(csv_filename, index=False, encoding="utf-8-sig")

    print(f"✅ CSV 파일 저장 완료! 📁 {csv_filename}")


if __name__ == "__main__":
    api_key = os.getenv("OPENDICT_API_KEY")

    # 1. 단어의 정의, 한자, 한자 뜻음 검색하기
    vocab = "존경하다"
    dictionary = Dictionary(api_key)
    print(dictionary.meaning(vocab))

    # 2. NIKL-korean-english-dictionary 데이터셋에 있는 고급 단어의 정의, 한자, 한자 뜻음 파일에 저장하기
    generate_initial_vocabs(api_key)
