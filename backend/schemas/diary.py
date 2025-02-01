from pydantic import BaseModel
from typing import Optional, List, Tuple
from datetime import date


class DiaryDTO(BaseModel):
    text: str


class DiaryBookmarkDTO(BaseModel):
    diary_id: int
    bookmark: bool


class DiaryDayDTO(BaseModel):
    diary_id: int
    day: date
    status: int


class DiaryExtendedDTO(BaseModel):
    diary_id: int
    status: int
    text: str
    feedback: Optional[List[Tuple[int, int, str, str]]] = (
        None  # 객체 생성 시 리스트를 넣어도 튜플로 자동 변환해 주지만, 요소 타입은 지켜야 함. 전송 시 진행되는 직렬화는 튜플이 리스트로 변환시킴.
    )
    review: Optional[str] = None
    created_at: date
