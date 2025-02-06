from fastapi import FastAPI
from api.routes.vocab_chat import router as vocab_chat_router


app = FastAPI(root_path="/")

app.include_router(vocab_chat_router)

# 서버 실행
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
