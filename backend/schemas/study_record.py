from pydantic import BaseModel
from typing import List, Optional


class VocabStudyRecordDTO(BaseModel):
    record_id: int
    vocab_id: int
    vocab: str
    hanja: str
    meaning: str
    explanation: List[str]
    correct_example: List[str]
    incorrect_example: str
    quiz_id: int
    quiz_level: int
    quiz_options: List[str]
    quiz_correct: List[bool]
    quiz_user_answer: List[int]
    quiz_answer: List[str]
    quiz_answer_explain: List[str]


class TextStudyRecordDTO(BaseModel):
    record_id: int
    text_id: int
    title: str
    content: str
    type: str
    category: str
    quiz_id: int
    quiz_level: int
    quiz_correct: List[bool]
    quiz_user_answer: List[int]
    quiz_options: List[str]
    quiz_answer: List[str]
    quiz_answer_explain: List[str]


class StudyRecordDTO(BaseModel):
    vocab: Optional[VocabStudyRecordDTO] = None
    text: Optional[TextStudyRecordDTO] = None


class VocabStudyRecordSummaryDTO(BaseModel):
    record_id: int
    quiz_level: int
    vocab: str
    meaning: str


class TextStudyRecordSummaryDTO(BaseModel):
    record_id: int
    quiz_level: int
    title: str
    category: str
    content: str


class StudyRecordSummaryDTO(BaseModel):
    vocab: Optional[VocabStudyRecordSummaryDTO] = None
    text: Optional[TextStudyRecordSummaryDTO] = None
