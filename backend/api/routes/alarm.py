from fastapi import Depends, APIRouter, HTTPException, status
from sqlmodel import Session, select
from sqlalchemy import desc
from typing import List

from models.alarm import Alarms
from schemas.user import AlarmDTO
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme


router = APIRouter(prefix="/alarm", tags=["alarm"])


@router.delete("/delete/{alarm_id}")
def delete_alarm_by_id(
    alarm_id: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. 알람 조회
    alarm = session.get(Alarms, alarm_id)
    if not alarm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Alarm doesn't exist."
        )

    # 3. 알람 삭제
    session.delete(alarm)
    session.commit()

    return {"message": "Alarm successfully deleted"}


@router.get("/list", status_code=status.HTTP_200_OK, response_model=List[AlarmDTO])
def fetch_diary_by_list(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. bookmark diary를 created_at 기준으로 정렬 후, n*10 ~ (n+1)*10 일기 뽑기
    statement = (
        select(Alarms)
        .where(Alarms.user_id == user_id)
        .order_by(desc(Alarms.created_at))
    )
    alarm_list = session.exec(statement).all()

    return [
        AlarmDTO(alarm_id=alarm.alarm_id, type=alarm.type, created_at=alarm.created_at)
        for alarm in alarm_list
    ]
