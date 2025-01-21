from pydantic import BaseModel, Field
from typing import List, Optional


class TextQuizListDTO(BaseModel):
    quiz_id: List[int] = Field(default_factory=list)
    question: List[str] = Field(default_factory=list)
    answer: List[str] = Field(default_factory=list)
    user_answer: Optional[List[str]] = Field(default_factory=list)
    is_correct: Optional[List[bool]] = Field(default_factory=list)
    answer_explain: Optional[List[str]] = Field(default_factory=list)


class TextQuizUserAnswerItemDTO(BaseModel):
    quiz_id: int
    user_answer: int


class TextQuizUserAnswerListDTO(BaseModel):
    user_answers: List[TextQuizUserAnswerItemDTO] = Field(default_factory=list)
