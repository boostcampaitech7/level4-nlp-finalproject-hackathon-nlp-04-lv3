from pydantic import BaseModel
from typing import List


class TextQuizDTO(BaseModel):
    question: List[str]
    options: List[str]


class TextQuizRequestDTO(BaseModel):
    quiz_id: int
    user_answer: List[int]


class TextQuizResponseDTO(BaseModel):
    question: List[str]
    options: List[str]
    answer: List[int]
    answer_explain: List[str]
    user_answer: List[int]
    correct: List[bool]
    rating: int
    level_message: str


class TextQuizSolutionDTO(BaseModel):
    question: List[str]
    options: List[str]
    answer: List[int]
    answer_explain: List[str]
    user_answer: List[int]
    correct: List[bool]
