from sqlmodel import SQLModel, Field
from sqlalchemy import Column, INTEGER, TEXT, ARRAY, VARCHAR, TIMESTAMP
from typing import List
from datetime import datetime

"""
CREATE TABLE text_quizzes (
    quiz_id SERIAL PRIMARY KEY,                -- 퀴즈 ID
    text_id INTEGER REFERENCES texts(text_id), -- 관련 글
    level INTEGER,                             -- 퀴즈 난이도(1 ~ 5)
    question TEXT[] NOT NULL,                  -- 퀴즈 질문(3개가 한 쌍)
    answer INTEGER[] NOT NULL,                 -- 정답(3개가 한 쌍)
	answer_explain VARCHAR(255)[] NOT NULL,    -- 정답 이유 한 줄 설명(3개가 한 쌍)
    options TEXT[] NOT NULL,                   -- 보기(문제당 4개)
    created_at TIMESTAMP DEFAULT NOW()         -- 생성 일시
);
"""


class TextQuizzes(SQLModel, table=True):
    quiz_id: int | None = Field(default=None, primary_key=True)
    text_id: int = Field(foreign_key="texts.text_id", nullable=False)
    level: int = Field(sa_column=Column(INTEGER, nullable=False))
    question: List[str] = Field(sa_column=Column(ARRAY(TEXT), nullable=False))
    answer: List[int] = Field(sa_column=Column(ARRAY(INTEGER), nullable=False))
    answer_explain: List[str] = Field(
        sa_column=Column(ARRAY(VARCHAR(255)), nullable=False)
    )
    options: List[str] = Field(sa_column=Column(ARRAY(TEXT), nullable=False))
    created_at: datetime = Field(
        default_factory=datetime.now, sa_column=Column(TIMESTAMP, nullable=False)
    )
