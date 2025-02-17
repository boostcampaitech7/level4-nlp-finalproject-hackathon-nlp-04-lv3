from pydantic import BaseModel, Field
from typing import List, Optional


class VocabDetailDTO(BaseModel):
    vocab_id: int
    vocab: str
    hanja: Optional[List[str]]
    dict_mean: Optional[str]
    easy_explain: List[str]
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
    vocab_id: int
    question: str
    previous: List[VocabChatbotItemDTO]


class VocabChatbotResponseDTO(BaseModel):
    chat_id: int
    answer: str
