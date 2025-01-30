from models.vocab_quiz import VocabQuizzes
from sqlmodel import select


# 단어 퀴즈 문제 조회 테스트
def test_fetch_vocab_quiz(client, auth_headers, test_db):
    """
    1. 존재하는 퀴즈 ID로 요청하면 퀴즈 정보를 반환해야 한다. (200 OK)
    2. 존재하지 않는 퀴즈 ID로 요청하면 404 Not Found 응답이 와야 한다.
    """
    # 데이터베이스에서 테스트 퀴즈 가져오기
    quiz_data = test_db.exec(select(VocabQuizzes)).first()
    assert quiz_data is not None, "테스트용 퀴즈가 존재하지 않습니다."

    # 정상 퀴즈 조회
    response = client.get(f"/vocab_quiz/{quiz_data.quiz_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["question"] == quiz_data.question[1:]
    assert data["options"] == quiz_data.options[4:]

    # 존재하지 않는 퀴즈 조회
    response = client.get("/vocab_quiz/9999", headers=auth_headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "해당 퀴즈를 찾을 수 없습니다."}


# 단어 퀴즈 제출 테스트
def test_submit_vocab_quiz(client, auth_headers, test_db):
    """
    1. 정답과 사용자의 답안을 제출하면 결과를 반환해야 한다. (200 OK)
    2. 존재하지 않는 퀴즈 ID로 요청하면 404 Not Found 응답이 와야 한다.
    """
    # 데이터베이스에서 테스트 퀴즈 가져오기
    quiz_data = test_db.exec(select(VocabQuizzes)).first()
    assert quiz_data is not None, "테스트용 퀴즈가 존재하지 않습니다."

    # 사용자 정답 제출 (정답 맞춤)
    user_answer = quiz_data.answer[1:]
    response = client.post(
        "/vocab_quiz/solve",
        json={"quiz_id": quiz_data.quiz_id, "user_answer": user_answer},
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["question"] == quiz_data.question[1:]
    assert data["options"] == quiz_data.options[4:]
    assert data["answer"] == quiz_data.answer[1:]
    assert data["correct"] == [True] * len(user_answer)

    # 존재하지 않는 퀴즈 ID로 요청
    response = client.post(
        "/vocab_quiz/solve",
        json={"quiz_id": 9999, "user_answer": [1, 2, 3]},
        headers=auth_headers,
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "해당 퀴즈를 찾을 수 없습니다."}


# 단어 퀴즈 풀이 조회 테스트
def test_fetch_vocab_quiz_solution(client, auth_headers, test_db):
    """
    1. 최근 제출된 퀴즈 풀이 기록을 반환해야 한다. (200 OK)
    2. 존재하지 않는 퀴즈 ID로 요청하면 404 Not Found 응답이 와야 한다.
    3. 퀴즈는 존재하지만 사용자의 풀이 기록이 없으면 404 Not Found 응답이 와야 한다.
    """
    # 데이터베이스에서 테스트 퀴즈 가져오기
    quiz_data = test_db.exec(select(VocabQuizzes)).first()
    assert quiz_data is not None, "테스트용 퀴즈가 존재하지 않습니다."

    # 최근 풀이 기록 조회
    response = client.get(
        f"/vocab_quiz/solve/{quiz_data.quiz_id}", headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["question"] == quiz_data.question[1:]
    assert data["options"] == quiz_data.options[4:]
    assert data["answer"] == quiz_data.answer[1:]
    assert "user_answer" in data
    assert "correct" in data

    # 존재하지 않는 퀴즈 ID로 요청하는 경우 (404)
    response = client.get("/vocab_quiz/solve/9999", headers=auth_headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "해당 퀴즈를 찾을 수 없습니다."}

    # 퀴즈는 존재하지만 사용자의 풀이 기록이 없는 경우
    new_quiz = VocabQuizzes(
        vocab_id=quiz_data.vocab_id,
        level=1,
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

    response = client.get(f"/vocab_quiz/solve/{new_quiz.quiz_id}", headers=auth_headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "해당 퀴즈 기록을 찾을 수 없습니다."}
