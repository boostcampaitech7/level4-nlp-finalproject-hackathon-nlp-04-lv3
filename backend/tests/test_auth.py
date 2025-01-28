from sqlmodel import select
from core.security import pwd_context
from models.user import Users


# 아이디 중복 체크 테스트
def test_check_username(client, test_user):
    """
    1. 이미 존재하는 유저명을 요청하면 {"is_available": False} 응답을 받아야 한다.
    2. 존재하지 않는 유저명을 요청하면 {"is_available": True} 응답을 받아야 한다.
    """
    # 기존 유저 체크
    response = client.post(
        "/api/auth/check_username", params={"username": test_user.username}
    )
    assert response.status_code == 200
    assert response.json() == {"is_available": False}

    # 신규 유저 체크
    response = client.post("/api/auth/check_username", params={"username": "new_user"})
    assert response.status_code == 200
    assert response.json() == {"is_available": True}


# 회원가입 테스트
def test_signup(client, test_db):
    """
    1. 새로운 유저 정보를 입력하면 정상적으로 회원가입이 되어야 한다.
    2. 동일한 username을 다시 회원가입하면 409 Conflict 응답이 와야 한다.
    """
    new_user_data = {
        "username": "testuser_signup",
        "name": "Test User Signup",
        "password": "securepass",
        "level": 1,
    }

    # 정상적인 회원가입 요청
    response = client.post("/api/auth/signup", json=new_user_data)
    assert response.status_code == 201
    assert response.json() == {"message": "User created successfully"}

    # 회원가입 직후 DB에서 데이터 확인
    user = test_db.exec(
        select(Users).where(Users.username == "testuser_signup")
    ).first()
    assert user is not None
    assert user.username == "testuser_signup"

    # 중복 회원가입 시도
    response = client.post("/api/auth/signup", json=new_user_data)
    assert response.status_code == 409
    assert response.json() == {"detail": "Username already exists."}


# 로그인 테스트
def test_login(client, test_user, test_db):
    """
    1. 올바른 username, password 입력 시 로그인 성공 (200 OK)
    2. 잘못된 password 입력 시 401 Unauthorized 응답이 와야 한다.
    3. 존재하지 않는 username 입력 시 404 Not Found 응답이 와야 한다.
    """
    password = "securepass"
    hashed_password = pwd_context.hash(password)

    # 기존 test_user의 비밀번호를 설정
    test_user.password = hashed_password
    test_db.add(test_user)
    test_db.commit()

    # 정상 로그인
    response = client.post(
        "/api/auth/login", data={"username": test_user.username, "password": password}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

    # 잘못된 비밀번호
    response = client.post(
        "/api/auth/login",
        data={"username": test_user.username, "password": "wrongpass"},
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Password mismatch"}

    # 존재하지 않는 사용자
    response = client.post(
        "/api/auth/login", data={"username": "unknown_user", "password": "somepass"}
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "User doesn't exist"}


# 로그아웃 테스트
def test_logout(client, auth_headers):
    """
    1. 유효한 토큰으로 로그아웃 요청 시 정상 응답 (200 OK).
    2. 로그아웃 요청 후 access_token을 삭제해야 한다.
    """
    # 정상 로그아웃 요청
    response = client.get("/api/auth/logout", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == {"message": "User logged out successfully"}
