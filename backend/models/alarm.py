from sqlmodel import SQLModel, Field
from sqlalchemy import Column, BOOLEAN, TIMESTAMP
from datetime import datetime

"""
CREATE TABLE alarms (
    alarm_id SERIAL PRIMARY KEY,                              -- 알람 ID
    user_id INTEGER REFERENCES users(user_id) NOT NULL,       -- 사용자 ID
    type BOOLEAN NOT NULL,                                    -- 글 종류 (학습 알람: 0, 일기 피드백 알람: 1)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP            -- 알람 생성 시간
);
"""


class Alarms(SQLModel, table=True):
    alarm_id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id", nullable=False)
    type: bool = Field(sa_column=Column(BOOLEAN, nullable=False))
    created_at: datetime = Field(
        default_factory=datetime.now, sa_column=Column(TIMESTAMP, nullable=False)
    )
