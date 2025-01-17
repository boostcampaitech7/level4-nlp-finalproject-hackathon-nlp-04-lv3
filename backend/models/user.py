import uuid
from datetime import datetime, time
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, TIME, VARCHAR, TIMESTAMP
from sqlalchemy.dialects.postgresql import CITEXT


"""
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,                         -- 사용자 고유 ID
    username VARCHAR(255) NOT NULL,                     -- 사용자 닉네임
    name VARCHAR(255) NOT NULL,                         -- 사용자 이름
    password VARCHAR(255) NOT NULL,                     -- 비밀번호
    alarm_time TIME NOT NULL,                           -- 알람 시간
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP      -- 계정 생성 시간
);
"""


class Users(SQLModel, table=True):
    user_id: int | None = Field(default=None, primary_key=True)
    username: str = Field(sa_column=Column(VARCHAR(255), nullable=False))
    name: str = Field(sa_column=Column(VARCHAR(255), nullable=False))
    password: str = Field(sa_column=Column(VARCHAR(255), nullable=False))
    alarm_time: time = Field(
        default=time(21, 0), sa_column=Column(TIME, nullable=False)
    )
    created_at: datetime = Field(
        default_factory=datetime.now, sa_column=Column(TIMESTAMP, nullable=False)
    )
