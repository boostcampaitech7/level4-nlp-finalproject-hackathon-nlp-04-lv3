from pydantic import BaseModel, Field, model_validator
from typing import List, Optional
from datetime import datetime


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


class VocabChatbotItemDTO(BaseModel):
    chat_id: int
    question: str
    answer: str


class VocabChatbotListDTO(BaseModel):
    vocab_id: int
    chats: List[VocabChatbotItemDTO] = Field(default_factory=list)


class VocabChatbotRequestDTO(BaseModel):
    vocab: str
    question: str


class VocabChatbotResponseDTO(BaseModel):
    chat_id: int
    answer: str
