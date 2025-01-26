from pydantic import BaseModel
from typing import List

class VocabQuizDTO(BaseModel):
    question: List[str]
    options: List[str]


class VocabQuizResponseDTO(BaseModel):
    question: List[str]
    options: List[str]
    answer: List[int]
    answer_explain: List[str]
    user_answer: List[int]
    correct: List[bool]
    rating: int
    level_message: str


class VocabQuizSolutionDTO(BaseModel):
    question: List[str]
    options: List[str]
    answer: List[int]
    answer_explain: List[str]
    user_answer: List[int]
    correct: List[bool]