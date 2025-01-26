from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select, desc
from typing import List
from datetime import datetime

from models.text_quiz import TextQuizzes
from models.study_record import StudyRecords
from models.score import Scores
from schemas.text_quiz import TextQuizDTO, TextQuizResponseDTO, TextQuizSolutionDTO
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme


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
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found"
        )

    # 3. 응답 데이터 생성
    return TextQuizDTO(question=quiz.question, options=quiz.options)


# 긴 글 퀴즈 제출
@router.post(
    "/{quiz_id}", response_model=TextQuizResponseDTO, status_code=status.HTTP_200_OK
)
def submit_text_quiz(
    quiz_id: int,
    user_answer: List[int],
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증 및 user_id 추출
    user_id = validate_access_token(token)["sub"]

    # 2. 퀴즈 정보
    quiz = session.exec(select(TextQuizzes).where(TextQuizzes.quiz_id == quiz_id))
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found"
        )

    # 3. 사용자가 선택한 답과 정답 비교
    correct = []
    for i, answer in enumerate(user_answer):
        correct_answer = quiz.answer[i]
        correct.append(answer == correct_answer)

    # 4. StudyRecords에 사용자 퀴즈 제출 기록 저장
    study_record = StudyRecords(
        user_id=user_id,
        text_quiz_id=quiz_id,
        correct=correct,
        user_answer=user_answer,
        created_at=datetime.now(),
    )
    session.add(study_record)
    session.flush()

    # 5. Scores 테이블에 반영
    scores = session.exec(select(Scores).where(Scores.user_id == user_id)).first()
    if scores:
        # 기존 값에서 업데이트
        scores.text_cnt += 3  # 긴 글 퀴즈 푼 횟수 증가
        scores.total_quiz_cnt += 3  # 전체 퀴즈 푼 횟수 증가
        scores.correct_quiz_cnt += sum(correct)  # 맞은 문제 개수 업데이트
        scores.rating = (
            scores.correct_quiz_cnt / scores.total_quiz_cnt
        ) * 100  # 정답률 업데이트

        # 난이도(level) 업데이트
        if scores.total_quiz_cnt >= 120:
            if scores.rating >= 70:
                new_level = scores.level + 1
                level_message = "level has increased by 1"
                scores.total_quiz_cnt = 100
                scores.rating = 60
            elif scores.rating <= 50:
                new_level = scores.level - 1
                level_message = "level has decreased by 1"
                scores.total_quiz_cnt = 100
                scores.rating = 60
            else:
                new_level = scores.level
                level_message = "level remains the same"
            scores.level = max(
                1, min(5, new_level)
            )  # 난이도(level) 업데이트 (반드시 1~5)
        else:
            level_message = "level remains the same"

        # 업데이트 시간
        scores.updated_at = datetime.now()

        session.flush()
        session.refresh(scores)

    # 데이터베이스에 변경사항 반영
    session.commit()

    # 6. 응답 데이터 생성
    return TextQuizResponseDTO(
        question=quiz.question,
        options=quiz.options,
        answer=quiz.answer,
        answer_explain=quiz.answer_explain,
        user_answer=user_answer,
        correct=correct,
        rating=scores.rating,
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

    quiz = session.exec(
        select(TextQuizzes).where(TextQuizzes.quiz_id == quiz_id)
    ).first()

    # 2. 가장 최근 푼 퀴즈 기록 조회
    study_record = session.exec(
        select(StudyRecords)
        .where(
            StudyRecords.user_id == user_id, StudyRecords.text_quiz_id == quiz.quiz_id
        )
        .order_by(desc(StudyRecords.created_at))  # 최근 푼 퀴즈부터 정렬
    ).first()
    # 2.1 퀴즈 기록이 없으면 예외 처리
    if not study_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No quiz record found"
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
