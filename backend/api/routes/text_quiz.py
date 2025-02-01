from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select, desc
from datetime import datetime

from models.text_quiz import TextQuizzes
from models.study_record import StudyRecords
from schemas.text_quiz import *
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme
from services.level import update_level


router = APIRouter(prefix="/text_quiz", tags=["text_quiz"])


# 긴 글 퀴즈 문제 조회
@router.get("/{quiz_id}", response_model=TextQuizDTO, status_code=status.HTTP_200_OK)
def fetch_text_quiz(
    quiz_id: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    validate_access_token(token)

    # 2. 퀴즈 조회
    quiz = session.exec(
        select(TextQuizzes).where(TextQuizzes.quiz_id == quiz_id)
    ).first()

    # 2.1 긴 글 퀴즈 데이터가 없을 경우 예외 처리
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 퀴즈를 찾을 수 없습니다.",
        )

    # 3. 응답 데이터 생성
    return TextQuizDTO(question=quiz.question, options=quiz.options)


# 긴 글 퀴즈 제출
@router.post(
    "/solve", response_model=TextQuizResponseDTO, status_code=status.HTTP_200_OK
)
def submit_text_quiz(
    request: TextQuizRequestDTO,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증 및 user_id 추출
    user_id = validate_access_token(token)["sub"]

    # 2. 요청 데이터 추출
    quiz_id = request.quiz_id
    user_answer = request.user_answer

    # 3. 퀴즈 추출
    quiz = session.exec(
        select(TextQuizzes).where(TextQuizzes.quiz_id == quiz_id)
    ).first()

    # 3.1 긴 글 퀴즈 데이터가 없을 경우 예외 처리
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 퀴즈를 찾을 수 없습니다.",
        )

    # 4. 사용자가 선택한 답과 정답 비교
    correct = []
    for i, answer in enumerate(user_answer):
        correct_answer = quiz.answer[i]
        correct.append(answer == correct_answer)

    # 5. StudyRecords에 사용자 퀴즈 제출 기록 저장
    study_record = StudyRecords(
        user_id=user_id,
        text_quiz_id=quiz_id,
        correct=correct,
        user_answer=user_answer,
        created_at=datetime.now(),
    )
    session.add(study_record)
    session.flush()

    # 6. 사용자 level 계산 및 Scores 테이블에 반영
    rating, level_message = update_level(user_id, session, correct)
    session.commit()

    # 7. 응답 데이터 생성
    return TextQuizResponseDTO(
        question=quiz.question,
        options=quiz.options,
        answer=quiz.answer,
        answer_explain=quiz.answer_explain,
        user_answer=user_answer,
        correct=correct,
        rating=rating,
        level_message=level_message,
    )


# 긴 글 퀴즈 풀이 조회
@router.get(
    "/solve/{quiz_id}",
    response_model=TextQuizSolutionDTO,
    status_code=status.HTTP_200_OK,
)
def fetch_text_quiz_solution(
    quiz_id: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. 가장 최근 푼 퀴즈 기록 조회
    quiz = session.exec(
        select(TextQuizzes).where(TextQuizzes.quiz_id == quiz_id)
    ).first()

    # 2.1 긴 글 퀴즈 데이터가 없을 경우 예외 처리
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 퀴즈를 찾을 수 없습니다.",
        )

    # 3. 사용자가 푼 퀴즈 기록 조회
    study_record = session.exec(
        select(StudyRecords)
        .where(
            StudyRecords.user_id == user_id, StudyRecords.text_quiz_id == quiz.quiz_id
        )
        .order_by(desc(StudyRecords.created_at))  # 최근 푼 퀴즈부터 정렬
    ).first()

    # 3.1 퀴즈 기록이 없으면 예외 처리
    if not study_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 퀴즈 기록을 찾을 수 없습니다.",
        )

    # 3. 응답 데이터 생성
    return TextQuizSolutionDTO(
        question=quiz.question,
        options=quiz.options,
        answer=quiz.answer,
        answer_explain=quiz.answer_explain,
        user_answer=study_record.user_answer,
        correct=study_record.correct,
    )
