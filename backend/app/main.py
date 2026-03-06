from fastapi import FastAPI
from app.api.repo_routes import router

app = FastAPI()
app.include_router(router)

@app.get("/")
def root():
    return {"message" : "AI Codebase Explainer running"}

