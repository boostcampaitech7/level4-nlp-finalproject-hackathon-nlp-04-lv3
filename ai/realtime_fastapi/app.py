from fastapi import FastAPI
from api.routes.vocab_chat import router as vocab_chat_router
from api.routes.text_chat import router as text_chat_router
from api.routes.text_explain import router as text_explain_router


app = FastAPI(root_path="/ai")

app.include_router(vocab_chat_router)
app.include_router(text_chat_router)
app.include_router(text_explain_router)

# 서버 실행
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=True)
