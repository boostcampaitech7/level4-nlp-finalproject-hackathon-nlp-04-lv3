from pydantic import BaseModel


class TextExplainRequest(BaseModel):
    text: str
    focused: str
