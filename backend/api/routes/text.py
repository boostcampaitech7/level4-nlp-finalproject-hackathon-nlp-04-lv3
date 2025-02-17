import os
import httpx
from math import ceil
from sqlalchemy import desc
from sqlmodel import Session, select, func
from fastapi import Depends, APIRouter, status, Path, HTTPException
from dotenv import load_dotenv, find_dotenv

from models.text import Texts
from models.text_conversation import TextConversations
from schemas.text import *
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme


load_dotenv(find_dotenv())


router = APIRouter(prefix="/text", tags=["text"])

# AI 서버 URL - 임시
AI_SERVER_URL = os.getenv("AI_SERVER_URL")


# 글 목록 조회
@router.get(
    "/list/{page_num}", response_model=TextListDTO, status_code=status.HTTP_200_OK
)
def get_text_list(
    page_num: int = Path(..., ge=1),
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    validate_access_token(token)

    # 2. DB에서 페이지 번호에 해당하는 16개의 긴 글 데이터 추출
    statement = (
        select(Texts).order_by(Texts.created_at).offset((page_num - 1) * 16).limit(16)
    )
    text_list = session.exec(statement).all()

    # 3. 총 페이지 수 계산
    total_count = None
    total_page_count = None
    if page_num == 1:
        total_count = session.exec(select(func.count(Texts.text_id))).one()
        total_page_count = max(ceil(total_count / 16), 1)

    # 4. 응답 데이터 생성
    return TextListDTO(
        page_num=page_num,
        texts=[
            TextItemDTO(
                text_id=text.text_id,
                title=text.title,
                category=text.category,
            )
            for text in text_list
        ],
        total_page_count=total_page_count,
    )


# 글 조회(주제, 글 제목, 카테고리)
@router.get("/{text_id}", response_model=TextItemDTO, status_code=status.HTTP_200_OK)
def get_text_item(
    text_id: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    validate_access_token(token)

    # 2. text_id를 전달받아 해당하는 text의 상세 내용 추출 후 반환
    statement = select(Texts).where(Texts.text_id == text_id)
    text = session.exec(statement).first()

    # 2.1 긴 글 데이터가 없을 경우 예외 처리
    if not text:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="해당 글을 찾을 수 없습니다."
        )

    # 3. 응답 데이터 생성
    return TextItemDTO(
        text_id=text.text_id,
        title=text.title,
        category=text.category,
        content=text.content,
    )


# 글 설명 요청
@router.post(
    "/account",
    response_model=TextExplainResponseDTO,
    status_code=status.HTTP_200_OK,
)
async def request_text_account(
    request: TextExplainRequestDTO,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    validate_access_token(token)

    # 2. 요청 데이터 추출
    text_id = request.text_id
    focused = request.focused

    # 3. 챗봇에게 요청할 긴 글
    statement = select(Texts).where(Texts.text_id == text_id)
    text_data = session.exec(statement).first()
    request_text = " ".join(text_data.content)

    try:
        # 4. 드래그한 부분을 전달하여 설명 요청
        async with httpx.AsyncClient(timeout=100.0) as client:
            ai_explain_response = await client.post(
                AI_SERVER_URL + "/ai/text/explain",
                json={"text": request_text, "focused": focused},
            )

        # 5. AI 응답 데이터 처리
        ai_data = ai_explain_response.json()
        if ai_data["status"] != "20000":
            raise HTTPException(
                status_code=500,
                detail=f"AI 서버에서 올바른 응답을 받지 못했습니다.",
            )

        # 6. 응답 데이터를 추출
        explain = ai_data["content"]

        # 7. 결과를 프론트엔드에 전달할 형식으로 변환
        return TextExplainResponseDTO(text_id=text_id, explain=explain)

    except httpx.RequestError as exc:
        # AI 서버와의 요청 중 에러 발생 처리
        raise HTTPException(
            status_code=500,
            detail=f"AI 서버와의 연결 중 오류 발생: {exc}",
        )


# 긴 글 챗봇 대화 조회
@router.get(
    "/chatbot/{text_id}/{page_num}",
    response_model=TextChatbotListDTO,
    status_code=status.HTTP_200_OK,
)
def get_chatbot_list(
    text_id: int,
    page_num: int = Path(..., ge=1),
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. DB에서 페이지 번호에 해당하는 5개의 챗봇 데이터 추출
    statement = (
        select(TextConversations)
        .where(
            TextConversations.user_id == user_id, TextConversations.text_id == text_id
        )
        .order_by(desc(TextConversations.created_at))
        .offset((page_num - 1) * 5)
        .limit(5)
    )
    chat_list = session.exec(statement).all()

    # 3. 응답 데이터 생성
    return TextChatbotListDTO(
        text_id=text_id,
        page_num=page_num,
        chats=[
            TextChatbotItemDTO(
                chat_id=chat.chat_id,
                focused=chat.focused,
                question=chat.question,
                answer=chat.answer,
            )
            for chat in chat_list
        ],
    )


# 긴 글 챗봇 대화 요청
@router.post(
    "/chatbot", response_model=TextChatbotResponseDTO, status_code=status.HTTP_200_OK
)
async def request_text_chatbot_response(
    request: TextChatbotRequestDTO,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. 요청 데이터 추출
    text_id = request.text_id
    focused = request.focused
    question = request.question
    previous = request.previous

    # 3. 챗봇에게 요청할 긴 글
    statement = select(Texts).where(Texts.text_id == text_id)
    text_data = session.exec(statement).first()
    request_text = " ".join(text_data.content)

    try:
        # 4. 드래그한 부분, text의 content, 사용자의 질문을 전달하여 챗봇에 응답 요청
        async with httpx.AsyncClient(timeout=100.0) as client:
            ai_chat_response = await client.post(
                AI_SERVER_URL + "/ai/text/chat",
                json={
                    "text": request_text,
                    "focused": focused,
                    "question": question,
                    "previous": [prev.model_dump() for prev in previous],
                },
            )

        # 5. AI 응답 데이터 처리
        ai_data = ai_chat_response.json()
        if ai_data["status"]["code"] != "20000":
            raise HTTPException(
                status_code=500,
                detail=f"AI 서버 응답 오류: {ai_data['status']['message']}",
            )

        # 6. 응답 데이터를 추출
        answer = ai_data["result"]["message"]["content"]

        # 7. 응답 데이터를 데이터베이스에 저장하고 chat_id 가져오기
        conversation = TextConversations(
            user_id=user_id, text_id=text_id, question=question, answer=answer
        )
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

        # 8. 응답 반환
        return TextChatbotResponseDTO(chat_id=conversation.chat_id, answer=answer)

    except httpx.RequestError as exc:
        # AI 서버와의 요청 중 에러 발생 처리
        raise HTTPException(
            status_code=500,
            detail=f"AI 서버와의 연결 중 오류 발생: {exc}",
        )
