from pydantic import Field
from pydantic_settings import BaseSettings


class Config(BaseSettings):
    db_url: str = Field(env="DB_URL")
    algorithm: str = Field(env="ALGORITHM")
    secret_key: str = Field(env="SECRET_KEY")
    expire_minutes: int = Field(env="EXPIRE_MINUTES")
    kakao_secret: str = Field(env="KAKAO_SECRET")
    kakao_client_id: str = Field(env="KAKAO_CLIENT_ID")
    kakao_callback_uri: str = Field(env="KAKAO_CALLBACK_URI")
    naver_secret: str = Field(env="NAVER_SECRET")
    naver_client_id: str = Field(env="NAVER_CLIENT_ID")
    # chatbot_api_key: str = Field(env="CHATBOT_API_KEY")
    # chatbot_api_url: str = Field(env="CHATBOT_API_URL")

    class Config:
        env_file = ".env"


config = Config()
