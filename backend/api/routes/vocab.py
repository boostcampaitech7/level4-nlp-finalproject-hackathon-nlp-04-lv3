from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from sqlalchemy import func

from schemas.vocab import VocabDetailDTO
from models.vocab import Vocabs
from models.score import Scores
#from models.bookmark import VocabBookmarks
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme
from datetime import datetime


router = APIRouter(prefix="/vocab", tags=["vocab"])

# 단어 설명 조회
@router.get("/{action}/{vocab_id}", response_model=VocabDetailDTO, status_code=status.HTTP_200_OK)
def fetch_vocab_detail(
    action: str, vocab_id: int, token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    # 1. 토큰 검증 및 user_id 추출
    user_id = validate_access_token(token)["sub"]
    
    # 2. 사용자 level 추출
    score = session.exec(select(Scores).where(Scores.user_id == user_id)).first()
    if not score:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Score not found"
        )
    
    level = score.level  # 1~5 범위로 지정된 level 값
    if level is None or not (1 <= level <= 5):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid level"
        )
    
    # 3. action 값에 따라 동작 결정
    if action == "learn":
        # "단어 학습"일 때 랜덤 단어 선택
        vocab = session.exec(select(Vocabs).order_by(func.random()).limit(1)).first()
    elif action in ["prev", "next"]:
        # "이전 단어" 또는 "다음 단어"일 때 vocab_id로 단어 조회
        vocab = session.exec(select(Vocabs).where(Vocabs.vocab_id == vocab_id)).first()
    else:
        raise HTTPException(
            status_code=status.HTTP_404_BAD_REQUEST, detail="Invalid action"
        )
    # 3.1 단어가 존재하지 않을 시 예외 처리
    if not vocab:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Vocab not found"
        )

    # 4. 즐겨찾기 유무 확인
    #bookmark = bool(session.exec(select(VocabBookmarks).where(VocabBookmarks.user_id == user_id, VocabBookmarks.vocab_id == vocab.vocab_id)).first())


    # 5. level에 맞는 easy_explain 데이터 선택 (level-1 인덱스 사용)
    try:
        easy_explain = vocab.easy_explain[level - 1]  # level이 1~5이므로 (level-1) 인덱스 사용
    except IndexError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Explanation for the user's level not found"
        )
    
    return VocabDetailDTO(
        vocab_id=vocab.vocab_id,
        vocab=vocab.vocab,
        hanja=vocab.hanja,
        #bookmark=bookmark,
        dict_mean=vocab.dict_mean,
        easy_explain=easy_explain,
        correct_example=vocab.correct_example,
        incorrect_example=vocab.incorrect_example
    )

'''
# 단어 즐겨찾기 추가
@router.post("/bookmark", status_code=status.HTTP_200_OK)
def add_vocab_bookmark(
    user_id: int, vocab_id: int, session: Session = Depends(get_session)
):
    bookmark = VocabBookmarks(
        user_id=user_id,
        vocab_id=vocab_id,
        updated_at=datetime.now()
    )
    session.add(bookmark)
    session.commit()
    session.refresh(bookmark)

    return {"status": "success"} # status 200 반환
'''
'''
# 단어 즐겨찾기 삭제
@router.delete("/bookmark", status_code=status.HTTP_200_OK)
def remove_vocab_bookmark(
    user_id: int, vocab_id: int, session: Session = Depends(get_session)
):
    bookmark = session.exec(
        select(VocabBookmarks).where(
            VocabBookmarks.user_id == user_id,
            VocabBookmarks.vocab_id == vocab_id
        )
    ).first()

    if not bookmark:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bookmark not found")
    
    session.delete(bookmark)
    session.commit()

    return {"status": "success"} # status 200 반환
    '''