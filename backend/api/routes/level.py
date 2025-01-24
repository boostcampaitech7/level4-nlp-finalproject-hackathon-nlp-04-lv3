from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select

from schemas.vocab import VocabLevelDTO
from models.vocab_quiz import VocabQuizzes
from models.score import Scores
from models.study_record import StudyRecords
from core.database import get_session


router = APIRouter(prefix="/level", tags=["vocab"])

@router.get("/vocab/{user_id}/{vocab_id}", response_model=VocabLevelDTO, status_code=200)
def Fetch_vocab_level(
    user_id: int, vocab_id: int, session: Session = Depends(get_session)
):
    # 1. 사용자의 난이도(level) 조회
    score = session.exec(select(Scores).where(Scores.user_id == user_id)).first()
    if not score:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Score not found"
        )
    
    user_level = score.level  # 1~5 범위로 지정된 level 값
    if user_level is None or not (1 <= user_level <= 5):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid level"
        )
    
    # 2. 해당 단어에 대한 퀴즈 목록 조회
    quizzes = session.exec(
        select(VocabQuizzes).where(VocabQuizzes.vocab_id == vocab_id)
    ).all()

    # 3. 퀴즈들의 ID 리스트를 가져옴
    quiz_ids = [quiz.quiz_id for quiz in quizzes]

    # 4. 해당 퀴즈들에 대한 학습 기록 조회
    study_records = session.exec(
        select(StudyRecords).where(StudyRecords.user_id == user_id, StudyRecords.vocab_quiz_id.in_(quiz_ids))
    ).all()

    # 5. 각 퀴즈에 대해 풀이 여부 확인
    completed = []
    for quiz_id in quiz_ids:
        # 해당 퀴즈에 대한 풀이 기록이 있는지 확인
        quiz_record = next((record for record in study_records if record.vocab_quiz_id == quiz_id), None)
        # 풀이 기록이 있으면 True, 없으면 False
        completed.append(True if quiz_record else False)

    return VocabLevelDTO(user_level=user_level, completed=completed)
