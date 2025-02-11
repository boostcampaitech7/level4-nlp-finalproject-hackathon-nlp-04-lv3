import json, os, re
from fastapi import Depends, APIRouter, HTTPException, status
from services.text_explain.text_explain import CompletionExecutor
from schemas.text_explain import TextExplainRequest
from dotenv import load_dotenv, find_dotenv


load_dotenv(find_dotenv())


with open(
    f"./services/text_explain/text_explain_prompt.json", "r", encoding="utf-8"
) as file:
    prompts = json.load(file)

router = APIRouter(prefix="/text", tags=["text"])


def get_executor():
    return CompletionExecutor(
        host=os.getenv("CLOVASTUDIO_HOST"),
        api_key=os.getenv("CLOVASTUDIO_API_KEY"),
        system_prompt=prompts["system_prompt"],
    )


@router.post("/explain", status_code=status.HTTP_200_OK)
async def explain_text(
    text_explain_request: TextExplainRequest, complete_executor=Depends(get_executor)
):

    text = text_explain_request.text
    focused = text_explain_request.focused

    try:
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

        # (단어/어구/문장/문단) 유형에 따라 서로 다른 CoT prompt, Explain prompt, Fewshot prompt 사용
        cot_prompt = prompts["cot_prompt"][type].format(text=text, focused=focused)
        explain_prompt = prompts["explain_prompt"][type].format(
            text=text, focused=focused
        )
        fewshot_prompt = prompts["fewshot_prompt"][type].format(
            text=text, focused=focused
        )

        # 긴글 설명 프롬프트 생성
        prompt = ""
        if type == "paragraph":
            prompt = explain_prompt + fewshot_prompt
        else:
            prompt = cot_prompt + explain_prompt + fewshot_prompt

        # 응답 생성
        response = complete_executor.execute(prompt)
        response_text = response["result"]["message"]["content"]
        content = re.sub(
            r"1. 글의 주제 :.*?\n2. 주요 키워드 :.*?\n3. 핵심 개념 여부 :.*?\n",
            "",
            response_text,
            flags=re.DOTALL,
        )
        ai_data = {"status": response["status"]["code"], "content": content}

        return ai_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
