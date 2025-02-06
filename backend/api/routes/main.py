from fastapi import Depends, APIRouter, status, HTTPException
from sqlmodel import Session, select, func
from sqlalchemy import Date, cast
from typing import List
from datetime import datetime, timedelta

from models.vocab import Vocabs
from models.vocab_quiz import VocabQuizzes
from models.text import Texts
from models.study_record import StudyRecords
from schemas.text import TextItemDTO
from schemas.vocab import VocabDetailDTO
from schemas.study_record import VocabStudyRecordDTO
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme


router = APIRouter(prefix="/main", tags=["main"])


# 오늘의 글 조회
@router.get("/text", response_model=List[TextItemDTO], status_code=status.HTTP_200_OK)
def get_random_texts(
    token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    # 1. 토큰 검증
    validate_access_token(token)

    # 2. DB에서 긴 글 데이터 중 임의로 3개 추출 후 반환
    texts = session.exec(select(Texts).order_by(func.random()).limit(3)).all()

    # 3. 응답 데이터 생성
    return [
        TextItemDTO(
            text_id=text.text_id,
            title=text.title,
            category=text.category,
            content=[text.content[0]],
        )
        for text in texts
    ]


# 복습 단어 퀴즈 조회
@router.get(
    "/vocab_review",
    response_model=List[VocabStudyRecordDTO],
    status_code=status.HTTP_200_OK,
)
def fetch_review_quiz(
    token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. 일주일 전 단어 학습 기록 조회
    today = datetime.now().date()
    review_date = today - timedelta(days=7)

    statement = (
        select(StudyRecords)
        .where(
            StudyRecords.user_id == user_id,
            cast(StudyRecords.created_at, Date) == review_date,
            StudyRecords.vocab_quiz_id.isnot(None),  # None 비교 수정
        )
        .limit(3)
    )
    study_records = session.exec(statement).all()

    # 3. 복습할 단어 퀴즈 추출
    return [
        VocabStudyRecordDTO(
            record_id=record.record_id,
            vocab_id=vocab.vocab_id,
            vocab=vocab.vocab,
            hanja=vocab.hanja,
            dict_mean=vocab.dict_mean,
            easy_explain=vocab.easy_explain,
            correct_example=vocab.correct_example,
            incorrect_example=vocab.incorrect_example,
            quiz_id=quiz.quiz_id,
            quiz_question=quiz.question[:1],
            quiz_level=quiz.level,
            quiz_options=quiz.options[:4],
            quiz_correct=record.correct[:1],
            quiz_user_answer=record.user_answer[:1],
            quiz_answer=quiz.answer[:1],
            quiz_answer_explain=quiz.answer_explain[:1],
        )
        for record in study_records
        if (quiz := session.get(VocabQuizzes, record.vocab_quiz_id))  # 퀴즈 조회
        if (vocab := session.get(Vocabs, quiz.vocab_id))  # 어휘 조회
    ]


# 단어 검색
@router.get(
    "/vocab/{vocab}", response_model=VocabDetailDTO, status_code=status.HTTP_200_OK
)
def search_vocab(
    vocab: str,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    validate_access_token(token)

    # 2. 단어 정보 조회
    vocab_data = session.exec(select(Vocabs).where(Vocabs.vocab == vocab)).first()
    # 2.1 단어가 존재하지 않을 시 예외 처리
    if not vocab_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="단어가 존재하지 않습니다."
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
