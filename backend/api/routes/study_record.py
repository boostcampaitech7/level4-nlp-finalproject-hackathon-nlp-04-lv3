from fastapi import Depends, APIRouter, status
from sqlmodel import Session, select
from sqlalchemy import desc
from typing import List

from models.vocab import Vocabs
from models.vocab_quiz import VocabQuizzes
from models.text import Texts
from models.text_quiz import TextQuizzes
from models.study_record import StudyRecords
from schemas.study_record import (
    VocabStudyRecordSummaryDTO,
    TextStudyRecordSummaryDTO,
    StudyRecordSummaryDTO,
    VocabStudyRecordDTO,
    TextStudyRecordDTO,
    StudyRecordDTO,
)
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme


router = APIRouter(prefix="/study_record", tags=["study_record"])


# 학습 기록 조회
@router.get(
    "/record_id/{record_id}",
    response_model=StudyRecordDTO,
    status_code=status.HTTP_200_OK,
)
def fetch_record_by_id(
    record_id: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    validate_access_token(token)

    study_record = session.get(StudyRecords, record_id)

    # 2. 학습 기록 퀴즈 종류(단어, 긴 글)별 조회
    if study_record.vocab_quiz_id:
        vocab_quiz = session.get(VocabQuizzes, study_record.vocab_quiz_id)
        vocab = session.get(Vocabs, vocab_quiz.vocab_id)
        response_body = StudyRecordDTO(
            vocab=VocabStudyRecordDTO(
                record_id=study_record.record_id,
                vocab_id=vocab.vocab_id,
                vocab=vocab.vocab,
                hanja=vocab.hanja,
                dict_mean=vocab.dict_mean,
                easy_explain=vocab.easy_explain,
                correct_example=vocab.correct_example,
                incorrect_example=vocab.incorrect_example,
                quiz_id=vocab_quiz.quiz_id,
                quiz_question=vocab_quiz.question[1:],
                quiz_level=vocab_quiz.level,
                quiz_options=vocab_quiz.options[4:],
                quiz_correct=study_record.correct[1:],
                quiz_user_answer=study_record.user_answer[1:],
                quiz_answer=vocab_quiz.answer[1:],
                quiz_answer_explain=vocab_quiz.answer_explain[1:],
            )
        )

    else:
        text_quiz = session.get(TextQuizzes, study_record.text_quiz_id)
        text = session.get(Texts, text_quiz.text_id)
        response_body = StudyRecordDTO(
            text=TextStudyRecordDTO(
                record_id=study_record.record_id,
                text_id=text.text_id,
                title=text.title,
                content=text.content,
                type=text.type,
                category=text.category,
                quiz_id=text_quiz.quiz_id,
                quiz_level=text_quiz.level,
                quiz_question=text_quiz.question,
                quiz_options=text_quiz.options,
                quiz_correct=study_record.correct,
                quiz_user_answer=study_record.user_answer,
                quiz_answer=text_quiz.answer,
                quiz_answer_explain=text_quiz.answer_explain,
            )
        )

    # 3. 응답 데이터 생성
    return response_body.model_dump(exclude_none=True)


# 학습 기록 조회(학습 기록 페이지)
@router.get(
    "/page/{page_num}",
    response_model=List[StudyRecordSummaryDTO],
    status_code=status.HTTP_200_OK,
)
def fetch_record_by_page(
    page_num: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. 학습 기록 조회: created_at 기준으로 정렬 후, n*10 ~ (n+1)*10 번째 학습 기록 조회
    statement = (
        select(StudyRecords)
        .where(StudyRecords.user_id == user_id)
        .order_by(desc(StudyRecords.created_at))
        .offset(page_num * 10)
        .limit(10)
    )
    study_records = session.exec(statement).all()

    # 3. 학습 퀴즈 조회
    response_body = list()
    for study_record in study_records:
        # 3.1. vocab 퀴즈 경우
        if study_record.vocab_quiz_id:
            vocab_quiz = session.get(VocabQuizzes, study_record.vocab_quiz_id)
            vocab = session.get(Vocabs, vocab_quiz.vocab_id)
            response_body.append(
                StudyRecordSummaryDTO(
                    vocab=VocabStudyRecordSummaryDTO(
                        record_id=study_record.record_id,
                        quiz_level=vocab_quiz.level,
                        vocab=vocab.vocab,
                        dict_mean=vocab.dict_mean,
                    )
                )
            )
        # 3.2. text 퀴즈 경우
        else:
            text_quiz = session.get(TextQuizzes, study_record.text_quiz_id)
            text = session.get(Texts, text_quiz.text_id)
            response_body.append(
                StudyRecordSummaryDTO(
                    text=TextStudyRecordSummaryDTO(
                        record_id=study_record.record_id,
                        quiz_level=text_quiz.level,
                        title=text.title,
                        content=text.content[:100],
                        category=text.category,
                    )
                )
            )

    # 4. 응답 데이터 생성
    return [
        study_record.model_dump(exclude_none=True) for study_record in response_body
    ]


# 학습 기록 조회(단어 학습 기록 페이지)
@router.get(
    "/vocab_page/{page_num}",
    response_model=List[VocabStudyRecordSummaryDTO],
    status_code=status.HTTP_200_OK,
)
def fetch_vocab_record_by_page(
    page_num: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. 단어 학습 기록 조회: created_at 기준으로 정렬 후, n*10 ~ (n+1)*10 번째 학습 기록 조회
    statement = (
        select(StudyRecords)
        .where(
            StudyRecords.user_id == user_id,
            StudyRecords.vocab_quiz_id.isnot(None),  # None 비교 수정
        )
        .order_by(desc(StudyRecords.created_at))
        .offset(page_num * 10)
        .limit(10)
    )
    study_records = session.exec(statement).all()

    # 3. 단어 학습 기록 정보 추출
    response_body = list()
    for study_record in study_records:
        vocab_quiz = session.get(VocabQuizzes, study_record.vocab_quiz_id)
        vocab = session.get(Vocabs, vocab_quiz.vocab_id)
        response_body.append(
            VocabStudyRecordSummaryDTO(
                record_id=study_record.record_id,
                quiz_level=vocab_quiz.level,
                vocab=vocab.vocab,
                dict_mean=vocab.dict_mean,
            )
        )
    return response_body


# 학습 기록 조회(긴 글 학습 기록 페이지)
@router.get(
    "/text_page/{page_num}",
    response_model=List[TextStudyRecordSummaryDTO],
    status_code=status.HTTP_200_OK,
)
def fetch_vocab_record_by_page(
    page_num: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. 긴 글 학습 기록 조회: created_at 기준으로 정렬 후, n*10 ~ (n+1)*10 번째 학습 기록 조회
    statement = (
        select(StudyRecords)
        .where(
            StudyRecords.user_id == user_id,
            StudyRecords.text_quiz_id.isnot(None),  # None 비교 수정
        )
        .order_by(desc(StudyRecords.created_at))
        .offset(page_num * 10)
        .limit(10)
    )
    study_records = session.exec(statement).all()

    # 3. 긴 글 학습 기록 정보 추출
    response_body = list()
    for study_record in study_records:
        text_quiz = session.get(TextQuizzes, study_record.text_quiz_id)
        text = session.get(Texts, text_quiz.text_id)
        response_body.append(
            TextStudyRecordSummaryDTO(
                record_id=study_record.record_id,
                quiz_level=text_quiz.level,
                title=text.title,
                content=text.content[:100],
                category=text.category,
            )
        )
    return response_body
