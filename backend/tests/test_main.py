from sqlmodel import select, delete
from datetime import datetime, timedelta
from models.vocab import Vocabs
from models.study_record import StudyRecords
from models.vocab_quiz import VocabQuizzes


# 오늘의 글 조회 테스트
def test_get_random_texts(client, auth_headers, test_db):
    """
    1. 정상 요청 시 최대 3개의 텍스트 데이터가 반환되어야 한다. (200 OK)
    """
    response = client.get("/main/text", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert isinstance(data, list)
    assert len(data) <= 3  # 최대 3개 반환
    for item in data:
        assert "text_id" in item
        assert "title" in item
        assert "category" in item
        assert "content" in item


# 복습 단어 퀴즈 조회 테스트
def test_fetch_review_quiz(client, auth_headers, test_db):
    """
    1. 일주일 전 학습한 단어 퀴즈 중 최대 3개를 반환해야 한다. (200 OK)
    2. 복습할 퀴즈가 없는 경우 빈 리스트를 반환해야 한다.
    """
    # 현재 날짜와 일주일 전 날짜 계산
    today = datetime.now().date()
    review_date = today - timedelta(days=7)

    # 테스트용 사용자와 퀴즈 데이터 가져오기
    user = test_db.exec(select(Vocabs)).first()
    quiz = test_db.exec(select(VocabQuizzes)).first()

    # 학습 기록 추가
    if user and quiz:
        study_record = StudyRecords(
            user_id=user.vocab_id,
            vocab_quiz_id=quiz.quiz_id,
            correct=[True],
            user_answer=[1],
            created_at=review_date,
        )
        test_db.add(study_record)
        test_db.commit()

    # 복습 퀴즈 요청
    response = client.get("/main/vocab_review", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert isinstance(data, list)
    assert len(data) <= 3  # 최대 3개 반환 가능

    # 퀴즈가 없는 경우 빈 리스트 반환 확인
    test_db.exec(delete(StudyRecords))
    test_db.commit()
    response = client.get("/main/vocab_review", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []


# 단어 검색 테스트
def test_search_vocab(client, auth_headers, test_db):
    """
    1. 존재하는 단어를 검색하면 해당 단어 정보를 반환해야 한다. (200 OK)
    2. 존재하지 않는 단어를 검색하면 404 Not Found를 반환해야 한다.
    """
    # 테스트 데이터에서 단어 하나 가져오기
    vocab_data = test_db.exec(select(Vocabs)).first()
    assert vocab_data is not None, "테스트 단어가 존재해야 합니다."

    # 존재하는 단어 검색
    response = client.post(f"/main/vocab/{vocab_data.vocab}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert data["vocab_id"] == vocab_data.vocab_id
    assert data["vocab"] == vocab_data.vocab
    assert data["hanja"] == vocab_data.hanja
    assert data["dict_mean"] == vocab_data.dict_mean

    # 존재하지 않는 단어 검색
    response = client.post("/main/vocab/nonexistent", headers=auth_headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "단어가 존재하지 않습니다."}
