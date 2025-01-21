from datetime import time
from sqlmodel import Session, select, exists
from sqlalchemy import cast, Date
from datetime import date

from core.database import engine
from core.scheduler import scheduler
from models.alarm import Alarms
from models.score import Scores
from models.diary import Diaries


# 알람 생성 함수
def create_alarm(user_id: int, type: bool):
    # 1. 복습 학습 알람
    if type == True:
        with Session(engine) as session:
            statement = select(Scores.streak).where(Scores.user_id == user_id)
            streak = list(session.exec(statement).first())

            if streak[-1] == 0:
                alarm = Alarms(user_id=user_id, type=type)
                session.add(alarm)
                session.commit()

    # 2. 일기 알람
    if type == False:
        with Session(engine) as session:
            statement = select(
                exists().where(
                    Diaries.user_id == user_id,
                    cast(Diaries.created_at, Date) == date.today(),
                    Diaries.status == 2,
                )
            )
            exist = session.exec(statement)

            if not exist:
                alarm = Alarms(user_id=user_id, type=type)
                session.add(alarm)
                session.commit()


# 알람 스케줄링
def schedule_alarm(user_id: int, alarm_time: time):
    scheduler.add_job(
        create_alarm,
        "cron",
        hour=alarm_time.hour,
        minute=alarm_time.minute,
        id=f"review_{user_id}",
        args=[user_id, True],
        replace_existing=True,
    )

    scheduler.add_job(
        create_alarm,
        "cron",
        hour=5,
        id=f"diary_{user_id}",
        args=[user_id, False],
        replace_existing=True,
    )


# 알람 재스케줄링
def reschedule_alarm(user_id: int, alarm_time: time):
    scheduler.reschedule_job(
        job_id=f"review_{user_id}",
        trigger="cron",
        hour=alarm_time.hour,
        minute=alarm_time.minute,
    )
