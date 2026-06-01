"""
GET /health
Returns service status, active inference backend, and whether the model is reachable.
"""
from fastapi import APIRouter

from app.config import settings
from app.services.groq_client import GroqClient
from app.services.ollama_client import OllamaClient

router = APIRouter()


@router.get("/health", tags=["Health"])
async def health() -> dict:
    if settings.use_groq:
        client      = GroqClient()
        model_name  = settings.groq_model
        backend     = "groq"
    else:
        client      = OllamaClient()
        model_name  = settings.model_name
        backend     = "ollama"

    model_loaded = await client.is_available()

    return {
        "status":      "ok",
        "backend":     backend,
        "model":       model_name,
        "modelLoaded": model_loaded,
        "env":         settings.app_env,
    }
