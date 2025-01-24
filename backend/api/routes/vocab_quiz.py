from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select

from schemas.vocab_quiz import VocabQuizDTO, VocabQuizResponseDTO,VocabQuizSolutionDTO
from models.vocab_quiz import VocabQuizzes
from models.study_record import StudyRecords
from models.score import Scores
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme
from datetime import datetime, timedelta
from typing import List


router = APIRouter(prefix="/vocab_quiz", tags=["vocab_quiz"])


# 단어 퀴즈 문제 조회
@router.get("/{quiz_id}", response_model=VocabQuizDTO, status_code=status.HTTP_200_OK)
def fetch_vocab_quiz(
    quiz_id: int, token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    # 1. 토큰 검증
    try:
        validate_access_token(token)["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")
    
    # 2. 퀴즈 조회
    quiz = session.exec(select(VocabQuizzes).where(VocabQuizzes.quiz_id == quiz_id)).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    
    return VocabQuizDTO(
        question=quiz.question[1:],
        options=quiz.options[4:]
    )


# 단어 퀴즈 제출
@router.post("/{quiz_id}", response_model=VocabQuizResponseDTO, status_code=status.HTTP_200_OK)
def submit_vocab_quiz(
    quiz_id: int, user_answer: List[int], token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    # 1. 토큰 검증 및 user_id 추출
    try:
        user_id = validate_access_token(token)["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")
    
    # 2. 퀴즈 정보
    quiz = session.exec(select(VocabQuizzes).where(VocabQuizzes.quiz_id == quiz_id))
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    
    # 3. 사용자가 선택한 답과 정답 비교
    correct = []
    for i, answer in enumerate(user_answer):
        correct_answer = quiz.answer[i+1]
        correct.append(answer == correct_answer)
    
    # 4. StudyRecords에 사용자 퀴즈 제출 기록 저장
    study_record = StudyRecords(
        user_id=user_id,
        vocab_quiz_id=quiz_id,
        correct=correct,
        user_answer=user_answer,
        created_at=datetime.now()
    )
    session.add(study_record)
    session.flush()

    # 4. Scores 테이블에 반영
    scores = session.exec(select(Scores).where(Scores.user_id == user_id)).first()
    if scores:
        # 기존 값에서 업데이트
        scores.vocab_cnt += 3 # 단어 퀴즈 푼 횟수 증가
        scores.quiz_total_cnt += 3 # 전체 퀴즈 푼 횟수 증가
        scores.quiz_correct_cnt += sum(correct) # 맞은 문제 개수 업데이트
        scores.rating = (scores.quiz_correct_cnt / scores.quiz_total_cnt) * 100 # 정답률 업데이트

        # 난이도(level) 업데이트
        if scores.quiz_total_cnt >= 120:
            if scores.rating >= 70:
                new_level = scores.level + 1
                level_message="level has increased by 1"
                scores.quiz_total_cnt = 100
                scores.rating = 60
            elif scores.rating <= 50:
                new_level = scores.level - 1
                level_message="level has decreased by 1"
                scores.quiz_total_cnt = 100
                scores.rating = 60
            else:
                new_level = scores.level
                level_message="level remains the same"
            scores.level = max(1, min(5, new_level)) # 난이도(level) 업데이트 (반드시 1~5)
        else:
            level_message="level remains the same"
        
        # 업데이트 시간
        scores.updated_at = datetime.now()

        session.commit()
        session.refresh(scores)

    # 5. 퀴즈 문제, 보기, 정답, 풀이 등을 반환
    return VocabQuizResponseDTO(
        question=quiz.question[1:],
        options=quiz.options[4:],
        answer=quiz.answer[1:],
        answer_explain=quiz.answer_explain[4:],
        user_answer=user_answer,
        correct=correct,
        rating=scores.rating,
        level_message=level_message
    )


# 단어 퀴즈 풀이 조회
@router.get("/solve/{quiz_id}", response_model=VocabQuizSolutionDTO, status_code=status.HTTP_200_OK)
def fetch_vocab_quiz_solution(
    quiz_id: int, token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    # 1. 토큰 검증
    try:
        validate_access_token(token)["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")
    
    quiz = session.exec(select(VocabQuizzes).where(VocabQuizzes.quiz_id == quiz_id)).first()

    # 1. 가장 최근 푼 퀴즈 기록 조회
    study_record = session.exec(
        select(StudyRecords).where(
            StudyRecords.user_id == validate_access_token(token)["sub"],
            StudyRecords.vocab_quiz_id == quiz.quiz_id
        ).order_by(StudyRecords.created_at.desc()) # 최근 푼 퀴즈부터 정렬
    ).first()
    # 1.1 퀴즈 기록이 없으면 예외 처리
    if not study_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No quiz record found")
    
    # 2. 결과 반환
    return VocabQuizSolutionDTO(
        question=quiz.question[1:],
        options=quiz.options[4:],
        answer=quiz.answer[1:],
        answer_explain=quiz.answer_explain[4:],
        user_answer=study_record.user_answer,
        correct=study_record.correct
    )