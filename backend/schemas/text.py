from pydantic import BaseModel, Field, model_validator
from typing import List, Optional


class TextItemDTO(BaseModel):
    text_id: int
    title: str
    category: str
    content: Optional[List[str]] = Field(default_factory=list)
    bookmark: Optional[bool] = Field(default=False)


class TextListDTO(BaseModel):
    page_num: int
    texts: List[TextItemDTO] = Field(default_factory=list)
    total_count: Optional[int] = Field(default=None)


class TextExplainRequestDTO(BaseModel):
    text_id: int
    focused: str


class TextExplainResponseDTO(BaseModel):
    text_id: int
    explain: str


class TextChatbotItemDTO(BaseModel):
    chat_id: int
    focused: Optional[str] = None
    question: str
    answer: str


class TextChatbotListDTO(BaseModel):
    text_id: int
    page_num: int
    chats: List[TextChatbotItemDTO] = Field(default_factory=list)


class TextChatbotRequestDTO(BaseModel):
    text: str
    focused: str
    question: str


class TextChatbotResponseDTO(BaseModel):
    chat_id: int
    answer: str


class TextBookmarkRequestDTO(BaseModel):
    text_id: int


class TextBookmarkResponseDTO(BaseModel):
    status: int = Field(description="HTTP 상태 코드 (예: 200)")


class TextInputRequestDTO(BaseModel):
    text: Optional[str] = Field(None, description="텍스트 데이터")
    text_image: Optional[str] = Field(None, description="Base64 인코딩된 이미지 데이터")
    text_pdf: Optional[str] = Field(None, description="Base64 인코딩된 PDF 데이터")

    @model_validator(mode="before")
    @classmethod
    def validate_input(cls, values):
        inputs = [values.get("text"), values.get("text_image"), values.get("text_pdf")]
        if sum(bool(input) for input in inputs) != 1:
            raise ValueError("text, text_image, text_pdf 중 하나만 입력해야 합니다.")
        return values


class TextInputResponseDTO(BaseModel):
    status: int = Field(description="HTTP 상태코드 (예: 200)")
