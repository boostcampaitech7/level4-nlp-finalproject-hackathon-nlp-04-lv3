from sqlmodel import SQLModel, Field
from sqlalchemy import Column, INTEGER, TIMESTAMP, BOOLEAN, ARRAY
from typing import List
from datetime import datetime

"""
CREATE TABLE study_records (
    record_id SERIAL PRIMARY KEY,                             -- 학습 기록 ID
    user_id INTEGER REFERENCES users(user_id) NOT NULL,       -- 사용자 ID
    vocab_quiz_id INTEGER REFERENCES vocab_quizzes(quiz_id),  -- 단어 퀴즈 ID
    text_quiz_id INTEGER REFERENCES text_quizzes(quiz_id),    -- 긴 글 퀴즈 ID
    correct BOOL[] NOT NULL,                                  -- 퀴즈 정답 여부
    user_answer INTEGER[] NOT NULL,                           -- 사용자가 제출한 정답
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP            -- 퀴즈 푼 시간
);
"""


class StudyRecords(SQLModel, table=True):
    record_id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id", nullable=False)
    vocab_quiz_id: int = Field(foreign_key="vocab_quizzes.quiz_id", nullable=True)
    text_quiz_id: int = Field(foreign_key="text_quizzes.quiz_id", nullable=True)
    correct: List[bool] = Field(sa_column=Column(ARRAY(BOOLEAN), nullable=False))
    user_answer: List[int] = Field(sa_column=Column(ARRAY(INTEGER), nullable=False))
    created_at: datetime = Field(
        default_factory=datetime.now, sa_column=Column(TIMESTAMP, nullable=False)
    )
