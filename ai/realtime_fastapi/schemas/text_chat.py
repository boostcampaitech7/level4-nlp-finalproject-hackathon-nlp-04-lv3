from pydantic import BaseModel
from typing import List, Dict


class TextChatRequest(BaseModel):
    text: str
    focused: str
    question: str
    previous: List[Dict] = []
