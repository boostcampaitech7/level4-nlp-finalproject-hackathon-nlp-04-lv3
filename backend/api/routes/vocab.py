from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from sqlalchemy import func
from chatbot_sender import ChatbotMessageSender
import requests

from schemas.vocab import (
    VocabDetailDTO,
    VocabChatbotListDTO,
    VocabChatbotItemDTO,
    VocabChatbotResponseDTO,
    VocabChatbotRequestDTO,
)
from models.vocab import Vocabs
from models.vocab_conversation import VocabConversations
from core.config import config
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme
from datetime import datetime


router = APIRouter(prefix="/vocab", tags=["vocab"])


# 단어 설명 조회
@router.get(
    "/{vocab_id}", response_model=VocabDetailDTO, status_code=status.HTTP_200_OK
)
def fetch_vocab_detail(
    vocab_id: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    try:
        validate_access_token(token)["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")

    # 2. 단어 조회
    vocab = session.exec(select(Vocabs).where(Vocabs.vocab_id == vocab_id))
    # 2.1 단어가 존재하지 않을 시 예외 처리
    if not vocab:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Vocab not found"
        )

    return VocabDetailDTO(
        vocab_id=vocab.vocab_id,
        vocab=vocab.vocab,
        hanja=vocab.hanja,
        dict_mean=vocab.dict_mean,
        easy_explain=vocab.easy_explain,
        correct_example=vocab.correct_example,
        incorrect_example=vocab.incorrect_example,
    )


# 단어 챗봇 대화 조회
@router.get(
    "/chatbot/{vocab_id}",
    response_model=VocabChatbotListDTO,
    status_code=status.HTTP_200_OK,
)
def fetch_vocab_chatbot_list(
    vocab_id: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    try:
        user_id = validate_access_token(token)["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")

    # 2. DB에서 5개의 챗봇 데이터 추출
    chat_list = session.exec(
        select(VocabConversations)
        .where(
            VocabConversations.user_id == user_id,
            VocabConversations.vocab_id == vocab_id,
        )
        .order_by(VocabConversations.created_at.desc())
        .limit(5)
    ).all()

    # 3. 응답 데이터 생성
    response_body = VocabChatbotListDTO(
        vocab_id=vocab_id,
        chats=[
            VocabChatbotItemDTO(
                chat_id=chat.chat_id,
                question=chat.question,
                answer=chat.answer,
            )
            for chat in chat_list
        ],
    )

    return response_body


# 단어 챗봇 대화 요청
@router.post(
    "/chatbot", response_model=VocabChatbotResponseDTO, status_code=status.HTTP_200_OK
)
def request_vocab_chatbot_response(
    request_body: VocabChatbotRequestDTO,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    try:
        user_id = validate_access_token(token)["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")

    # 2. NCP 단어 챗봇 API 호출 준비
    chatbot_sender = ChatbotMessageSender(
        config.chatbot_api_url, config.chatbot_api_key
    )

    # 3. 챗봇에게 요청할 데이터 구성
    chat_list = session.exec(
        select(VocabConversations)
        .where(
            VocabConversations.user_id == user_id,
            VocabConversations.vocab_id == request_body.vocab_id,
        )
        .order_by(VocabConversations.created_at.desc())
        .limit(5)
    ).all

    previous_chats = [
        {"question": chat.question, "answer": chat.answer} for chat in chat_list
    ]

    payload = {  # 전달할 내용
        "user_id": user_id,  # 필요한지 검토해야함
        "vocab": request_body.vocab,  # 단어
        "previous_chats": previous_chats,  # 과거 5개의 대화쌍
        "question": request_body.question,  # 질문
    }

    # 2. 5개의 대화쌍 및 사용자의 질문을 전달 및 응답 요청
    # 참고한 Python 기반의 API 예제 코드 : https://api.ncloud-docs.com/docs/ai-application-service-chatbot-chatbotexample#python
    try:
        response = chatbot_sender.req_message_send(payload)
        response.raise_for_status()  # 상태 코드 확인

        # 챗봇 응답 처리
        chatbot_response = response.json()

        # 챗봇 응답에서 필요한 데이터 추출
        status = chatbot_response.get("status", "unknown")

        bubbles = chatbot_response.get("bubbles", [])
        if not bubbles or "description" not in bubbles[0]["data"]:
            raise HTTPException(
                status_code=500, detail="응답 데이터에 'description'이 없습니다."
            )
        answer = bubbles[0]["data"]["description"]

        return VocabChatbotResponseDTO(status=status, answer=answer)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"챗봇 요청 처리 중 오류: {str(e)}")
