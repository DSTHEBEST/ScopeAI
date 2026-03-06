from fastapi import APIRouter
from app.services.repo_service import clone_repository
from app.services.parser_service import parse_repository
from app.services.repo_service import safe_delete

router = APIRouter()

@router.post("/analyze-repo")
def analyze_repository(repo_url: str):

    repo_path = clone_repository(repo_url)

    parsed_data = parse_repository(repo_path)

    safe_delete(repo_path)

    return {
        "files_parsed": len(parsed_data),
        "data": parsed_data[:5]
    }