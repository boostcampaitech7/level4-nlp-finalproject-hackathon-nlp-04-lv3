from models.vocab_quiz import VocabQuizzes
from models.text_quiz import TextQuizzes
from models.study_record import StudyRecords
from sqlmodel import select


# 단어 퀴즈 난이도별 학습기록 조회 테스트
def test_fetch_vocab_level(client, auth_headers, test_db):
    """
    1. 존재하는 단어 ID로 요청하면 레벨별 학습 기록을 반환해야 한다. (200 OK)
    2. 존재하지 않는 단어 ID로 요청하면 404 Not Found 응답이 와야 한다.
    3. 퀴즈가 존재하지만 풀이 기록이 없으면 레벨 정보만 반환해야 한다.
    """
    # 데이터베이스에서 테스트 단어 퀴즈 가져오기
    quiz_data = test_db.exec(select(VocabQuizzes)).first()
    assert quiz_data is not None, "테스트용 단어 퀴즈가 존재하지 않습니다."

    # 정상 조회
    response = client.get(f"/level/vocab/{quiz_data.vocab_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "user_level" in data
    assert "level_data" in data
    assert isinstance(data["level_data"], list)
    assert len(data["level_data"]) == 5  # 5단계 난이도

    # 존재하지 않는 단어 ID로 조회
    response = client.get("/level/vocab/9999", headers=auth_headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "해당 단어의 퀴즈를 찾을 수 없습니다."}

    # 퀴즈는 있지만 사용자의 풀이 기록이 없는 경우
    new_quiz = VocabQuizzes(
        vocab_id=quiz_data.vocab_id,
        level=3,
        question=["새로운 문제 1", "새로운 문제 2", "새로운 문제 3", "새로운 문제 4"],
        answer=[1, 2, 3, 4],
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
    test_db.add(new_quiz)
    test_db.commit()
    test_db.refresh(new_quiz)

    response = client.get(f"/level/vocab/{new_quiz.vocab_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    # 새 퀴즈가 추가되었지만 기존에 풀이한 적 없으면 해당 레벨은 False 유지
    level_3_data = next(item for item in data["level_data"] if item["level"] == 3)
    assert level_3_data["is_solved"] is False


# 긴 글 퀴즈 난이도별 학습기록 조회 테스트
def test_fetch_text_level(client, auth_headers, test_db):
    """
    1. 존재하는 텍스트 ID로 요청하면 레벨별 학습 기록을 반환해야 한다. (200 OK)
    2. 존재하지 않는 텍스트 ID로 요청하면 404 Not Found 응답이 와야 한다.
    3. 퀴즈가 존재하지만 풀이 기록이 없으면 레벨 정보만 반환해야 한다.
    """
    # 데이터베이스에서 테스트 텍스트 퀴즈 가져오기
    quiz_data = test_db.exec(select(TextQuizzes)).first()
    assert quiz_data is not None, "테스트용 텍스트 퀴즈가 존재하지 않습니다."

    # 정상 조회
    response = client.get(f"/level/text/{quiz_data.text_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "user_level" in data
    assert "level_data" in data
    assert isinstance(data["level_data"], list)
    assert len(data["level_data"]) == 5  # 5단계 난이도

    # 존재하지 않는 텍스트 ID로 조회
    response = client.get("/level/text/9999", headers=auth_headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "해당 긴 글의 퀴즈를 찾을 수 없습니다."}

    # 퀴즈는 있지만 사용자의 풀이 기록이 없는 경우
    new_quiz = TextQuizzes(
        text_id=quiz_data.text_id,
        level=3,
        question=["새로운 문제 1", "새로운 문제 2", "새로운 문제 3"],
        answer=[1, 2, 3, 4],
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
    test_db.add(new_quiz)
    test_db.commit()
    test_db.refresh(new_quiz)

    response = client.get(f"/level/text/{new_quiz.text_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    # ✅ 새 퀴즈가 추가되었지만 기존에 풀이한 적 없으면 해당 레벨은 False 유지
    level_3_data = next(item for item in data["level_data"] if item["level"] == 3)
    assert level_3_data["is_solved"] is False
