"""
OllamaClient — async HTTP wrapper around the Ollama API.
Handles model availability checks and vision inference calls.
"""
import base64

import httpx

from app.config import settings

# Ollama model name may include a tag (e.g. "llama3.2-vision:11b").
# /api/tags returns names with tags, so a substring match is safe.
_MODEL_TIMEOUT   = 600.0   # seconds — CPU inference can take 3–10 min without a GPU
_HEALTH_TIMEOUT  = 5.0


class OllamaClient:
    def __init__(self) -> None:
        self._base_url = settings.ollama_base_url.rstrip("/")
        self._model    = settings.model_name

    # ── Availability ──────────────────────────────────────────────────────────

    async def is_available(self) -> bool:
        """
        Returns True if Ollama is running AND the configured model is downloaded.
        Used by GET /health.
        """
        try:
            async with httpx.AsyncClient(timeout=_HEALTH_TIMEOUT) as client:
                resp = await client.get(f"{self._base_url}/api/tags")
                if resp.status_code != 200:
                    return False
                models: list[str] = [m["name"] for m in resp.json().get("models", [])]
                return any(self._model in name for name in models)
        except Exception:
            return False

    # ── Inference ─────────────────────────────────────────────────────────────

    async def chat_with_image(self, prompt: str, image_bytes: bytes) -> str:
        """
        Sends an image + prompt to LLaMA Vision via the Ollama /api/chat endpoint.
        Returns the raw text content of the model's reply.

        Raises:
            httpx.HTTPStatusError  — Ollama returned a non-2xx response
            httpx.TimeoutException — model took too long to respond
        """
        image_b64 = base64.b64encode(image_bytes).decode("utf-8")

        payload = {
            "model":    self._model,
            "stream":   False,
            "messages": [
                {
                    "role":    "user",
                    "content": prompt,
                    "images":  [image_b64],
                }
            ],
        }

        async with httpx.AsyncClient(timeout=_MODEL_TIMEOUT) as client:
            resp = await client.post(
                f"{self._base_url}/api/chat",
                json=payload,
            )
            resp.raise_for_status()
            return resp.json()["message"]["content"]

    async def chat_with_text(self, prompt: str) -> str:
        """
        Sends a text-only prompt to the model (no image).
        Used for digital PDFs where text has already been extracted.
        """
        payload = {
            "model":    self._model,
            "stream":   False,
            "messages": [
                {
                    "role":    "user",
                    "content": prompt,
                }
            ],
        }

        async with httpx.AsyncClient(timeout=_MODEL_TIMEOUT) as client:
            resp = await client.post(
                f"{self._base_url}/api/chat",
                json=payload,
            )
            resp.raise_for_status()
            return resp.json()["message"]["content"]
