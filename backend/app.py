from fastapi import FastAPI
from contextlib import asynccontextmanager
from loguru import logger
from sqlmodel import SQLModel
from starlette.middleware.cors import CORSMiddleware


from models.user import Users
from models.score import Scores
from models.diary import Diaries
from core.database import engine
from api.routes.user import router as user_router
from api.routes.auth import router as auth_router
from api.routes.diary import router as diary_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Creating database table")
    SQLModel.metadata.create_all(engine)
    yield


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

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
