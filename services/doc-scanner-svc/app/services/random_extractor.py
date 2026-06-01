"""
RandomExtractorService — scans any document without a predefined schema.

The AI decides what fields to extract based on what it finds in the document.
Returns a flat dict of camelCase fields with confidence scores.

Text path  — for digital PDFs with extractable text (fast, accurate)
Vision path — for images and scanned PDFs (uses vision AI)
"""
import json
import re
from pathlib import Path

import httpx

from app.config import settings
from app.models.extraction_result import FieldResult, SourceResult
from app.models.random_scan_result import RandomScanResult
from app.services.groq_client import GroqClient
from app.services.image_utils import ImageUtils
from app.services.ollama_client import OllamaClient
from app.services.pdf_converter import PdfConverter
from app.services.pdf_text_extractor import PdfTextExtractor

_PROMPTS_DIR = Path(__file__).parent.parent / "prompts"

_DEFAULT_CONFIDENCE = 0.85


class RandomExtractorService:
    def __init__(self) -> None:
        self._client         = GroqClient() if settings.use_groq else OllamaClient()
        self._text_extractor = PdfTextExtractor()
        self._pdf_converter  = PdfConverter()
        self._image_utils    = ImageUtils()

    # ── Public ────────────────────────────────────────────────────────────────

    async def extract(
        self,
        file_bytes:   bytes,
        content_type: str,
        country_code: str,
    ) -> RandomScanResult:
        """
        Scan any document and return all extractable fields.

        PDF with text → text path (fast)
        PDF scanned / image → vision path
        """
        is_pdf            = "pdf" in content_type.lower()
        extraction_method = "vision"

        if is_pdf:
            pdf_text = self._text_extractor.extract(file_bytes, settings.max_pdf_pages)

            if pdf_text:
                extraction_method = "text"
                prompt            = self._text_prompt(country_code, pdf_text)
                raw               = await self._call_text(prompt)
            else:
                pages = self._pdf_converter.convert(file_bytes, settings.max_pdf_pages)
                if not pages:
                    raise ValueError("Could not extract any pages from the PDF.")
                image_bytes = pages[0]
                prompt      = self._vision_prompt(country_code)
                raw         = await self._call_vision(prompt, image_bytes)
        else:
            image_bytes = self._image_utils.resize_for_inference(file_bytes, max_px=768)
            prompt      = self._vision_prompt(country_code)
            raw         = await self._call_vision(prompt, image_bytes)

        return self._build_result(raw, country_code, extraction_method)

    # ── Prompt helpers ────────────────────────────────────────────────────────

    def _vision_prompt(self, country_code: str) -> str:
        template = (_PROMPTS_DIR / "scan_random.txt").read_text(encoding="utf-8")
        return template.replace("{countryCode}", country_code)

    def _text_prompt(self, country_code: str, document_text: str) -> str:
        template = (_PROMPTS_DIR / "text_scan_random.txt").read_text(encoding="utf-8")
        return (
            template
            .replace("{countryCode}", country_code)
            .replace("{documentText}", document_text)
        )

    # ── AI calls ──────────────────────────────────────────────────────────────

    async def _call_vision(self, prompt: str, image_bytes: bytes) -> str:
        try:
            return await self._client.chat_with_image(prompt, image_bytes)
        except (httpx.TimeoutException, httpx.HTTPStatusError):
            raise

    async def _call_text(self, prompt: str) -> str:
        try:
            return await self._client.chat_with_text(prompt)
        except (httpx.TimeoutException, httpx.HTTPStatusError):
            raise

    # ── Parsing ───────────────────────────────────────────────────────────────

    def _build_result(
        self,
        raw:              str,
        country_code:     str,
        extraction_method: str,
    ) -> RandomScanResult:
        json_str = _strip_to_json(raw)

        try:
            parsed = json.loads(json_str)
        except (json.JSONDecodeError, ValueError):
            return RandomScanResult(
                countryCode=country_code,
                extractionMethod=extraction_method,
                confidence=0.0,
                fields={},
                warnings=["Could not parse document. Please check the file and try again."],
            )

        # Handle array wrapping
        if isinstance(parsed, list):
            dicts = [i for i in parsed if isinstance(i, dict)]
            data: dict = {}
            for d in dicts:
                data.update(d)
        else:
            data = parsed if isinstance(parsed, dict) else {}

        fields:   dict[str, FieldResult] = {}
        warnings: list[str]              = []

        for key, raw_val in data.items():
            # Support {"value": ..., "confidence": ...} or flat value
            if isinstance(raw_val, dict):
                value      = raw_val.get("value")
                confidence = float(raw_val.get("confidence", _DEFAULT_CONFIDENCE))
            else:
                value      = raw_val
                confidence = _DEFAULT_CONFIDENCE

            if isinstance(value, str) and not value.strip():
                continue   # skip empty strings — prompt says only include found fields

            if value is not None:
                value = str(value).strip()

            filled = value is not None
            if not filled:
                continue   # skip nulls

            if filled and confidence < settings.low_confidence_threshold:
                warnings.append(f"'{key}' has low confidence — please verify.")

            fields[key] = FieldResult(
                value=value,
                confidence=round(confidence, 2),
                filled=True,
            )

        filled_list  = list(fields.values())
        overall_conf = (
            round(sum(f.confidence for f in filled_list) / len(filled_list), 2)
            if filled_list else 0.0
        )

        return RandomScanResult(
            countryCode=country_code,
            extractionMethod=extraction_method,
            confidence=overall_conf,
            fields=fields,
            warnings=warnings,
        )


# ── Merge helper ──────────────────────────────────────────────────────────────

def merge_random_results(results: list[RandomScanResult]) -> RandomScanResult:
    """
    Merges multiple RandomScanResult objects into one.
    Per field: highest-confidence value wins.
    """
    if not results:
        raise ValueError("merge_random_results requires at least one result.")

    if len(results) == 1:
        r = results[0]
        r.sources = [SourceResult(
            documentType="UNKNOWN",
            autoDetected=False,
            confidence=r.confidence,
            fieldsFound=len(r.fields),
        )]
        return r

    all_keys: set[str] = set()
    for r in results:
        all_keys.update(r.fields.keys())

    merged: dict[str, FieldResult] = {}
    for key in all_keys:
        best: FieldResult | None = None
        for r in results:
            field = r.fields.get(key)
            if field and field.filled:
                if best is None or field.confidence > best.confidence:
                    best = field
        if best:
            merged[key] = best

    filled       = list(merged.values())
    overall_conf = (
        round(sum(f.confidence for f in filled) / len(filled), 2)
        if filled else 0.0
    )

    sources = [
        SourceResult(
            documentType="UNKNOWN",
            autoDetected=False,
            confidence=r.confidence,
            fieldsFound=len(r.fields),
        )
        for r in results
    ]

    # Determine extraction method — "text" if any file used text path
    method = "text" if any(r.extractionMethod == "text" for r in results) else "vision"

    return RandomScanResult(
        countryCode=results[0].countryCode,
        extractionMethod=method,
        confidence=overall_conf,
        fields=merged,
        warnings=[],
        sources=sources,
    )


# ── Shared utility ────────────────────────────────────────────────────────────

def _strip_to_json(text: str) -> str:
    text = re.sub(r"```(?:json)?\s*", "", text)
    text = re.sub(r"```", "", text).strip()

    obj_start = text.find("{")
    obj_end   = text.rfind("}")
    arr_start = text.find("[")
    arr_end   = text.rfind("]")

    has_obj = obj_start != -1 and obj_end > obj_start
    has_arr = arr_start != -1 and arr_end > arr_start

    if has_obj and has_arr:
        return text[obj_start:obj_end + 1] if obj_start < arr_start else text[arr_start:arr_end + 1]
    if has_obj:
        return text[obj_start:obj_end + 1]
    if has_arr:
        return text[arr_start:arr_end + 1]
    return text
