from fastapi import Depends, APIRouter, HTTPException, status
from sqlmodel import Session, select
from datetime import datetime, timedelta
from calendar import monthrange

from models.user import Users
from models.score import Scores
from schemas.user import UserDetailDTO, MonthStreakDTO, UserUpdateDTO
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme, pwd_context


router = APIRouter(prefix="/user", tags=["user"])


# 회원 정보 조회
@router.get("/profile", response_model=UserDetailDTO, status_code=status.HTTP_200_OK)
def profile(
    token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. 유저 정보 추출
    user = session.get(Users, user_id)
    # 2.1. user가 존재하지 않을 시 예외 처리
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="user doesn't exist"
        )
    statement = select(Scores).where(Scores.user_id == user.user_id)
    score = session.exec(statement).first()

    # 3. 응답 데이터 생성
    return UserDetailDTO(
        username=user.username,
        name=user.name,
        password=user.password,
        alarm_time=user.alarm_time,
        tier=score.tier,
        rating=score.rating,
        text_cnt=score.text_cnt,
        vocab_cnt=score.vocab_cnt,
        diary_cnt=score.diary_cnt,
    )


"""
@router.get("/streak", response_model=MonthStreakDTO, status_code=status.HTTP_200_OK)
def fetch_streak_by_month(
    year: int,
    month: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2.1. 시작, 마지막 일자 계산
    today = datetime.now().date()
    start_date = today - timedelta(days=364)

    # 2.2. 해당 년/월 시작, 마지막 일자 조회
    first_day_of_month = datetime(year, month, 1).date()
    days_in_month = monthrange(year, month)[1]
    last_day_of_month = datetime(year, month, days_in_month).date()

    # 범위를 벗어나는 경우 조정
    if first_day_of_month < start_date:
        days_in_month -= (start_date - first_day_of_month).days
        first_day_of_month = start_date
    if last_day_of_month > today:
        days_in_month -= (last_day_of_month - today).days
        last_day_of_month = today

    # 인덱스 계산
    start_index = (today - last_day_of_month).days
    end_index = start_index + days_in_month

    # score 조회
    first_day_of_month = datetime(year, month, 1).date()
    statement = select(Scores).where(Scores.user_id == user_id)
    score = session.exec(statement).first()

    # month streak 추출
    streak = []
    for idx, ele in enumerate(score.streak[start_index:end_index]):
        if ele > 0:
            streak.append(first_day_of_month + timedelta(idx))

    return MonthStreakDTO(streak=streak)
"""


# 회원 정보 수정
@router.put("/edit", response_model=UserUpdateDTO, status_code=status.HTTP_200_OK)
def edit(
    updated_user: UserUpdateDTO,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. 유저 정보 추출
    statement = select(Users).where(Users.user_id == user_id)
    user = session.exec(statement).first()
    # 2.1. user가 존재하지 않을 시 예외 처리
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="user doesn't exist"
        )

    # 3. 비밀번호 | 알림시간 수정
    if updated_user.password:
        user.password = pwd_context.hash(updated_user.password)
    if updated_user.alarm_time:
        user.alarm_time = updated_user.alarm_time

    session.commit()
    session.refresh(user)

    # 4. 응답 데이터 생성
    return UserUpdateDTO(password=None, alarm_time=user.alarm_time)
