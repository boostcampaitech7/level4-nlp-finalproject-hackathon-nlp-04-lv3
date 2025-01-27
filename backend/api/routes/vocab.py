from fastapi import APIRouter, HTTPException, Depends, status, Query
from sqlmodel import Session, select, desc
import httpx

from models.vocab import Vocabs
from models.vocab_conversation import VocabConversations
from schemas.vocab import (
    VocabDetailDTO,
    VocabChatbotListDTO,
    VocabChatbotItemDTO,
    VocabChatbotResponseDTO,
    VocabChatbotRequestDTO,
)
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme


router = APIRouter(prefix="/vocab", tags=["vocab"])

# AI 서버 URL - 임시
AI_SERVER_URL = "http://ai-server.com"


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
    validate_access_token(token)

    # 2. 단어 조회
    vocab_data = session.exec(select(Vocabs).where(Vocabs.vocab_id == vocab_id)).first()

    # 2.1 단어가 존재하지 않을 시 예외 처리
    if not vocab_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Vocab not found"
        )

    # 3. 응답 데이터 생성
    return VocabDetailDTO(
        vocab_id=vocab_data.vocab_id,
        vocab=vocab_data.vocab,
        hanja=vocab_data.hanja,
        dict_mean=vocab_data.dict_mean,
        easy_explain=vocab_data.easy_explain,
        correct_example=vocab_data.correct_example,
        incorrect_example=vocab_data.incorrect_example,
    )


# 단어 챗봇 대화 조회
@router.get(
    "/chatbot/{vocab_id}/{page_num}",
    response_model=VocabChatbotListDTO,
    status_code=status.HTTP_200_OK,
)
def fetch_vocab_chatbot_list(
    vocab_id: int,
    page_num: int = Query(1, ge=1),
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. DB에서 페이지 번호에 해당하는 5개의 챗봇 데이터 추출
    statement = (
        select(VocabConversations)
        .where(
            VocabConversations.user_id == user_id,
            VocabConversations.text_id == vocab_id,
        )
        .order_by(desc(VocabConversations.created_at))
        .offset((page_num - 1) * 5)
        .limit(5)
    )
    chat_list = session.exec(statement).all()

    # 3. 응답 데이터 생성
    return VocabChatbotListDTO(
        vocab_id=vocab_id,
        page_num=page_num,
        chats=[
            VocabChatbotItemDTO(
                chat_id=chat.chat_id,
                question=chat.question,
                answer=chat.answer,
            )
            for chat in chat_list
        ],
    )


# 단어 챗봇 대화 요청
@router.post(
    "/chatbot", response_model=VocabChatbotResponseDTO, status_code=status.HTTP_200_OK
)
async def request_vocab_chatbot_response(
    vocab_id: int,
    question: str,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. 챗봇에게 요청할 단어
    vocab = select(Vocabs).where(Vocabs.vocab_id == vocab_id)

    try:
        # 3. 단어, 사용자의 질문을 전달 및 응답 요청
        async with httpx.AsyncClient() as client:
            ai_chat_response = await client.post(
                AI_SERVER_URL + "/ai/vocab/chat",
                json=VocabChatbotRequestDTO(vocab=vocab, question=question),
            )

        # 4. 응답 상태 코드 확인
        if ai_chat_response.status_code != 200:
            raise HTTPException(
                status_code=ai_chat_response.status_code,
                detail=f"AI 서버 요청 실패: {ai_chat_response.text}",
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
        conversation = {
            "user_id": user_id,
            "vocab_id": vocab_id,
            "question": question,
            "answer": answer,
        }
        result = session.exec(
            """
            INSERT INTO vocab_conversations (user_id, vocab_id, question, answer)
            VALUES (:user_id, :vocab_id, :question, :answer)
            """,
            conversation,
        )
        chat_id = result.one()[0]  # 생성된 chat_id 가져오기
        session.commit()

        # 8. 응답 데이터를 프론트엔드로 반환
        return VocabChatbotResponseDTO(chat_id=chat_id, answer=answer)

    except httpx.RequestError as exc:
        # AI 서버와의 요청 중 에러 발생 처리
        raise HTTPException(
            status_code=500,
            detail=f"AI 서버와의 연결 중 오류 발생: {exc}",
        )
