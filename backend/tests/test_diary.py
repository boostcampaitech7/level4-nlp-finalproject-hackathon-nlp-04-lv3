from models.diary import Diaries
from sqlmodel import select
from sqlalchemy import cast, Date
from datetime import datetime, timedelta, date
import pytest


# DB 초기화
@pytest.fixture(autouse=True)
def clean_db(test_db):
    # 각 테스트 실행 전에 모든 데이터를 삭제
    test_db.query(Diaries).delete()
    test_db.commit()
    yield
    # 각 테스트 후에도 정리
    test_db.query(Diaries).delete()
    test_db.commit()


# 일기 목록 조회 테스트
def test_fetch_diary_by_page(client, auth_headers, test_db):
    """
    사용자의 일기를 페이지 단위로 정상 조회해야 한다. (200 OK)
    존재하지 않는 페이지를 조회하면 빈 리스트를 반환해야 한다.
    """
    base_date = datetime.now().date()

    # 테스트용 일기 여러 개 추가
    for i in range(12):
        diary = Diaries(
            user_id=1,
            text=f"테스트 일기 {i}",
            status=1,
            bookmark=False,
            created_at=base_date - timedelta(days=i),  # 각 일기를 다른 날짜로 설정
        )
        test_db.add(diary)

    test_db.commit()

    # 1페이지 조회 (10개까지만 가져와야 함)
    response = client.get("/diary/page/1", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10

    # 2페이지 조회 (2개 남았으므로 2개 반환해야 함)
    response = client.get("/diary/page/2", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


# 일기, 피드백 조회 테스트
def test_fetch_diary_by_id(client, auth_headers, test_db):
    """
    특정 diary_id의 일기를 정상적으로 조회해야 한다. (200 OK)
    존재하지 않는 diary_id를 조회할 경우 404 오류가 발생해야 한다.
    """
    user_id = 1
    diary = Diaries(
        user_id=user_id,
        text="테스트 일기",
        status=1,
        bookmark=False,
        created_at=datetime.now(),
    )
    test_db.add(diary)
    test_db.commit()
    test_db.refresh(diary)

    response = client.get(f"/diary/diary_id/{diary.diary_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["diary_id"] == diary.diary_id
    assert data["text"] == "테스트 일기"

    # 존재하지 않는 diary_id 요청
    response = client.get("/diary/diary_id/9999", headers=auth_headers)
    assert response.status_code == 404


# 일기 피드백 요청 테스트
def test_feedback(client, auth_headers):
    """
    1. 새로운 일기를 생성해야 한다. (202 ACCEPTED)
    2. 이미 존재하는 경우 해당 일기를 수정해야 한다.
    """
    diary_data = {"text": "일기 피드백 요청"}
    response = client.post("/diary/feedback", json=diary_data, headers=auth_headers)
    assert response.status_code == 202
    assert response.json()["message"] == "Diary successfully accepted"

    # 같은 날짜에 다시 요청하면 수정이 되어야 함
    updated_diary_data = {"text": "수정된 피드백 요청"}
    response = client.post(
        "/diary/feedback", json=updated_diary_data, headers=auth_headers
    )
    assert response.status_code == 202
    assert response.json()["message"] == "Diary successfully accepted"


# 일기 저장 테스트
def test_save(client, auth_headers, test_db):
    """
    1. 새로운 일기를 정상적으로 저장해야 한다. (202 ACCEPTED)
    2. 같은 날짜에 일기가 존재하면 수정되어야 한다.
    """
    test_db.rollback()
    user_id = 1
    diary_data = {"text": "새로운 일기"}
    response = client.post("/diary/save", json=diary_data, headers=auth_headers)
    assert response.status_code == 202
    assert response.json()["message"] == "Diary successfully saved"

    # 같은 날짜에 다시 저장하면 수정이 되어야 함
    updated_diary_data = {"text": "수정된 일기"}
    response = client.post("/diary/save", json=updated_diary_data, headers=auth_headers)
    assert response.status_code == 202
    assert response.json()["message"] == "Diary successfully saved"

    # DB에서 확인
    statement = select(Diaries).where(
        Diaries.user_id == user_id, cast(Diaries.created_at, Date) == date.today()
    )
    diary = test_db.exec(statement).first()

    assert diary is not None
    assert diary.text == "수정된 일기"
