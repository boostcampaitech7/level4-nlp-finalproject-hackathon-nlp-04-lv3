from pydantic import BaseModel
from typing import List, Optional


class VocabDetailDTO(BaseModel):
    vocab_id: int
    vocab: str
    hanja: Optional[str]
    dict_mean: Optional[str]
    easy_explain: str
    correct_example: List[str]
    incorrect_example: List[str]


class LevelData(BaseModel):
    level: int
    quiz_id: int
    is_solved: bool


class VocabLevelDTO(BaseModel):
    user_level: int
    level_data: List[LevelData]
