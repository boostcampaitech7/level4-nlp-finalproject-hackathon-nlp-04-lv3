from fastapi import FastAPI
from contextlib import asynccontextmanager
from loguru import logger
from sqlmodel import SQLModel
from starlette.middleware.cors import CORSMiddleware


from core.database import engine
from core.scheduler import scheduler

from models.user import Users
from models.score import Scores
from models.diary import Diaries
from models.study_record import StudyRecords
from models.alarm import Alarms

from api.routes.user import router as user_router
from api.routes.auth import router as auth_router
from api.routes.diary import router as diary_router
from api.routes.main import router as main_router
from api.routes.study_record import router as record_router
from api.routes.alarm import router as alarm_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Creating database table")
    SQLModel.metadata.create_all(engine)

    logger.info("Starting scheduler")
    scheduler.start()
    yield
    logger.info("Shutting down scheduler")
    scheduler.shutdown(wait=False)


app = FastAPI(lifespan=lifespan, root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(auth_router)
app.include_router(diary_router)
app.include_router(main_router)
app.include_router(record_router)
app.include_router(alarm_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
