from fastapi import Depends, Response, APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select, exists
import requests
from starlette.responses import JSONResponse

from models.user import Users
from models.score import Scores
from schemas.auth import UserSignupDTO, SocialLoginDTO, SocialSignupDTO, JwToken
from core.config import config
from core.database import get_session
from core.security import (
    create_access_token,
    pwd_context,
    generate_random_password,
    validate_access_token,
    oauth2_scheme,
)


router = APIRouter(prefix="/auth", tags=["auth"])


# 아이디 중복체크
@router.post("/check_username", status_code=status.HTTP_200_OK)
def check_username(username: str, session: Session = Depends(get_session)):
    # 1. username 중복 여부 확인
    statement = select(exists().where(Users.username == username))
    result = session.exec(statement).first()

    #  1.1. username 중복 시 false
    if result:
        return {"is_available": False}
    #  1.2. username 중복 아닐 시 true
    return {"is_available": True}


# 회원가입
@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(new_user: UserSignupDTO, session: Session = Depends(get_session)):
    # 1. username 중복 여부 확인
    statement = select(exists().where(Users.username == new_user.username))
    result = session.exec(statement).first()

    #  1.1. username 중복 시 예외 처리
    if result:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Username already exists."
        )

    # 2.1. user 등록
    user = Users(
        username=new_user.username,
        name=new_user.name,
        password=pwd_context.hash(new_user.password),
    )
    session.add(user)
    session.flush()  # user_id 할당

    # 2.2. score 등록
    score = Scores(user_id=user.user_id, level=new_user.level)
    session.add(score)
    session.commit()

    return {"message": "User created successfully"}


# 로그인
@router.post("/login", response_model=JwToken, status_code=status.HTTP_200_OK)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
) -> JwToken:
    # 1. username 존재 여부 확인
    statement = select(Users).where(Users.username == form_data.username)
    user = session.exec(statement).first()

    #  1.1. username 존재하지 않을 시 예외 처리
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User doesn't exist"
        )

    # 1.2. password가 다를 경우 예외 처리
    if not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Password mismatch"
        )

    access_token = create_access_token(data={"sub": str(user.user_id)})
    return JwToken(access_token=access_token, token_type="bearer")


"""
# 네이버 소셜 로그인
@router.post(path="/naver_login", description="naver social login")
async def naver_login(form: SocialLoginDTO, session: Session = Depends(get_session)):
    try:
        # 1. naver에 access token 요청
        token_url = f"https://nid.naver.com/oauth2.0/token?client_id={config.naver_client_id}&client_secret={config.naver_secret}&code={form.code}&grant_type=authorization_code&state=test111state"
        token_response = requests.post(token_url)
        if token_response.status_code != 200:
            raise Exception

        # 2. naver에 회원 정보 요청
        access_token = token_response.json()["access_token"]
        user_info = f"https://openapi.naver.com/v1/nid/me"
        headers = {"Authorization": "Bearer " + access_token}
        user_response = requests.post(user_info, headers=headers)
        if user_response.status_code != 200:
            raise Exception
    except:
        raise Exception("naver oauth error")

    info = user_response.json()["response"]
    name = info.get("name")
    email = info.get("email")

    statement = select(Users).where(Users.username == email)
    user = session.exec(statement).first()

    # email 없을 시 라벨 퀴즈 풀기
    if not user:
        return SocialSignupDTO(name=name, email=email).model_dump(exclude_none=True)

    # 4. JwToken 반환
    access_token = create_access_token(data={"sub": user.user_id})
    # return JwToken(access_token=access_token, token_type="bearer")

    response_body = {"message": "oauth register successful", "name": user.username}
    return JSONResponse(status_code=status.HTTP_200_OK, content=response_body)


# 네이버 소셜 회원가입
@router.post(path="/naver_signup", description="naver social signup")
async def naver_signup(form: SocialSignupDTO, session: Session = Depends(get_session)):
    statement = select(exists().where(Users.username == form.email))
    result = session.exec(statement).first()

    #  0. e-mail 중복 시 예외 처리
    if result:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="E-mail already exists."
        )

    # 1. user 등록
    user = Users(
        username=form.email,
        name=form.name,
        password=pwd_context.hash(generate_random_password()),
    )
    session.add(user)
    session.flush()  # user_id 할당

    # 3.2. score 등록
    score = Scores(user_id=user.user_id, level=form.level)
    session.add(score)
    session.commit()

    # 4. JwToken 반환
    access_token = create_access_token(data={"sub": user.user_id})
    # return JwToken(access_token=access_token, token_type="bearer")

    response_body = {"message": "oauth register successful", "name": user.username}
    return JSONResponse(status_code=status.HTTP_200_OK, content=response_body)
"""


# 로그아웃
@router.get(
    "/logout", status_code=status.HTTP_200_OK, description="logout and delete_cookie"
)
def logout(
    response: Response,  # FastAPI Response 객체
    token: str = Depends(oauth2_scheme),  # 인증 토큰 의존성
):
    # 1. 토큰 검증
    validate_access_token(token)

    # 2. 쿠키 삭제
    response.delete_cookie("access_token")  # 삭제할 쿠키의 이름 지정
    return {"message": "User logged out successfully"}
