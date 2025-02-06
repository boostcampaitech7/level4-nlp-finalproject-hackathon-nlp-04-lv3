from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
import requests
import json
import os
import re


router = APIRouter(prefix="/ai", tags=["ai"])

load_dotenv()

API_URL = "https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/HCX-003"
API_KEY = os.getenv("HCX_API_KEY")


def query_hyperclovax(prompt):
    """
    HyperCLOVA API를 사용하여 텍스트를 반환하는 함수.
    """
    headers = {
        "Authorization": API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    payload = {
        "temperature": 0.7,
        "maxTokens": 300,
        "topP": 0.85,
        "repeatPenalty": 5.0,
        "messages": [
            {
                "role": "system",
                "content": "당신은 초등학생도 이해할 수 있도록 어려운 글을 쉽게 풀어주는 한국어 전문가입니다. 느린 학습자가 글을 정확히 이해할 수 있도록 친절하고 깔끔한 설명을 제공합니다.",
            },
            {"role": "user", "content": prompt},
        ],
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        response_text = response.json()["result"]["message"]["content"]
        content = re.sub(
            r"1. 글의 주제 :.*?\n2. 주요 키워드 :.*?\n3. 핵심 개념 여부 :.*?\n",
            "",
            response_text,
            flags=re.DOTALL,
        )

        ai_data = {"status": response.json()["status"]["code"], "content": content}
        print("\n✅ **[API 응답 결과]**")
        print(ai_data)
        return ai_data
    else:
        raise HTTPException(status_code=500, detail="❌ HCX API 요청 실패 ❌")


def generate_focused_prompt(text, focused):
    """
    사용자가 드래그한 부분(focused)의 유형을 분석하여 적절한 프롬프트를 생성.
    """
    # 단어 개수에 따라 (단어/어구/문장/문단) 유형 분석
    count = len(focused.split(" "))
    type = (
        "word"
        if count == 1
        else (
            "phrase"
            if 2 <= count <= 5
            else "sentence" if 6 <= count <= 20 else "paragraph"
        )
    )

    # 프롬프트 JSON 파일 열기
    with open(
        "C:/level4-nlp-finalproject-hackathon-nlp-04-lv3/ai/realtime_fastapi/services/text_explain/text_explain_prompt.json",
        "r",
        encoding="utf-8",
    ) as file:
        prompts = json.load(file)

    # (단어/어구/문장/문단) 유형에 따라 서로 다른 CoT prompt, Fewshot prompt 사용
    cot_prompt = prompts["cot_prompt"][type].format(text=text, focused=focused)
    fewshot_prompt = prompts["fewshot_prompt"][type].format(text=text, focused=focused)

    # 긴글 설명 프롬프트
    if type == "word":  # 단어
        prompt = (
            cot_prompt
            + f"""
        둘째, 초등학생도 이해할 수 있도록, '{focused}' 단어를 쉽게 풀어서 설명해주세요.
        셋째, 이 단어가 글 속에서 어떤 맥락으로 쓰이고 있는지 간단하게 설명해주세요.
        """
            + fewshot_prompt
        )

    elif type == "phrase":  # 어구 (2~5 단어)
        prompt = (
            cot_prompt
            + f"""
        둘째, '{focused}' 어구의 의미를 한 문장으로 쉽게 풀어서 설명해주세요.
        셋째, '{focused}' 어구를 포함하는 문장 또는 글에서 이 어구를 어떤 맥락으로 쓰이고 있는지 간단히 설명하세요.
        마지막으로, 예시를 들거나 추가적인 설명을 제공합니다.
        """
            + fewshot_prompt
        )

    elif type == "sentence":  # 문장 (6~20단어)
        prompt = (
            cot_prompt
            + f"""
        둘째, 초등학생도 이해할 수 있도록, 문장을 쉬운 단어로 다시 표현해주세요.
        셋째, 해당 문장이 핵심 개념을 말하는 문장이라고 판단되는 경우, 의미를 풀어서 추가적으로 설명해주세요.
        핵심 개념이 아닌 경우 추가로 설명해주지 않아도 됩니다.
        마지막으로, 예시를 들거나 추가적인 설명을 제공합니다.
        """
            + fewshot_prompt
        )

    else:  # 문단
        prompt = (
            f"""
        사용자가 긴 문단을 드래그하여 쉬운 설명을 요청했습니다:
        '{focused}'
        - 이 문단은 다음 긴 글 속에서 등장합니다:
        {text}
        첫째, 문단의 요점을 한줄로 짧게 요약해주세요.
        둘째, 이 문단이 글 전체 내용에서 어떤 흐름을 담당하고 있는지 설명해주세요.
        """
            + fewshot_prompt
        )

    return prompt


@router.post("/text/explain")
async def explain_text(text: str, focused: str):
    """
    사용자가 드래그한 부분(focused)에 대한 쉬운 설명을 반환하는 API.
    """
    try:
        # 프롬프트 생성
        prompt = generate_focused_prompt(text, focused)
        # HCX API 호출
        response = query_hyperclovax(prompt)
        # 백엔드로 응답 반환
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
