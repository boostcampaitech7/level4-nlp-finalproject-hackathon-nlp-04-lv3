from sqlmodel import SQLModel, Field
from sqlalchemy import Column, TEXT, TIMESTAMP, Index
from typing import Optional
from datetime import datetime

"""
CLASS TABLE text_conversations (
    chat_id SERIAL PRIMARY KEY,                    -- 대화 ID
    user_id INTEGER REFERENCES users(user_id),     -- 사용자 ID
    text_id INTEGER REFERENCES texts(text_id),     -- 긴 글 ID
    focused TEXT,                                  -- 드래그한 부분
    question TEXT,                                 -- 사용자 질문
    answer TEXT,                                   -- 챗봇 답변
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 생성 일시
);
"""


class TextConversations(SQLModel, table=True):
    __table_args__ = (
        Index("idx_user_text_created", "user_id", "text_id", "created_at"),
    )

    chat_id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id", nullable=False)
    text_id: int = Field(foreign_key="texts.text_id", nullable=False)
    focused: Optional[str] = Field(sa_column=Column(TEXT))
    question: str = Field(sa_column=Column(TEXT, nullable=False))
    answer: str = Field(sa_column=Column(TEXT, nullable=False))
    created_at: datetime = Field(
        default_factory=datetime.now, sa_column=Column(TIMESTAMP, nullable=False)
    )
