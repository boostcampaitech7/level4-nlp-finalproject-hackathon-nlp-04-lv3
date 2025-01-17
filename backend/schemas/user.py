from pydantic import BaseModel
from datetime import date
from typing import List, Optional
import datetime


class UserSignupDTO(BaseModel):
    username: str
    name: str
    password: str
    level: int


class UserUpdateDTO(BaseModel):
    password: Optional[str] = None
    alarm_time: Optional[datetime.time] = None


class UserDetailDTO(BaseModel):
    username: str
    name: str
    password: str
    alarm_time: datetime.time
    tier: int
    rating: int
    text_cnt: int
    vocab_cnt: int
    diary_cnt: int


class MonthStreakDTO(BaseModel):
    streak: List[date]
