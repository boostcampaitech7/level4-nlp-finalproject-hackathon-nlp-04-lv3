from pydantic import BaseModel, Field
from typing import List, Optional


class VocabDetailDTO(BaseModel):
    vocab_id: int
    vocab: str
    hanja: Optional[List[str]]
    dict_mean: Optional[str]
    easy_explain: str
    correct_example: List[str]
    incorrect_example: List[str]


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
