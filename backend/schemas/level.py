from pydantic import BaseModel, Field
from typing import List


class TextLevelStudyRecordItemDTO(BaseModel):
    level: int
    is_solved: bool
    quiz_id: int


class TextLevelStudyRecordDTO(BaseModel):
    user_level: int
    level_data: List[TextLevelStudyRecordItemDTO] = Field(default_factory=list)
