from fastapi import FastAPI
from ai.realtime_fastapi.api.routes.vocab_explain import router as vocab_router

app = FastAPI()

# 라우터 등록
app.include_router(vocab_router, prefix="/ai", tags=["vocab_explain"])
