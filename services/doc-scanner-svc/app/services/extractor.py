"""
ExtractorService — calls LLaMA 3.2 Vision via Ollama and parses the response.
Implemented in Step 3.
"""
from app.models.extraction_result import ExtractionResult


class ExtractorService:
    async def extract(
        self,
        image_bytes:   bytes,
        document_type: str,
        country_code:  str,
    ) -> ExtractionResult:
        raise NotImplementedError("ExtractorService implemented in Step 3.")
