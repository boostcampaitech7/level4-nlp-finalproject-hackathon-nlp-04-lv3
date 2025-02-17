from datetime import datetime, timedelta
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import JWTError, jwt
import random
import string

from core.config import config


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()

    # 'sub' 값을 문자열로 변환
    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])

    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=config.expire_minutes)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, config.secret_key, algorithm=config.algorithm)


def validate_access_token(token: str):
    try:
        return jwt.decode(token, config.secret_key, config.algorithm)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token"
        )


def generate_random_password(length: int = 12) -> str:
    """
    무작위 비밀번호 생성 함수.

    Args:
        length (int): 비밀번호 길이 (기본값 12)

    Returns:
        str: 생성된 비밀번호
    """
    if length < 8:
        raise ValueError("비밀번호는 최소 8자 이상이어야 합니다.")

    # 비밀번호 구성 요소
    lower = string.ascii_lowercase  # 소문자
    upper = string.ascii_uppercase  # 대문자
    digits = string.digits  # 숫자
    special = "!@#$%^&*()-_=+<>?"  # 특수 문자

    # 최소 하나의 각 요소를 보장
    all_characters = lower + upper + digits + special
    password = [
        random.choice(lower),
        random.choice(upper),
        random.choice(digits),
        random.choice(special),
    ]

    # 나머지 비밀번호를 무작위로 채움
    password += random.choices(all_characters, k=length - 4)

    # 비밀번호를 섞어서 반환
    random.shuffle(password)
    return "".join(password)
