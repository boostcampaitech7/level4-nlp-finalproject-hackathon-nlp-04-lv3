import sys
import os
from dotenv import load_dotenv
import pytest
from sqlmodel import SQLModel, Session, create_engine, select
from fastapi.testclient import TestClient
from datetime import datetime

# 상위 디렉토리를 import 경로에 추가
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.user import Users
from models.score import Scores
from models.vocab import Vocabs
from models.vocab_quiz import VocabQuizzes
from models.vocab_conversation import VocabConversations
from models.text import Texts
from models.text_quiz import TextQuizzes
from models.text_conversation import TextConversations
from models.study_record import StudyRecords
from core.database import get_session
from core.security import pwd_context, create_access_token
from app import app

# PostgreSQL 테스트 DB 설정
load_dotenv()
engine = create_engine(os.getenv("TEST_DB_URL"))


# 테스트용 PostgreSQL DB 세션 제공
@pytest.fixture(scope="session")
def test_db():
    session = Session(engine)

    try:
        # 테이블 초기화
        SQLModel.metadata.drop_all(engine)
        SQLModel.metadata.create_all(engine)

        # 테스트 데이터 삽입
        user1 = Users(
            username="user1",
            name="Test User",
            password=pwd_context.hash("securepass"),
            alarm_time="21:00:00",
            created_at=datetime.now(),
        )
        session.add(user1)
        session.flush()

        score1 = Scores(user_id=user1.user_id, level=1)
        session.add(score1)
        session.flush()

        vocab1 = Vocabs(
            vocab="example_unique",
            hanja="예시",
            dict_mean="사전적인 뜻",
            easy_explain=["난이도 1"],
            correct_example=["예문 1"],
            incorrect_example=["틀린 예문 1", "틀린 이유"],
        )
        session.add(vocab1)
        session.flush()

        text1 = Texts(
            title="연금술사", content=["내용1", "내용2"], type=False, category="소설"
        )
        session.add(text1)
        session.flush()

        text2 = Texts(
            title="이방인", content=["내용1", "내용2"], type=False, category="소설"
        )
        session.add(text2)
        session.flush()

        text3 = Texts(
            title="가면산장살인사건",
            content=["내용1", "내용2"],
            type=False,
            category="소설",
        )
        session.add(text3)
        session.flush()

        text4 = Texts(
            title="윤동주 시집", content=["내용1", "내용2"], type=False, category="시"
        )
        session.add(text4)
        session.flush()

        vocab_quiz1 = VocabQuizzes(
            vocab_id=vocab1.vocab_id,
            level=1,
            question=["문제 1", "문제 2", "문제 3", "문제 4"],
            answer=[1, 1, 2, 4],
            answer_explain=["이유 1", "이유 2", "이유 3", "이유 4"],
            options=[
                "보기 1-1",
                "보기 1-2",
                "보기 1-3",
                "보기 1-4",
                "보기 2-1",
                "보기 2-2",
                "보기 2-3",
                "보기 2-4",
                "보기 3-1",
                "보기 3-2",
                "보기 3-3",
                "보기 3-4",
                "보기 4-1",
                "보기 4-2",
                "보기 4-3",
                "보기 4-4",
            ],
        )
        session.add(vocab_quiz1)
        session.flush()

        text_quiz1 = TextQuizzes(
            text_id=text1.text_id,
            level=1,
            question=["문제 1", "문제 2", "문제 3"],
            answer=[1, 1, 2, 4],
            answer_explain=["이유 1", "이유 2", "이유 3"],
            options=[
                "보기 1-1",
                "보기 1-2",
                "보기 1-3",
                "보기 1-4",
                "보기 2-1",
                "보기 2-2",
                "보기 2-3",
                "보기 2-4",
                "보기 3-1",
                "보기 3-2",
                "보기 3-3",
                "보기 3-4",
            ],
        )
        session.add(text_quiz1)
        session.flush()

        vocab_conversation1 = VocabConversations(
            user_id=user1.user_id,
            vocab_id=vocab1.vocab_id,
            question="문맥 예제",
            answer="반응 예제",
            created_at=datetime.now(),
        )
        session.add(vocab_conversation1)
        session.flush()

        text_conversation1 = TextConversations(
            user_id=user1.user_id,
            text_id=text1.text_id,
            question="대화 문맥",
            answer="대화 반응",
            created_at=datetime.now(),
        )
        session.add(text_conversation1)
        session.flush()

        study_record1 = StudyRecords(
            user_id=user1.user_id,
            vocab_quiz_id=vocab_quiz1.quiz_id,
            correct=[True, True, True, True],
            user_answer=[1, 2, 3, 1],
            created_at=datetime.now(),
        )
        session.add(study_record1)
        session.flush()

        study_record2 = StudyRecords(
            user_id=user1.user_id,
            text_quiz_id=text_quiz1.quiz_id,
            correct=[True, True, True],
            user_answer=[1, 2, 3],
            created_at=datetime.now(),
        )
        session.add(study_record2)
        session.flush()

        session.commit()

        # 삽입된 데이터 출력
        print(
            f"Test User ID: {user1.user_id}, Vocab ID: {vocab1.vocab_id}, VocabConversation ID: {vocab_conversation1.chat_id}"
        )

    except Exception as e:
        session.rollback()
        raise e

    yield session
    session.close()


# 테스트용 사용자 반환
@pytest.fixture(scope="module")
def test_user(test_db):
    user = test_db.exec(select(Users).where(Users.username == "user1")).first()
    assert user is not None, "Test user should exist"
    return user


# 테스트용 인증 헤더 생성
@pytest.fixture(scope="module")
def auth_headers(test_user):
    token = create_access_token(data={"sub": str(test_user.user_id)})
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
