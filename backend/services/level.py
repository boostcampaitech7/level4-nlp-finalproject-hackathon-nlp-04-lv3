from fastapi import HTTPException, status
from sqlmodel import Session, select
from datetime import datetime

from models.score import Scores


# 사용자 난이도(레벨) 추출
def get_user_level(user_id: int, session: Session):
    score = session.exec(select(Scores).where(Scores.user_id == user_id)).first()
    if not score:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="페이지를 찾을 수 없습니다."
        )
    if score.level is None or not (1 <= score.level <= 5):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="잘못된 난이도입니다."
        )
    return score.level


# 사용자 난이도(레벨) 업데이트
def update_level(user_id: int, session: Session, correct: list[int]):
    scores = session.exec(select(Scores).where(Scores.user_id == user_id)).first()
    if scores:
        # 기존 값에서 업데이트
        scores.text_cnt += 3  # 긴 글 퀴즈 푼 횟수 증가
        scores.total_quiz_cnt += 3  # 전체 퀴즈 푼 횟수 증가
        scores.correct_quiz_cnt += sum(correct)  # 맞은 문제 개수 업데이트
        scores.rating = (
            scores.correct_quiz_cnt / scores.total_quiz_cnt
        ) * 100  # 정답률 업데이트

        # 난이도(level) 업데이트
        if scores.total_quiz_cnt >= 120:
            if scores.rating >= 70:
                new_level = scores.level + 1
                level_message = "난이도가 1 상승했습니다."
                scores.total_quiz_cnt = 100
                scores.rating = 60
            elif scores.rating <= 50:
                new_level = scores.level - 1
                level_message = "난이도가 1 하락했습니다."
                scores.total_quiz_cnt = 100
                scores.rating = 60
            else:
                new_level = scores.level
                level_message = "난이도를 유지합니다."
            scores.level = max(
                1, min(5, new_level)
            )  # 난이도(level) 업데이트 (반드시 1~5)
        else:
            level_message = "난이도를 유지합니다."

        # 업데이트 시간
        scores.updated_at = datetime.now()

        session.flush()
        session.refresh(scores)

    return scores.rating, level_message
