from pydantic import BaseModel, Field
from typing import List


class LevelStudyRecordItemDTO(BaseModel):
    level: int
    is_solved: bool
    quiz_id: int


class LevelStudyRecordDTO(BaseModel):
    user_level: int
    level_data: List[LevelStudyRecordItemDTO] = Field(default_factory=list)
