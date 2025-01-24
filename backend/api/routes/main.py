from fastapi import Depends, APIRouter, HTTPException, status
from sqlmodel import Session, select
from sqlalchemy import Date, cast
from typing import List
from datetime import datetime, timedelta

from models.vocab import Vocabs
from models.vocab_quiz import VocabQuizzes
from models.bookmark import VocabBookmarks
from models.score import Scores
from models.study_record import StudyRecords
from schemas.vocab import VocabDetailDTO
from schemas.study_record import VocabStudyRecordDTO
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme


router = APIRouter(prefix="/main", tags=["main"])


@router.get(
    "/vocab_review",
    response_model=List[VocabStudyRecordDTO],
    status_code=status.HTTP_200_OK,
)
def fetch_record_by_page(
    token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. 일주일 전 단어 학습 기록 조회
    today = datetime.now().date()
    review_date = today - timedelta(days=7)

    statement = select(StudyRecords).where(
        StudyRecords.user_id == user_id,
        cast(StudyRecords.created_at, Date) == review_date,
        StudyRecords.vocab_quiz_id.isnot(None),  # None 비교 수정
    )
    study_records = session.exec(statement).all()

    # 3. 복습할 단어 퀴즈 추출
    response_body = list()
    for study_record in study_records:
        vocab_quiz = session.get(VocabQuizzes, study_record.vocab_quiz_id)
        vocab = session.get(Vocabs, vocab_quiz.vocab_id)
        response_body.append(
            VocabStudyRecordDTO(
                record_id=study_record.record_id,
                vocab_id=vocab.vocab_id,
                vocab=vocab.vocab,
                hanja=vocab.hanja,
                dict_mean=vocab.dict_mean,
                easy_explain=vocab.easy_explain,
                correct_example=vocab.correct_example,
                incorrect_example=vocab.incorrect_example,
                quiz_id=vocab_quiz.quiz_id,
                quiz_question=vocab_quiz.question[:1],
                quiz_level=vocab_quiz.level,
                quiz_options=vocab_quiz.options[:4],
                quiz_correct=study_record.correct[:1],
                quiz_user_answer=study_record.user_answer[:1],
                quiz_answer=vocab_quiz.answer[:1],
                quiz_answer_explain=vocab_quiz.answer_explain[:1],
            )
        )
    return response_body


# 단어 검색
@router.post("/vocab/{vocab_id}", response_model=VocabDetailDTO, status_code=status.HTTP_200_OK)
def search_vocab(
    vocab: str, token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    # 단어 정보 조회
    vocab = session.exec(select(Vocabs).where(Vocabs.vocab == vocab)).first()

    # 단어가 존재하지 않을 시 예외 처리
    if not vocab:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Vocab not found"
        )

    # 토큰 검증 및 user_id 추출
    user_id = validate_access_token(token)["sub"]
    
    # 사용자 level 추출
    score = session.exec(select(Scores).where(Scores.user_id == user_id)).first()
    if not score:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Score not found"
        )
    
    level = score.level  # 1~5 범위로 지정된 level 값
    if level is None or not (1 <= level <= 5):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid level"
        )
    

    # 4. level에 맞는 easy_explain 데이터 선택 (level-1 인덱스 사용)
    try:
        easy_explain = vocab.easy_explain[level - 1]  # level이 1~5이므로 (level-1) 인덱스 사용
    except IndexError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Explanation for the user's level not found"
        )
    

    return VocabDetailDTO(
        vocab_id=vocab.vocab_id,
        vocab=vocab.vocab,
        hanja=vocab.hanja,
        dict_mean=vocab.dict_mean,
        easy_explain=easy_explain,
        correct_example=vocab.correct_example,
        incorrect_example=vocab.incorrect_example
    )