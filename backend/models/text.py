from sqlmodel import SQLModel, Field
from sqlalchemy import Column, TEXT, ARRAY, VARCHAR, BOOLEAN, TIMESTAMP
from typing import List
from datetime import datetime

"""
CREATE TABLE texts (
    text_id SERIAL PRIMARY KEY,                -- 텍스트 고유 ID
    user_id INTEGER REFERENCES users(user_id), -- 글 작성자
    title VARCHAR(255),                        -- 글 제목
    content TEXT[] NOT NULL,                   -- 글 내용
    type BOOLEAN NOT NULL,                     -- 글 종류 (DB 저장, 업로드, 직접 작성)
	category VARCHAR(50),                      -- 카테고리
    created_at TIMESTAMP DEFAULT NOW()         -- 생성일시
);
"""


class Texts(SQLModel, table=True):
    text_id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id", nullable=False)
    title: str = Field(sa_column=Column(VARCHAR(255), nullable=False))
    content: List[str] = Field(sa_column=Column(ARRAY(TEXT), nullable=False))
    type: bool = Field(sa_column=Column(BOOLEAN, nullable=False))
    category: str = Field(sa_column=Column(VARCHAR(50), nullable=False))
    created_at: datetime = Field(
        default_factory=datetime.now, sa_column=Column(TIMESTAMP, nullable=False)
    )


# type = 0: DB, 1: 사용자 등록
