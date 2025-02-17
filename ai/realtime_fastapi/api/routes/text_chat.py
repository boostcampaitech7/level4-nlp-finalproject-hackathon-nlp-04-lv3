import json, os
from fastapi import Depends, APIRouter, status
from schemas.text_chat import TextChatRequest
from services.text_chat.text_chatbot import CompletionExecutor
from dotenv import load_dotenv, find_dotenv


load_dotenv(find_dotenv())


with open(f"./services/text_chat/text_chat_prompt.json", "r", encoding="utf-8") as f:
    prompt = json.load(f)

router = APIRouter(prefix="/text", tags=["text"])


def get_executor():
    return CompletionExecutor(
        host=os.getenv("CLOVASTUDIO_HOST"),
        api_key=os.getenv("CLOVASTUDIO_API_KEY"),
        system_prompt=prompt["system_prompt"],
    )


@router.post("/chat", status_code=status.HTTP_200_OK)
def generate_text_answer(
    text_chat_request: TextChatRequest, complete_executor=Depends(get_executor)
):
    text = text_chat_request.text
    focused = text_chat_request.focused
    previous_chat = text_chat_request.previous
    current_chat = text_chat_request.question

    current_response = complete_executor.execute(
        text, focused, previous_chat, current_chat
    )
    return current_response
