from datetime import datetime
from sqlmodel import SQLModel, Field
from typing import List
import uuid
from sqlalchemy import Column, ARRAY, INTEGER, TIMESTAMP


"""
CREATE TABLE scores (
    score_id SERIAL PRIMARY KEY,                   -- 점수 ID
    user_id INTEGER REFERENCES users(user_id),     -- 사용자 ID
    level INTEGER,                                 -- 퀴즈, 설명 난이도
    tier INTEGER DEFAULT 0,                        -- 등급
    rating INTEGER DEFAULT 0,                      -- 누적 점수
    streak INTEGER[365],                           -- 지난 365일 스트릭
    text_cnt INTEGER DEFAULT 0,                    -- 긴 글 문제 푼 개수
    vocab_cnt INTEGER DEFAULT 0,                   -- 단어 문제 푼 횟수
    diary_cnt INTEGER DEFAULT 0,                   -- 일기 작성 횟수
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 최근 수정 시간
);
"""


class Scores(SQLModel, table=True):
    score_id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id", nullable=False)
    level: int = Field(sa_column=Column(INTEGER, nullable=True))
    tier: int = Field(default=0, sa_column=Column(INTEGER, nullable=False))
    rating: int = Field(default=0, sa_column=Column(INTEGER, nullable=False))
    streak: List[int] = Field(
        default_factory=lambda: [-1] * 365,
        sa_column=Column(ARRAY(INTEGER), nullable=False),
    )
    text_cnt: int = Field(default=0, sa_column=Column(INTEGER, nullable=False))
    vocab_cnt: int = Field(default=0, sa_column=Column(INTEGER, nullable=False))
    diary_cnt: int = Field(default=0, sa_column=Column(INTEGER, nullable=False))
    updated_at: datetime = Field(
        default_factory=datetime.now, sa_column=Column(TIMESTAMP, nullable=False)
    )
