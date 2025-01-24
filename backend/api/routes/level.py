from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select

from schemas.vocab import LevelData, VocabLevelDTO
from models.vocab_quiz import VocabQuizzes
from models.score import Scores
from models.study_record import StudyRecords
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme



router = APIRouter(prefix="/level", tags=["vocab"])

@router.get("/vocab/{vocab_id}", response_model=VocabLevelDTO, status_code=200)
def fetch_vocab_level(
    vocab_id: int, token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. 사용자의 난이도(level) 조회
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
    
    # 3. 해당 단어에 대한 모든 퀴즈 목록 조회 (난이도 1~5)
    quizzes = session.exec(
        select(VocabQuizzes).where(VocabQuizzes.vocab_id == vocab_id)
    ).all()

    # 4. 퀴즈ID 리스트 가져오기
    quiz_ids = [quiz.quiz_id for quiz in quizzes]

    # 5. 해당 퀴즈들에 대한 학습 기록 조회
    study_records = session.exec(
        select(StudyRecords).where(StudyRecords.user_id == user_id, StudyRecords.vocab_quiz_id.in_(quiz_ids))
    ).all()

    # 6. 각 퀴즈의 학습 여부 LevelData에 저장
    level_data = []
    for quiz in quizzes:
        # study_record에 있으면 True, 없으면 False
        is_solved = True if quiz.quiz_id in study_records.quiz_id else False

        # LevelData 객체에 해당 정보를 추가
        level_data.append(LevelData(
            level=quiz.level,
            quiz_id=quiz.quiz_id,
            is_solved=is_solved
        ))
    
    return VocabLevelDTO(user_level=user_level, level_data=level_data)
