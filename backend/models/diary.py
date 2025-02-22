from typing import List, Tuple, Optional, Union
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, TEXT, BOOLEAN, DATE, INTEGER, JSON, Index
from datetime import date

"""
CREATE TABLE  diaries (
    diary_id SERIAL PRIMARY KEY,                        -- 일기 ID
    user_id INTEGER REFERENCES users(user_id) NOT NULL, -- 사용자 ID
    text TEXT NOT NULL,                                 -- 일기
    feedback JSON,                                      -- 피드백 내용
    review TEXT,                                        -- 리뷰 글
    status INTEGER NOT NULL,                            -- 0(저장), 1(제출), 2(피드백 완료)
    bookmark BOOLEAN NOT NULL,                          -- 북마크 여부
    created_at DATE DEFAULT CURRENT_DATE                -- 날짜
);
"""


class Diaries(SQLModel, table=True):
    __table_args__ = (
        Index("idx_diary", "diary_id"),
        Index("idx_user_created_at", "user_id", "created_at"),
    )

    diary_id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id", nullable=False)
    text: str = Field(sa_column=Column(TEXT, nullable=False))
    feedback: Optional[List[Tuple[int, int, str, str]]] = Field(
        sa_column=Column(
            JSON, nullable=True
        )  # 객체 생성 시 타입 검증하기 때문에, 튜플이여야 함. 하지만, 직렬화할 때 list로 바뀜
    )
    review: Optional[str] = Field(sa_column=Column(TEXT, nullable=True))
    status: int = Field(sa_column=Column(INTEGER, nullable=False))
    bookmark: bool = Field(sa_column=Column(BOOLEAN, nullable=False))
    created_at: date = Field(
        default_factory=date.today, sa_column=Column(DATE, nullable=False)
    )
