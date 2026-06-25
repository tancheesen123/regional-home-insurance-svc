"""
GroqClient — calls LLaMA 3.2 Vision via Groq's cloud API.
Groq runs on LPU hardware so inference takes 3–8 seconds vs minutes on local CPU.

Free tier: 30 requests/min, 500 requests/day (llama-3.2-11b-vision-preview).
Upgrade at: https://console.groq.com
"""
import base64

from groq import Groq

from app.config import settings


class GroqClient:
    def __init__(self) -> None:
        if not settings.groq_api_key:
            raise RuntimeError(
                "GROQ_API_KEY is not set in .env. "
                "Get a free key at https://console.groq.com"
            )
        self._client = Groq(api_key=settings.groq_api_key)
        self._model  = settings.groq_model

    async def is_available(self) -> bool:
        """Always True when API key is configured — Groq is a managed cloud service."""
        return bool(settings.groq_api_key)

    async def chat_with_image(self, prompt: str, image_bytes: bytes) -> str:
        """
        Sends image + prompt to LLaMA Vision on Groq.
        Returns the raw text content of the model's reply.

        Groq's vision API accepts base64-encoded images via data URLs.
        """
        image_b64 = base64.b64encode(image_bytes).decode("utf-8")
        data_url  = f"data:image/png;base64,{image_b64}"

        response = self._client.chat.completions.create(
            model=self._model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": data_url},
                        },
                        {
                            "type": "text",
                            "text": prompt,
                        },
                    ],
                }
            ],
            max_tokens=1024,
            temperature=0,
        )

        return response.choices[0].message.content or ""

    async def chat_with_text(self, prompt: str) -> str:
        """
        Sends a text-only prompt to the model (no image).
        Used for digital PDFs where text has already been extracted by pdfplumber.
        """
        response = self._client.chat.completions.create(
            model=self._model,
            messages=[
                {
                    "role":    "user",
                    "content": prompt,
                }
            ],
            max_tokens=1024,
            temperature=0,
        )

        return response.choices[0].message.content or ""
