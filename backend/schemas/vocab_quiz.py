from pydantic import BaseModel
from typing import List

class VocabQuizDTO(BaseModel):
    quiz_id: int
    question: List[str]
    options: List[str]


class VocabQuizResponseDTO(BaseModel):
    quiz_id: int
    question: List[str]
    options: List[str]
    answer: List[int]
    answer_explain: List[str]
    user_answer: List[int]
    correct: List[bool]
    rating: int
    level_message: str

class VocabQuizSolutionDTO(BaseModel):
    quiz_id: int
    question: List[str]
    options: List[str]
    answer: List[int]
    user_answer: List[int]
    correct: List[bool]