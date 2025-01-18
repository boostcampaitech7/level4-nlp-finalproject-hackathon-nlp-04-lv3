from pydantic import BaseModel
from typing import Optional
from datetime import date


class DiaryDTO(BaseModel):
    text: str


class DiaryBookmarkDTO(BaseModel):
    diary_id: int
    bookmark: bool


class DiaryDayDTO(BaseModel):
    diary_id: int
    day: date
    status: bool


class DiaryExtendedDTO(BaseModel):
    diary_id: int
    text: str
    feedback: Optional[str] = None
    review: Optional[str] = None
    created_at: date
