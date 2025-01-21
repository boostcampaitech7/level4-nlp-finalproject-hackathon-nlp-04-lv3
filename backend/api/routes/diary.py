from fastapi import Depends, APIRouter, HTTPException, status
from sqlmodel import Session, select
from sqlalchemy import desc, cast, Date
from typing import List
from datetime import date

from schemas.diary import DiaryDTO, DiaryExtendedDTO, DiaryBookmarkDTO, DiaryDayDTO
from models.diary import Diaries
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme


router = APIRouter(prefix="/diary", tags=["diary"])


@router.get(
    "/date/{date}", response_model=DiaryExtendedDTO, status_code=status.HTTP_200_OK
)
def fetch_diary_by_date(
    date: date,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증 (username이 존재하는지 확인해야 한다. 회원탈퇴했을 수 있으니, 물론 회원탈퇴 가능은 없지만)
    user_id = validate_access_token(token)["sub"]

    # 2. diary 찾기
    statement = select(Diaries).where(
        Diaries.user_id == user_id, cast(Diaries.created_at, Date) == date
    )
    diary = session.exec(statement).first()

    # 2.1. diary가 존재하지 않을 시 예외 처리
    if not diary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="diary doesn't exist"
        )

    return DiaryExtendedDTO(
        diary_id=diary.diary_id,
        text=diary.text,
        feedback=diary.feedback,
        review=diary.review,
        created_at=diary.created_at,
    )


@router.get(
    "/page/{page_num}", response_model=List[DiaryDayDTO], status_code=status.HTTP_200_OK
)
def fetch_diary_by_page(
    page_num: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. diary created_at 기준으로 정렬 후, n*10 ~ (n+1)*10 일기 뽑기
    statement = (
        select(Diaries)
        .where(Diaries.user_id == user_id)
        .order_by(desc(Diaries.created_at))
        .offset(page_num * 10)
        .limit(10)
    )
    diary_list = session.exec(statement).all()

    return [
        DiaryDayDTO(diary_id=diary.diary_id, day=diary.created_at, status=diary.status)
        for diary in diary_list
    ]


@router.patch("/bookmark", status_code=status.HTTP_200_OK)
def bookmark(
    bookmark: DiaryBookmarkDTO,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. diary 정보 추출
    diary = session.get(Diaries, bookmark.diary_id)
    # 2.1. user가 존재하지 않을 시 예외 처리
    if not diary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="diary doesn't exist"
        )

    diary.bookmark = bookmark.bookmark
    session.commit()

    return {
        "message": "Diary bookmark successfully changed",
        "diary_id": diary.diary_id,
    }


@router.get(
    "/bookmark-page/{page_num}",
    response_model=List[DiaryDayDTO],
    status_code=status.HTTP_200_OK,
)
def fetch_diary_by_page(
    page_num: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. bookmark diary를 created_at 기준으로 정렬 후, n*10 ~ (n+1)*10 일기 뽑기
    statement = (
        select(Diaries)
        .where(Diaries.user_id == user_id, Diaries.bookmark == True)
        .order_by(desc(Diaries.created_at))
        .offset(page_num * 10)
        .limit(10)
    )
    diary_list = session.exec(statement).all()

    return [
        DiaryDayDTO(diary_id=diary.diary_id, day=diary.created_at, status=diary.status)
        for diary in diary_list
    ]


@router.post("/feedback", status_code=status.HTTP_202_ACCEPTED)
def feedback(
    new_diary: DiaryDTO,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. diary 찾기
    statement = select(Diaries).where(
        Diaries.user_id == user_id, cast(Diaries.created_at, Date) == date.today()
    )
    diary = session.exec(statement).first()

    # 2.1. diary가 존재하지 않을 시 새로 생성
    if not diary:
        diary = Diaries(
            user_id=user_id, text=new_diary.text, status=True, bookmark=False
        )
        session.add(diary)
        # 제출 일기 개수 증가
        session.commit()
    # 2.2. diary가 존재할 시 수정
    else:
        diary.text = new_diary.text
        diary.status = True
        session.commit()

    return {
        "message": "Diary successfully accepted",
        "diary_id": diary.diary_id,
    }


@router.post("/save", status_code=status.HTTP_202_ACCEPTED)
def save(
    new_diary: DiaryDTO,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    user_id = validate_access_token(token)["sub"]

    # 2. diary 찾기
    statement = select(Diaries).where(
        Diaries.user_id == user_id, cast(Diaries.created_at, Date) == date.today()
    )
    diary = session.exec(statement).first()

    # 2.1. diary가 존재하지 않을 시 새로 생성
    if not diary:
        diary = Diaries(
            user_id=user_id, text=new_diary.text, status=False, bookmark=False
        )
        session.add(diary)
        session.commit()
        # 제출 일기 개수 증가
    # 2.2. diary가 존재할 시 수정
    else:
        diary.text = new_diary.text
        session.commit()

    return {
        "message": "Diary successfully saved",
        "diary_id": diary.diary_id,
    }
