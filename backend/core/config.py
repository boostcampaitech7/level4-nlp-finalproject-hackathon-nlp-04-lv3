from pydantic import Field
from pydantic_settings import BaseSettings


class Config(BaseSettings):
    db_url: str = Field(env="DB_URL")
    algorithm: str = Field(env="ALGORITHM")
    secret_key: str = Field(env="SECRET_KEY")
    expire_minutes: int = Field(env="EXPIRE_MINUTES")

    class Config:
        extra = "allow"
        env_file = ".env"


config = Config()
