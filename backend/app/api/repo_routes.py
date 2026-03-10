from fastapi import APIRouter
from app.services.repo_service import clone_repository
from app.services.parser_service import parse_repository
from app.services.repo_service import safe_delete
from app.services.embedding_service import generate_embedding
from app.services.vector_service import store_chunk
import uuid

router = APIRouter()

@router.post("/analyze-repo")
def analyze_repository(repo_url: str):

    repo_path = clone_repository(repo_url)

    parsed_chunks = parse_repository(repo_path)

    safe_delete(repo_path)

    for chunk in parsed_chunks:

        text = ""

        if chunk["type"] == "function" or chunk["type"] == "class":
            text = chunk["code"]

        elif chunk["type"] == "document":
            text = chunk["content"]

        if not text:
            continue

        embedding = generate_embedding(text)

        chunk_id = str(uuid.uuid4())

        metadata = {
            "type": chunk["type"],
            "file": chunk["file"]
        }

        store_chunk(chunk_id, embedding, metadata, text)

    return {
        "chunks_processed": len(parsed_chunks),
        "vector_db": "Chroma",
        "collection": "code_chunks"
    }