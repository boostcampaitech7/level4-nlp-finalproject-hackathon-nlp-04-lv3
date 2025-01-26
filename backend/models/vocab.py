from sqlmodel import SQLModel, Field
from sqlalchemy import Column, VARCHAR, TEXT, TIMESTAMP
from sqlalchemy.dialects.postgresql import ARRAY, CITEXT
from typing import List
from datetime import datetime, time


"""
CREATE TABLE vocabs (
    vocab_id SERIAL PRIMARY KEY,        -- 단어 ID
    vocab VARCHAR(100) UNIQUE NOT NULL, -- 단어
    hanja TEXT,                         -- 한자 뜻음
    dict_mean TEXT,                     -- 사전적 정의
    easy_explain TEXT[],                -- 단어 설명(난이도 1 ~ 5)
    correct_example TEXT[],             -- 옳은 예문(난이도 1 ~ 5)
    incorrect_example TEXT[],           -- 틀린 예문, 틀린 이유
	created_at TIMESTAMP DEFAULT NOW()  -- 생성 일시
);
"""


class Vocabs(SQLModel, table=True):
    __tablename__ = "vocabs"

    vocab_id: int | None = Field(default=None, primary_key=True)
    vocab: str = Field(sa_column=Column(VARCHAR(100), nullable=False, unique=True))
    hanja: str | None = Field(default=None, sa_column=Column(TEXT))
    dict_mean: str | None = Field(default=None, sa_column=Column(TEXT))
    easy_explain: List[str] = Field(default=[], sa_column=Column(ARRAY(TEXT), nullable=False))
    correct_example: List[str] = Field(default=[], sa_column=Column(ARRAY(TEXT), nullable=False))
    incorrect_example: List[str] = Field(default=[], sa_column=Column(ARRAY(TEXT), nullable=False))
    created_at: datetime = Field(
        default_factory=datetime.now, sa_column=Column(TIMESTAMP, nullable=False)
    )
