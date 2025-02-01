from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session, select, desc

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

    # 4. 레벨별 데이터 생성
    level_data_map = {
        level: {"quiz_id": None, "is_solved": False} for level in range(1, 6)
    }

    # 5. 가장 최근의 학습 기록을 기반으로 레벨별 데이터 저장
    for level in range(1, 6):
        latest_record = session.exec(
            select(StudyRecords)
            .where(StudyRecords.user_id == user_id)
            .where(
                StudyRecords.vocab_quiz_id.in_(
                    [quiz.quiz_id for quiz in quizzes if quiz.level == level]
                )
            )
            .order_by(desc(StudyRecords.created_at))
        ).first()

        if latest_record:
            level_data_map[level]["quiz_id"] = latest_record.vocab_quiz_id
            level_data_map[level]["is_solved"] = True

    # 6. 모든 레벨 데이터 생성
    level_data = [
        LevelStudyRecordItemDTO(
            level=level,
            quiz_id=level_data_map[level]["quiz_id"],
            is_solved=level_data_map[level]["is_solved"],
        )
        for level in range(1, 6)
    ]

    # 7. 응답 데이터 반환
    return LevelStudyRecordDTO(user_level=user_level, level_data=level_data)


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

    # 4. 레벨별 데이터 생성
    level_data_map = {
        level: {"quiz_id": None, "is_solved": False} for level in range(1, 6)
    }

    # 5. 가장 최근의 학습 기록을 기반으로 레벨별 데이터 저장
    for level in range(1, 6):
        latest_record = session.exec(
            select(StudyRecords)
            .where(StudyRecords.user_id == user_id)
            .where(
                StudyRecords.text_quiz_id.in_(
                    [quiz.quiz_id for quiz in quizzes if quiz.level == level]
                )
            )
            .order_by(desc(StudyRecords.created_at))
        ).first()

        if latest_record:
            level_data_map[level]["quiz_id"] = latest_record.text_quiz_id
            level_data_map[level]["is_solved"] = True

    # 6. 모든 레벨 데이터 생성
    level_data = [
        LevelStudyRecordItemDTO(
            level=level,
            quiz_id=level_data_map[level]["quiz_id"],
            is_solved=level_data_map[level]["is_solved"],
        )
        for level in range(1, 6)
    ]

    # 7. 응답 데이터 반환
    return LevelStudyRecordDTO(user_level=user_level, level_data=level_data)
