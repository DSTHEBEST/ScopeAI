from pathlib import Path

from fastapi import FastAPI
from app.api.repo_routes import router

from dotenv import load_dotenv

# Load environment variables from the backend/.env file (even if the app is started from a different working directory).
backend_dir = Path(__file__).resolve().parents[1]
load_dotenv(backend_dir / ".env")

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {"message" : "AI Codebase Explainer running"}

