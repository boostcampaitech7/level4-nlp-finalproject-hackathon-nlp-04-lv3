from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session, select, desc, exists

from models.vocab_quiz import VocabQuizzes
from models.text_quiz import TextQuizzes
from models.study_record import StudyRecords
from schemas.level import LevelStudyRecordItemDTO, LevelStudyRecordDTO
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme
from services.level import get_user_level


router = APIRouter(prefix="/level", tags=["level"])


# 단어 퀴즈 난이도별 학습기록 조회
@router.get(
    "/vocab/{vocab_id}",
    response_model=LevelStudyRecordDTO,
    status_code=status.HTTP_200_OK,
)
def fetch_vocab_level(
    vocab_id: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. 사용자의 난이도(level) 조회
    user_level = get_user_level(user_id, session)

    # 3. 해당 단어에 대한 모든 퀴즈 조회
    quizzes = session.exec(
        select(VocabQuizzes).where(VocabQuizzes.vocab_id == vocab_id)
    ).all()

    # 3.1 단어 퀴즈가 존재하지 않을 시 예외처리
    if not quizzes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 단어의 퀴즈를 찾을 수 없습니다.",
        )

    # 4. 레벨별로 학습 기록 여부 확인 후 응답 데이터 생성
    level_data = list()
    for quiz in quizzes:
        statement = select(
            exists().where(
                StudyRecords.user_id == user_id,
                StudyRecords.vocab_quiz_id == quiz.quiz_id,
            )
        )
        result = session.exec(statement).first()

        level_data.append(
            LevelStudyRecordItemDTO(
                level=quiz.level,
                quiz_id=quiz.quiz_id,
                is_solved=True if result else False,
            )
        )

    return level_data


# 긴 글 퀴즈 난이도별 학습기록 조회
@router.get(
    "/text/{text_id}",
    response_model=LevelStudyRecordDTO,
    status_code=status.HTTP_200_OK,
)
def get_text_level_study_record(
    text_id: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. 사용자의 난이도(level) 조회
    user_level = get_user_level(user_id, session)

    # 3. 해당 긴 글에 대한 모든 퀴즈 조회
    quizzes = session.exec(
        select(TextQuizzes).where(TextQuizzes.text_id == text_id)
    ).all()

    # 3.1 긴 글 퀴즈가 존재하지 않을 시 예외처리
    if not quizzes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 긴 글의 퀴즈를 찾을 수 없습니다.",
        )

    # 4. 레벨별로 학습 기록 여부 확인 후 응답 데이터 생성
    level_data = list()
    for quiz in quizzes:
        statement = select(
            exists().where(
                StudyRecords.user_id == user_id,
                StudyRecords.text_quiz_id == quiz.quiz_id,
            )
        )
        result = session.exec(statement).first()

        level_data.append(
            LevelStudyRecordItemDTO(
                level=quiz.level,
                quiz_id=quiz.quiz_id,
                is_solved=True if result else False,
            )
        )

    return level_data
