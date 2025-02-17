from pydantic import BaseModel
from typing import List, Dict


class VocabChatRequest(BaseModel):
    vocab: str
    explain: str
    question: str
    previous: List[Dict] = []
