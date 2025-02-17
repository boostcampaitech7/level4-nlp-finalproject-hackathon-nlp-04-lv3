from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from datetime import datetime, time


class UserUpdateDTO(BaseModel):
    password: Optional[str] = None
    alarm_time: Optional[time] = None


class UserDetailDTO(BaseModel):
    username: str
    name: str
    password: str
    alarm_time: time
    tier: int
    rating: int
    text_cnt: int
    vocab_cnt: int
    diary_cnt: int


class MonthStreakDTO(BaseModel):
    streak: List[date]


class AlarmDTO(BaseModel):
    alarm_id: int
    type: bool
    created_at: datetime
