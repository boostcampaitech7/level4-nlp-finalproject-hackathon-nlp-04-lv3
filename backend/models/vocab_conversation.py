from sqlmodel import SQLModel, Field
from sqlalchemy import Column, TEXT, TIMESTAMP, Index
from datetime import datetime

"""
CLASS TABLE vocab_conversations (
    chat_id SERIAL PRIMARY KEY,                     -- 대화 ID
    user_id INTEGER REFERENCES users(user_id),      -- 사용자 ID
    vocab_id INTEGER REFERENCES vocabs(vocab_id),   -- 단어 ID
    question TEXT,                                  -- 사용자 질문
	answer TEXT,                                    -- 챗봇 답변
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 생성 일시
);
"""


class VocabConversations(SQLModel, table=True):
    __table_args__ = (
        Index("idx_user_vocab_created", "user_id", "vocab_id", "created_at"),
    )

    chat_id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id", nullable=False)
    vocab_id: int = Field(foreign_key="vocabs.vocab_id", nullable=False)
    question: str = Field(sa_column=Column(TEXT, nullable=False))
    answer: str = Field(sa_column=Column(TEXT, nullable=False))
    created_at: datetime = Field(
        default_factory=datetime.now, sa_column=Column(TIMESTAMP, nullable=False)
    )
