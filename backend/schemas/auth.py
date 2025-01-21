from pydantic import BaseModel
from typing import Optional


class JwToken(BaseModel):
    access_token: str
    token_type: str


class UserSignupDTO(BaseModel):
    username: str
    name: str
    password: str
    level: int


class SocialLoginDTO(BaseModel):
    code: str


class SocialSignupDTO(BaseModel):
    name: str
    email: str
    level: Optional[int] = None
