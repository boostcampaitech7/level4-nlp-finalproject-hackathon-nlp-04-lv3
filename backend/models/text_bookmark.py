from sqlmodel import SQLModel, Field
from sqlalchemy import Column, TIMESTAMP
from datetime import datetime

"""
CREATE TABLE text_bookmarks (
    bookmark_id SERIAL PRIMARY KEY,            -- 즐겨찾기 ID
    user_id INTEGER REFERENCES users(user_id), -- 사용자 ID
    text_id INTEGER REFERENCES texts(text_id), -- 즐겨찾기 대상 ID (글 ID)
    updated_at TIMESTAMP DEFAULT NOW()         -- 최근 수정 일시
);
"""


class Text_Bookamrks(SQLModel, table=True):
    bookmark_id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id", nullable=False)
    text_id: int = Field(foreign_key="texts.text_id", nullable=False)
    updated_at: datetime = Field(
        default_factory=datetime.now, sa_column=Column(TIMESTAMP, nullable=False)
    )
