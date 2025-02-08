import json, os
from fastapi import Depends, APIRouter, status
from services.vocab_chat.vocab_chatbot import CompletionExecutor
from schemas.vocab_chat import VocabChatRequest
from dotenv import load_dotenv, find_dotenv


load_dotenv(find_dotenv())


with open(f"./services/vocab_chat/vocab_chat_prompt.json", "r", encoding="utf-8") as f:
    prompt = json.load(f)

router = APIRouter(prefix="/vocab", tags=["vocab"])


def get_executor():
    return CompletionExecutor(
        host=os.getenv("CLOVASTUDIO_HOST"),
        api_key=os.getenv("CLOVASTUDIO_API_KEY"),
        system_prompt=prompt["system_prompt"],
    )


@router.post("/chat", status_code=status.HTTP_200_OK)
def generate_vocab_answer(
    vocab_chat_request: VocabChatRequest, complete_executor=Depends(get_executor)
):

    vocab = vocab_chat_request.vocab
    explain = vocab_chat_request.explain
    previous_chat = vocab_chat_request.previous
    current_chat = vocab_chat_request.question

    if current_chat == "이 단어의 유의어를 알려줘.":  # '유의어' 버튼
        current_chat = prompt["synonym_prompt"]
    elif current_chat == "이 단어의 반의어를 알려줘.":  # '반의어' 버튼
        current_chat = prompt["antonym_prompt"]
    elif (
        current_chat
        == "이 단어를 활용해서 일상 생활에서 발생할 수 있는 대화 예시를 만들어줘."
    ):  # '대화 예문' 버튼
        current_chat = prompt["communication_prompt"]

    current_response = complete_executor.execute(
        vocab, explain, previous_chat, current_chat
    )
    return current_response
