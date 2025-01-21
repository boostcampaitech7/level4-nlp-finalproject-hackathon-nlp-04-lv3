from sqlmodel import SQLModel, Field
from sqlalchemy import Column, TEXT, BOOLEAN, DATE
from datetime import date


"""
CREATE TABLE  diaries (
    diary_id SERIAL PRIMARY KEY,                        -- 일기 ID
    user_id INTEGER REFERENCES users(user_id) NOT NULL, -- 사용자 ID
    text TEXT NOT NULL,                                 -- 일기
    feedback TEXT,                                      -- 피드백 내용
    review TEXT,                                        -- 리뷰 글
    status BOOLEAN NOT NULL,                            -- true(제출)/false(저장)
    bookmark BOOLEAN NOT NULL,                          -- 북마크 여부
    created_at DATE DEFAULT CURRENT_DATE                -- 날짜
);
"""


class Diaries(SQLModel, table=True):
    diary_id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id", nullable=False)
    text: str = Field(sa_column=Column(TEXT, nullable=False))
    feedback: str = Field(sa_column=Column(TEXT, nullable=True))
    review: str = Field(sa_column=Column(TEXT, nullable=True))
    status: int = Field(sa_column=Column(BOOLEAN, nullable=False))
    bookmark: bool = Field(sa_column=Column(BOOLEAN, nullable=False))
    created_at: date = Field(
        default_factory=date.today, sa_column=Column(DATE, nullable=False)
    )
