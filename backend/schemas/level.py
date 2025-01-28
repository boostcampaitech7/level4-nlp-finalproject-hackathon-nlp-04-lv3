from pydantic import BaseModel, Field
from typing import List


class LevelStudyRecordItemDTO(BaseModel):
    level: int
    quiz_id: int
    is_solved: bool


class LevelStudyRecordDTO(BaseModel):
    user_level: int
    level_data: List[LevelStudyRecordItemDTO] = Field(default_factory=list)
