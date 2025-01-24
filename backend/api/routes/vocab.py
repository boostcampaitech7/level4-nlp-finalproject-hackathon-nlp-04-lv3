from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select

from schemas.vocab import VocabDetailDTO
from models.vocab import Vocabs
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme


router = APIRouter(prefix="/vocab", tags=["vocab"])

# 단어 설명 조회
@router.get("/{vocab_id}", response_model=VocabDetailDTO, status_code=status.HTTP_200_OK)
def fetch_vocab_detail(
    vocab_id: int, token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    # 1. 토큰 검증
    try:
        validate_access_token(token)["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")
    
    # 2. vocab_id와 일치하는 단어 정보
    vocab = session.exec(select(Vocabs).where(Vocabs.vocab_id == vocab_id)).first()
    if not vocab:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vocab not found")

    return VocabDetailDTO(
        vocab_id=vocab.vocab_id,
        vocab=vocab.vocab,
        hanja=vocab.hanja,
        dict_mean=vocab.dict_mean,
        easy_explain=vocab.easy_explain,
        correct_example=vocab.correct_example,
        incorrect_example=vocab.incorrect_example
    )