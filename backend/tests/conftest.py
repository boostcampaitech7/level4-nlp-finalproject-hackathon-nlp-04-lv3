import sys
import os
from dotenv import load_dotenv
import pytest
from sqlmodel import SQLModel, Session, create_engine
from fastapi.testclient import TestClient
from datetime import datetime

# 상위 디렉토리를 import 경로에 추가
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.user import Users
from models.vocab import Vocabs
from models.vocab_quiz import VocabQuizzes
from models.vocab_conversation import VocabConversations
from models.text import Texts
from models.text_quiz import TextQuizzes
from models.text_conversation import TextConversations
from models.study_record import StudyRecords
from core.database import get_session
from core.security import create_access_token
from app import app

# PostgreSQL 테스트 DB 설정
load_dotenv()
engine = create_engine(os.getenv("TEST_DB_URL"))


# 테스트용 PostgreSQL DB 세션 제공
@pytest.fixture(scope="session")
def test_db():
    session = Session(engine)

    try:
        # 테이블 초기화 (필요 시 기존 데이터 삭제)
        SQLModel.metadata.drop_all(engine)
        SQLModel.metadata.create_all(engine)

        # 테스트 데이터 삽입
        user1 = Users(
            username="existing_user",
            name="Test User",
            password="hashedpass",
            alarm_time="21:00:00",
            level=1,
            created_at=datetime.now(),
        )
        session.add(user1)
        session.flush()

        vocab1 = Vocabs(
            vocab="example_unique",
            hanja="예시",
            dict_mean="사전적인 뜻",
            easy_explain=["난이도 1"],
            correct_example=["예문 1"],
            incorrect_example=["틀린 예문 1"],
        )
        session.add(vocab1)
        session.flush()

        text1 = Texts(title="연금술사", content=["내용"], type=False, category="소설")
        session.add(text1)
        session.flush()

        vocab_quiz1 = VocabQuizzes(
            vocab_id=vocab1.vocab_id,
            level=1,
            question=["문제 1"],
            answer=[1],
            answer_explain=["이유"],
            options=["보기 1"],
        )
        session.add(vocab_quiz1)
        session.flush()

        text_quiz1 = TextQuizzes(
            text_id=text1.text_id,
            level=1,
            question=["문제"],
            answer=[1],
            answer_explain=["이유"],
            options=["보기"],
        )
        session.add(text_quiz1)
        session.flush()

        vocab_conversation1 = VocabConversations(
            user_id=user1.user_id,
            vocab_id=vocab1.vocab_id,
            question="문맥 예제",
            answer="반응 예제",
        )
        session.add(vocab_conversation1)
        session.flush()

        text_conversation1 = TextConversations(
            user_id=user1.user_id,
            text_id=text1.text_id,
            question="대화 문맥",
            answer="대화 반응",
        )
        session.add(text_conversation1)
        session.flush()

        study_record1 = StudyRecords(
            user_id=user1.user_id,
            vocab_quiz_id=vocab_quiz1.quiz_id,
            text_quiz_id=text_quiz1.quiz_id,
            correct=[True],
            user_answer=[1],
        )
        session.add(study_record1)
        session.flush()

        session.commit()

    except Exception as e:
        session.rollback()
        raise e

    yield session
    session.close()


# 테스트용 사용자 추가 및 반환
@pytest.fixture(scope="module")
def test_user(test_db):
    user = Users(username="testuser", name="Test User", password="hashedpass", level=1)
    test_db.add(user)
    test_db.commit()
    return user


# 테스트용 인증 헤더 생성
@pytest.fixture(scope="module")
def auth_headers(test_user):
    token = create_access_token(data={"sub": test_user.user_id})
    print(f"Generated Token for User {test_user.user_id}: {token}")
    return {"Authorization": f"Bearer {token}"}


# FastAPI 클라이언트 및 DB 세션 오버라이드
@pytest.fixture(scope="function")
def client(test_db):
    def override_get_session():
        yield test_db

    app.dependency_overrides[get_session] = override_get_session
    client = TestClient(app)
    yield client
    client.app.dependency_overrides.clear()
