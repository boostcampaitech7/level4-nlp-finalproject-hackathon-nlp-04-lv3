from fastapi import Depends, APIRouter, status, Query, HTTPException
from sqlmodel import Session, select, func
from sqlalchemy import Date, cast, desc
from typing import List
from datetime import datetime, timedelta

from models.text import Texts
from models.text_conversation import TextConversations
from schemas.text import *
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme

router = APIRouter(prefix="/text", tags=["text"])


# 글 목록 조회
@router.get(
    "/list/{page_num}",
    response_model=TextListDTO,
    status_code=status.HTTP_200_OK,
)
def get_text_list(
    page_num: int = Query(1, ge=1),
    include_total_count: bool = Query(False),
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    try:
        validate_access_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")

    # 2. DB에서 페이지 번호에 해당하는 16개의 긴 글 데이터 추출
    statement = (
        select(Texts).order_by(Texts.created_at).offset((page_num - 1) * 16).limit(16)
    )
    text_list = session.exec(statement).all()

    # 3. 총 페이지 수 계산
    total_count = None
    if include_total_count:
        total_count = session.exec(select(func.count(Texts.text_id))).scalar()

    # 4. 응답 데이터 생성
    response_body = TextListDTO(
        page_num=page_num,
        texts=[
            TextItemDTO(
                text_id=text.text_id,
                title=text.title,
                category=text.category,
            )
            for text in text_list
        ],
        total_count=total_count if include_total_count else None,
    )

    return response_body


# 글 조회(주제, 글 제목, 카테고리)
@router.get(
    "/{text_id}",
    response_model=TextItemDTO,
    status_code=status.HTTP_200_OK,
)
def get_text_item(
    text_id: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    try:
        validate_access_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")

    # 2. text_id를 전달받아 해당하는 text의 상세 내용 추출 후 반환
    statement = select(Texts).where(Texts.text_id == text_id)
    text = session.exec(statement).first()

    # 데이터가 없을 경우 예외 처리
    if not text:
        raise HTTPException(status_code=404, detail="해당 글을 찾을 수 없습니다.")

    # 3. 응답 데이터 생성
    response_body = TextItemDTO(
        text_id=text.text_id,
        title=text.title,
        category=text.category,
        text=text.content,
    )

    return response_body


# 글 설명 요청
@router.post(
    "/account",
    response_model=TextExplainResponseDTO,
    status_code=status.HTTP_200_OK,
)
def request_text_account(
    request_body: TextExplainRequestDTO,
    token: str = Depends(oauth2_scheme),
):
    # 1. 토큰 검증
    try:
        user_id = validate_access_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")

    # 2. 드래그한 부분을 전달하여 챗봇에 설명을 요청
    explain = ""  # 긴 글 설명 요청 연결

    # 3. 응답 데이터 생성
    response_body = TextExplainResponseDTO(
        text_id=request_body.text_id,
        explain=explain,
    )

    return response_body


# 긴 글 챗봇 대화 조회
@router.get(
    "/chatbot/{text_id}/{page_num}",
    response_model=TextChatbotListDTO,
    status_code=status.HTTP_200_OK,
)
def get_chatbot_list(
    text_id: int,
    page_num: int = Query(1, ge=1),
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    try:
        user_id = validate_access_token(token)["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")

    # 2. DB에서 페이지 번호에 해당하는 5개의 챗봇 데이터 추출
    statement = (
        select(TextConversations)
        .where(
            TextConversations.user_id == user_id & TextConversations.text_id == text_id
        )
        .order_by(desc(TextConversations.created_at))
        .offset((page_num - 1) * 5)
        .limit(5)
    )
    chat_list = session.exec(statement).all()

    # 3. 응답 데이터 생성
    response_body = TextChatbotListDTO(
        page_num=page_num,
        chats=[
            TextChatbotItemDTO(
                chat_id=chat.chat_id,
                text_id=chat.text_id,
                question=chat.question,
                answer=chat.answer,
            )
            for chat in chat_list
        ],
    )

    return response_body


# 긴 글 챗봇 대화 요청
@router.post(
    "/chatbot",
    response_model=TextChatbotResponseDTO,
    status_code=status.HTTP_200_OK,
)
def request_text_chatbot_response(
    request_body: TextChatbotRequestDTO,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    try:
        user_id = validate_access_token(token)["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")

    # 2. 5개의 대화쌍 및 사용자의 질문, 드래그한 영역을 전달 및 응답 요청
    response = ""  # 긴 글 챗봇 연결

    # 3. 응답 데이터 생성
    response_body = TextChatbotResponseDTO(
        chat_id=response.chat_id,
        answer=response.answer,
    )

    return response_body
