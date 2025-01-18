from pydantic import BaseModel


class JwToken(BaseModel):
    access_token: str
    token_type: str


class SocialLoginDTO(BaseModel):
    code: str
    level: int
