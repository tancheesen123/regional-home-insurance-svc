"""
GET /health
Returns service status and model info.
modelLoaded will be False until Step 2 (Ollama integration).
"""
from fastapi import APIRouter
from app.config import settings

router = APIRouter()


@router.get("/health", tags=["Health"])
async def health() -> dict:
    return {
        "status":      "ok",
        "model":       settings.model_name,
        "modelLoaded": False,   # updated to True in Step 2 after Ollama is wired
        "env":         settings.app_env,
    }
