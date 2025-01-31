from fastapi import Depends, APIRouter, HTTPException, status
from sqlmodel import Session, select
from sqlalchemy import desc, cast, Date
from typing import List
from datetime import date

from models.diary import Diaries
from models.score import Scores
from schemas.diary import DiaryDTO, DiaryExtendedDTO, DiaryBookmarkDTO, DiaryDayDTO
from core.database import get_session
from core.security import validate_access_token, oauth2_scheme


router = APIRouter(prefix="/diary", tags=["diary"])


"""
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

    # 3. 응답 데이터 생성
    return DiaryExtendedDTO(
        diary_id=diary.diary_id,
        text=diary.text,
        feedback=diary.feedback,
        review=diary.review,
        created_at=diary.created_at,
    )
"""


# 일기, 피드백 조회
@router.get(
    "/diary_id/{diary_id}",
    response_model=DiaryExtendedDTO,
    status_code=status.HTTP_200_OK,
)
def fetch_diary_by_id(
    diary_id: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증 (username이 존재하는지 확인해야 한다. 회원탈퇴했을 수 있으니, 물론 회원탈퇴 가능은 없지만)
    validate_access_token(token)

    # 2. diary 찾기
    diary = session.get(Diaries, diary_id)

    # 2.1. diary가 존재하지 않을 시 예외 처리
    if not diary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="diary doesn't exist"
        )

    # 3. 응답 데이터 생성
    return DiaryExtendedDTO(
        diary_id=diary.diary_id,
        status=diary.status,
        text=diary.text,
        feedback=diary.feedback,
        review=diary.review,
        created_at=diary.created_at,
    )


# 일기 목록 조회
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

    # 2. diary created_at 기준으로 정렬 후, (n-1)*10 ~ n*10 일기 뽑기
    statement = (
        select(Diaries)
        .where(Diaries.user_id == user_id)
        .order_by(desc(Diaries.created_at))
        .offset((page_num - 1) * 10)
        .limit(10)
    )
    diary_list = session.exec(statement).all()

    # 3. 응답 데이터 생성
    return [
        DiaryDayDTO(diary_id=diary.diary_id, day=diary.created_at, status=diary.status)
        for diary in diary_list
    ]


"""
# 일기 즐겨찾기
@router.patch("/bookmark", status_code=status.HTTP_200_OK)
def bookmark(
    bookmark: DiaryBookmarkDTO,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    # 1. 토큰 검증
    validate_access_token(token)

    # 2. diary 정보 추출
    diary = session.get(Diaries, bookmark.diary_id)
    # 2.1. user가 존재하지 않을 시 예외 처리
    if not diary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="diary doesn't exist"
        )

    diary.bookmark = bookmark.bookmark
    session.commit()

    # 3. 응답 데이터 생성
    return {
        "message": "Diary bookmark successfully changed",
        "diary_id": diary.diary_id,
    }


# 일기 즐겨찾기 리스트(페이지) 조회
@router.get(
    "/bookmark_page/{page_num}",
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

    # 2. bookmark diary를 created_at 기준으로 정렬 후, (n-1)*10 ~ n*10 일기 뽑기
    statement = (
        select(Diaries)
        .where(Diaries.user_id == user_id, Diaries.bookmark == True)
        .order_by(desc(Diaries.created_at))
        .offset((page_num - 1) * 10)
        .limit(10)
    )
    diary_list = session.exec(statement).all()

    # 3. 응답 데이터 생성
    return [
        DiaryDayDTO(diary_id=diary.diary_id, day=diary.created_at, status=diary.status)
        for diary in diary_list
    ]
"""


# 일기 피드백 요청
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
        diary = Diaries(user_id=user_id, text=new_diary.text, status=1, bookmark=False)
        session.add(diary)
        # 제출 일기 개수 증가
        statement = select(Scores).where(Scores.user_id == user_id)
        score = session.exec(statement).first()
        score.diary_cnt += 1
        session.commit()
    # 2.2. diary가 존재할 시 수정
    else:
        diary.text = new_diary.text
        diary.status = 1
        session.commit()

    # 3. 응답 데이터 생성
    return {
        "message": "Diary successfully accepted",
        "diary_id": diary.diary_id,
    }


# 일기 저장
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
        diary = Diaries(user_id=user_id, text=new_diary.text, status=0, bookmark=False)
        session.add(diary)
        # 제출 일기 개수 증가
        statement = select(Scores).where(Scores.user_id == user_id)
        score = session.exec(statement).first()
        score.diary_cnt += 1
        session.commit()
    # 2.2. diary가 존재할 시 수정
    else:
        diary.text = new_diary.text
        session.commit()

    # 3. 응답 데이터 생성
    return {
        "message": "Diary successfully saved",
        "diary_id": diary.diary_id,
    }
