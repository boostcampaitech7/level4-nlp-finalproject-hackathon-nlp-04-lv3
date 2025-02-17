from models.vocab import Vocabs
from models.vocab_conversation import VocabConversations
from sqlmodel import select


# 단어 설명 조회 테스트
def test_fetch_vocab_detail(client, auth_headers, test_db):
    """
    1. 존재하는 단어 ID로 요청하면 단어 상세 정보를 반환해야 한다. (200 OK)
    2. 존재하지 않는 단어 ID로 요청하면 404 Not Found 응답이 와야 한다.
    """
    # 데이터베이스에서 단어를 동적으로 가져옴
    vocab_data = test_db.exec(
        select(Vocabs).where(Vocabs.vocab == "example_unique")
    ).first()
    assert vocab_data is not None, "테스트용 단어가 존재하지 않습니다."

    # 정상 단어 조회
    response = client.get(f"/vocab/{vocab_data.vocab_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["vocab_id"] == vocab_data.vocab_id
    assert data["vocab"] == vocab_data.vocab

    # 존재하지 않는 단어 조회
    response = client.get("/vocab/9999", headers=auth_headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "해당 단어를 찾을 수 없습니다."}


# 단어 챗봇 대화 목록 테스트
def test_fetch_vocab_chatbot_list(client, auth_headers, test_db):
    """
    1. 존재하는 단어 ID와 페이지 번호로 요청하면 해당 페이지의 챗봇 대화 목록을 반환해야 한다. (200 OK)
    2. 존재하지 않는 단어 ID로 요청하면 빈 목록을 반환해야 한다. (200 OK)
    """
    # 데이터베이스에서 단어 및 대화 데이터를 동적으로 가져옴
    vocab_data = test_db.exec(
        select(Vocabs).where(Vocabs.vocab == "example_unique")
    ).first()
    assert vocab_data is not None, "테스트용 단어가 존재하지 않습니다."

    # 관련 대화 데이터가 존재하는지 확인
    conversations = test_db.exec(
        select(VocabConversations).where(
            VocabConversations.vocab_id == vocab_data.vocab_id
        )
    ).all()
    print("Conversations in DB:", conversations)
    assert len(conversations) > 0, "테스트용 대화가 존재하지 않습니다."

    vocab_id = vocab_data.vocab_id
    page_num = 1  # 페이지 번호 지정

    # 정상 대화 목록 조회
    response = client.get(f"/vocab/chatbot/{vocab_id}/{page_num}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    print("Response Data:", data)  # 디버깅용 출력
    assert data["vocab_id"] == vocab_id
    assert len(data["chats"]) > 0
    assert data["chats"][0]["question"] == "문맥 예제"

    # 빈 대화 목록 조회
    response = client.get(f"/vocab/chatbot/9999/{page_num}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["vocab_id"] == 9999
    assert len(data["chats"]) == 0


# 단어 챗봇 대화 요청 테스트
def test_request_vocab_chatbot_response(client, auth_headers, mocker, test_db):
    """
    1. 올바른 단어와 질문으로 요청하면 AI 서버의 응답을 반환해야 한다. (200 OK)
    2. AI 서버의 요청 실패 시 HTTPException이 발생해야 한다. (500 Internal Server Error)
    """
    # 데이터베이스에서 테스트 단어 가져오기
    vocab_data = test_db.exec(
        select(Vocabs).where(Vocabs.vocab == "example_unique")
    ).first()
    assert vocab_data is not None, "테스트용 단어가 존재하지 않습니다."

    # Mock - AI 서버 응답
    mock_ai_response = {
        "status": {"code": "20000", "message": "OK"},
        "result": {"message": {"content": "AI 응답 메시지"}},
    }
    mocker.patch(
        "api.routes.vocab.httpx.AsyncClient.post",
        return_value=mocker.Mock(
            status_code=200,
            json=lambda: mock_ai_response,
        ),
    )

    previous = [
        {
            "chat_id": 4,
            "question": "이 단어 뜻은?",
            "answer": "이 단어는 A를 의미합니다.",
        },
        {
            "chat_id": 3,
            "question": "어떤 의미인가요?",
            "answer": "그것은 B라는 뜻입니다.",
        },
        {
            "chat_id": 2,
            "question": "이 단어 뜻은?",
            "answer": "이 단어는 A를 의미합니다.",
        },
        {
            "chat_id": 1,
            "question": "어떤 의미인가요?",
            "answer": "그것은 B라는 뜻입니다.",
        },
        {
            "chat_id": 0,
            "question": "이 단어 뜻은?",
            "answer": "이 단어는 A를 의미합니다.",
        },
    ]

    # 정상 대화 요청
    response = client.post(
        "/vocab/chatbot",
        json={
            "vocab_id": vocab_data.vocab_id,
            "question": "이 단어 뜻은?",
            "previous": previous,
        },
        headers=auth_headers,
    )

    # 응답 데이터 검증
    assert response.status_code == 200, f"Response: {response.json()}"
    data = response.json()
    assert "chat_id" in data, "응답에 chat_id가 포함되어야 합니다."
    assert data["answer"] == "AI 응답 메시지"
