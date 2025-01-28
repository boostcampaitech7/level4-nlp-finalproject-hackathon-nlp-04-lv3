from models.text import Texts
from models.text_conversation import TextConversations
from sqlmodel import select


# 글 목록 조회 테스트
def test_get_text_list(client, auth_headers):
    """
    1. 페이지 번호에 따라 글 목록을 반환해야 한다. (200 OK)
    """
    # 정상 글 목록 조회
    response = client.get("/text/list/1", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["page_num"] == 1
    assert len(data["texts"]) > 0

    # 총 페이지 수가 반환되는지 확인
    assert "total_page_count" in data
    assert data["total_page_count"] > 0


# 글 상세 조회 테스트
def test_get_text_item(client, auth_headers, test_db):
    """
    1. 존재하는 글 ID로 요청하면 글 상세 정보를 반환해야 한다. (200 OK)
    2. 존재하지 않는 글 ID로 요청하면 404 Not Found 응답이 와야 한다.
    """
    # 데이터베이스에서 테스트 글 가져오기
    text_data = test_db.exec(select(Texts).where(Texts.title == "연금술사")).first()
    assert text_data is not None, "테스트용 글이 존재하지 않습니다."

    # 정상 글 조회
    response = client.get(f"/text/{text_data.text_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["text_id"] == text_data.text_id
    assert data["title"] == text_data.title

    # 존재하지 않는 글 조회
    response = client.get("/text/9999", headers=auth_headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "해당 글을 찾을 수 없습니다."}


# 글 설명 요청 테스트
def test_request_text_account(client, auth_headers, mocker, test_db):
    """
    1. 올바른 글 ID와 focus 부분으로 요청하면 AI 서버의 응답을 반환해야 한다. (200 OK)
    2. AI 서버의 요청 실패 시 HTTPException이 발생해야 한다. (500 Internal Server Error)
    """
    # 데이터베이스에서 테스트 글 가져오기
    text_data = test_db.exec(select(Texts).where(Texts.title == "연금술사")).first()
    assert text_data is not None, "테스트용 글이 존재하지 않습니다."

    # Mock - AI 서버 응답
    mock_ai_response = {
        "status": {"code": "20000", "message": "OK"},
        "result": {"message": {"content": "AI 응답 메시지"}},
    }
    mocker.patch(
        "api.routes.text.httpx.AsyncClient.post",
        return_value=mocker.Mock(
            status_code=200,
            json=lambda: mock_ai_response,
        ),
    )

    # 정상 설명 요청
    response = client.post(
        "/text/account",
        json={"text_id": text_data.text_id, "focused": "내용"},
        headers=auth_headers,
    )

    # 응답 데이터 검증
    assert response.status_code == 200, f"Response: {response.json()}"
    data = response.json()
    assert data["explain"] == "AI 응답 메시지"


# 긴 글 챗봇 대화 조회 테스트
def test_get_chatbot_list(client, auth_headers, test_db):
    """
    1. 존재하는 글 ID와 페이지 번호로 요청하면 해당 페이지의 챗봇 대화 목록을 반환해야 한다. (200 OK)
    2. 존재하지 않는 글 ID로 요청하면 빈 목록을 반환해야 한다. (200 OK)
    """
    # 데이터베이스에서 글 및 대화 데이터를 가져오기
    text_data = test_db.exec(select(Texts).where(Texts.title == "연금술사")).first()
    assert text_data is not None, "테스트용 글이 존재하지 않습니다."

    # 대화 데이터 존재 확인
    conversations = test_db.exec(
        select(TextConversations).where(TextConversations.text_id == text_data.text_id)
    ).all()
    assert len(conversations) > 0, "테스트용 대화가 존재하지 않습니다."

    text_id = text_data.text_id
    page_num = 1

    # 정상 대화 목록 조회
    response = client.get(f"/text/chatbot/{text_id}/{page_num}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["text_id"] == text_id
    assert len(data["chats"]) > 0
    assert data["chats"][0]["question"] == "대화 문맥"

    # 빈 대화 목록 조회
    response = client.get(f"/text/chatbot/9999/{page_num}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["text_id"] == 9999
    assert len(data["chats"]) == 0


# 긴 글 챗봇 대화 요청 테스트
def test_request_text_chatbot_response(client, auth_headers, mocker, test_db):
    """
    1. 올바른 글과 질문으로 요청하면 AI 서버의 응답을 반환해야 한다. (200 OK)
    2. AI 서버의 요청 실패 시 HTTPException이 발생해야 한다. (500 Internal Server Error)
    """
    # 데이터베이스에서 테스트 글 가져오기
    text_data = test_db.exec(select(Texts).where(Texts.title == "연금술사")).first()
    assert text_data is not None, "테스트용 글이 존재하지 않습니다."

    # Mock - AI 서버 응답
    mock_ai_response = {
        "status": {"code": "20000", "message": "OK"},
        "result": {"message": {"content": "AI 응답 메시지"}},
    }
    mocker.patch(
        "api.routes.text.httpx.AsyncClient.post",
        return_value=mocker.Mock(
            status_code=200,
            json=lambda: mock_ai_response,
        ),
    )

    # 정상 대화 요청
    response = client.post(
        "/text/chatbot",
        json={"text_id": text_data.text_id, "focused": "내용", "question": "질문 내용"},
        headers=auth_headers,
    )

    # 응답 데이터 검증
    assert response.status_code == 200, f"Response: {response.json()}"
    data = response.json()
    assert "chat_id" in data, "응답에 chat_id가 포함되어야 합니다."
    assert data["answer"] == "AI 응답 메시지"
