"""
ExtractorService — smart extraction pipeline.

For PDFs: tries text extraction first (pdfplumber). If the PDF has readable text,
sends it to the AI as a text prompt (fast, accurate). If the PDF is a scanned image,
falls back to the vision path.

For images (JPG/PNG/WEBP): always uses the vision path.
"""
import json
import re
from pathlib import Path

import httpx

from app.config import settings
from app.models.extraction_result import ExtractionResult, FieldResult, SourceResult
from app.services.groq_client import GroqClient
from app.services.ollama_client import OllamaClient
from app.services.pdf_converter import PdfConverter
from app.services.pdf_text_extractor import PdfTextExtractor

_PROMPTS_DIR = Path(__file__).parent.parent / "prompts"

# Maps DocumentType → image prompt filename (without .txt)
_PROMPT_FILES: dict[str, str] = {
    "IC":             "ic_passport",
    "PROPERTY_TITLE": "property_title",
    "POLICY":         "policy",
    "UTILITY_BILL":   "utility_bill",
}

# Maps DocumentType → text prompt filename (without .txt)
_TEXT_PROMPT_FILES: dict[str, str] = {
    "IC":             "text_ic_passport",
    "PROPERTY_TITLE": "text_property_title",
    "POLICY":         "text_policy",
    "UTILITY_BILL":   "text_utility_bill",
}

# Confidence applied to a found field when the model does not report one
_DEFAULT_FOUND_CONFIDENCE = 0.85


class ExtractorService:
    def __init__(self) -> None:
        # Pick backend based on config — swap by changing USE_GROQ in .env
        if settings.use_groq:
            self._client = GroqClient()
        else:
            self._client = OllamaClient()

        self._text_extractor = PdfTextExtractor()
        self._pdf_converter  = PdfConverter()

    # ── Public ────────────────────────────────────────────────────────────────

    async def extract(
        self,
        file_bytes:    bytes,
        content_type:  str,
        country_code:  str,
        document_type: str | None = None,
    ) -> ExtractionResult:
        """
        Smart extraction pipeline:

        PDF:
          1. Try text extraction (pdfplumber)
             a. Has text  → classify (if needed) → extract via text prompt
             b. No text   → convert to image → classify (if needed) → extract via vision
        Image (JPG/PNG/WEBP):
          1. Classify (if needed) → extract via vision prompt
        """
        auto_detected     = document_type is None
        extraction_method = "vision"   # default; overridden to "text" on text path

        is_pdf = "pdf" in content_type.lower()

        if is_pdf:
            pdf_text = self._text_extractor.extract(file_bytes, settings.max_pdf_pages)

            if pdf_text:
                # ── Text path ──────────────────────────────────────────────────
                extraction_method = "text"

                if auto_detected:
                    document_type = await self._classify_from_text(pdf_text)

                prompt   = self._load_text_prompt(document_type, country_code, pdf_text)
                raw_text = await self._call_text(prompt)
            else:
                # ── Vision path (scanned PDF) ──────────────────────────────────
                pages = self._pdf_converter.convert(file_bytes, settings.max_pdf_pages)
                if not pages:
                    raise ValueError("Could not extract any pages from the PDF.")
                image_bytes = pages[0]

                if auto_detected:
                    document_type = await self._classify_from_image(image_bytes)

                prompt   = self._load_image_prompt(document_type, country_code)
                raw_text = await self._call_vision(prompt, image_bytes)
        else:
            # ── Vision path (image file) ───────────────────────────────────────
            from app.services.image_utils import ImageUtils
            image_bytes = ImageUtils().resize_for_inference(file_bytes, max_px=768)

            if auto_detected:
                document_type = await self._classify_from_image(image_bytes)

            prompt   = self._load_image_prompt(document_type, country_code)
            raw_text = await self._call_vision(prompt, image_bytes)

        result = self._parse_response(raw_text, document_type, country_code)
        result.detectedDocumentType = document_type
        result.autoDetected         = auto_detected
        result.extractionMethod     = extraction_method
        return result

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

    # ── Classification ────────────────────────────────────────────────────────

    async def _classify_from_image(self, image_bytes: bytes) -> str:
        """Pass 1 — classify document type from an image."""
        prompt = (_PROMPTS_DIR / "classifier.txt").read_text(encoding="utf-8")
        try:
            raw = await self._client.chat_with_image(prompt, image_bytes)
        except (httpx.TimeoutException, httpx.HTTPStatusError):
            return "IC"
        return self._parse_doc_type(raw)

    async def _classify_from_text(self, document_text: str) -> str:
        """Pass 1 — classify document type from extracted PDF text."""
        template = (_PROMPTS_DIR / "text_classifier.txt").read_text(encoding="utf-8")
        prompt   = template.replace("{documentText}", document_text[:3000])  # cap length
        try:
            raw = await self._client.chat_with_text(prompt)
        except (httpx.TimeoutException, httpx.HTTPStatusError):
            return "POLICY"   # most likely doc type for digital PDFs
        return self._parse_doc_type(raw)

    @staticmethod
    def _parse_doc_type(raw: str) -> str:
        """
        Extract a known document type from a model response string.

        Tries exact match first, then word-boundary regex.
        Longer keys are checked before shorter ones to prevent "IC" matching
        inside "POLICY" (POL-IC-Y) or "UTILITY_BILL" etc.
        """
        raw_clean = raw.strip().upper()

        # 1. Exact match — fastest and most reliable
        if raw_clean in _PROMPT_FILES:
            return raw_clean

        # 2. Word-boundary match — longest keys first to avoid short-key false positives
        for doc_type in sorted(_PROMPT_FILES.keys(), key=len, reverse=True):
            if re.search(r'\b' + re.escape(doc_type) + r'\b', raw_clean):
                return doc_type

        return "POLICY"   # best fallback for digital PDFs

    # ── Prompt loading ────────────────────────────────────────────────────────

    def _load_image_prompt(self, document_type: str, country_code: str) -> str:
        filename    = _PROMPT_FILES.get(document_type.upper(), "ic_passport")
        prompt_path = _PROMPTS_DIR / f"{filename}.txt"
        if not prompt_path.exists():
            raise FileNotFoundError(f"Prompt file not found: {prompt_path}.")
        return prompt_path.read_text(encoding="utf-8").replace("{countryCode}", country_code)

    def _load_text_prompt(self, document_type: str, country_code: str, document_text: str) -> str:
        filename    = _TEXT_PROMPT_FILES.get(document_type.upper(), "text_ic_passport")
        prompt_path = _PROMPTS_DIR / f"{filename}.txt"
        if not prompt_path.exists():
            raise FileNotFoundError(f"Text prompt file not found: {prompt_path}.")
        return (
            prompt_path.read_text(encoding="utf-8")
            .replace("{countryCode}", country_code)
            .replace("{documentText}", document_text)
        )

    # kept for backward compatibility — used by _classify_document (old name)
    def _load_prompt(self, document_type: str, country_code: str) -> str:
        filename    = _PROMPT_FILES.get(document_type.upper(), "ic_passport")
        prompt_path = _PROMPTS_DIR / f"{filename}.txt"

        if not prompt_path.exists():
            raise FileNotFoundError(
                f"Prompt file not found: {prompt_path}. "
                f"Expected one of: {list(_PROMPT_FILES.values())}"
            )

        return prompt_path.read_text(encoding="utf-8").replace(
            "{countryCode}", country_code
        )

    # ── Response parsing ──────────────────────────────────────────────────────

    def _parse_response(
        self,
        raw_text:      str,
        document_type: str,
        country_code:  str,
    ) -> ExtractionResult:
        """
        Handles three model output shapes:
          A) Clean JSON object
          B) JSON wrapped in markdown code fences (```json ... ```)
          C) Prose with a JSON block somewhere inside
          D) JSON array — unwrapped automatically

        For each field:
          - value present and non-empty → filled=True,  confidence=0.85
          - value null / empty          → filled=False, confidence=0.00
          - confidence < threshold      → added to warnings list
        """
        json_str = self._strip_to_json(raw_text)

        try:
            parsed = json.loads(json_str)
        except (json.JSONDecodeError, ValueError):
            # Model returned unparseable output — return empty result with warning
            return ExtractionResult(
                documentType=document_type,
                detectedDocumentType=document_type,
                autoDetected=False,
                countryCode=country_code,
                confidence=0.0,
                fields={},
                warnings=[
                    "Could not read the document automatically. "
                    "Please fill in the form manually."
                ],
            )

        # Some models wrap the result in an array — unwrap and merge all dict elements
        if isinstance(parsed, list):
            dict_items = [item for item in parsed if isinstance(item, dict)]
            if not dict_items:
                return ExtractionResult(
                    documentType=document_type,
                    countryCode=country_code,
                    confidence=0.0,
                    fields={},
                    warnings=["Model returned an unexpected format. Please fill in the form manually."],
                    detectedDocumentType=document_type,
                    autoDetected=False,
                )
            # Merge all dicts in the list (in case model split fields across multiple objects)
            data: dict = {}
            for item in dict_items:
                data.update(item)
        else:
            data = parsed

        fields:   dict[str, FieldResult] = {}
        warnings: list[str]              = []

        for key, raw_val in data.items():
            # Support both flat {"key": value} and nested {"key": {"value":..,"confidence":..}}
            if isinstance(raw_val, dict):
                value      = raw_val.get("value")
                confidence = float(raw_val.get("confidence", _DEFAULT_FOUND_CONFIDENCE))
            else:
                value      = raw_val
                confidence = _DEFAULT_FOUND_CONFIDENCE

            # Normalise empty strings to None
            if isinstance(value, str) and not value.strip():
                value      = None
                confidence = 0.0

            # Normalise non-null value to string
            if value is not None:
                value = str(value).strip()

            filled = value is not None
            if not filled:
                confidence = 0.0

            if filled and confidence < settings.low_confidence_threshold:
                warnings.append(
                    f"'{key}' was detected but has low confidence — please verify the value."
                )

            fields[key] = FieldResult(
                value=value,
                confidence=round(confidence, 2),
                filled=filled,
            )

        # Overall confidence = average of filled fields (0.0 if nothing filled)
        filled_fields      = [f for f in fields.values() if f.filled]
        overall_confidence = (
            round(sum(f.confidence for f in filled_fields) / len(filled_fields), 2)
            if filled_fields else 0.0
        )

        # Warn about fields the model returned no value for
        empty_keys = [k for k, f in fields.items() if not f.filled]
        if empty_keys:
            warnings.append(
                f"{len(empty_keys)} field(s) not found on document — "
                "please enter manually: " + ", ".join(empty_keys) + "."
            )

        return ExtractionResult(
            documentType=document_type,
            detectedDocumentType=document_type,   # overwritten by extract() if auto-detected
            autoDetected=False,                   # overwritten by extract() if auto-detected
            countryCode=country_code,
            confidence=overall_confidence,
            fields=fields,
            warnings=warnings,
        )

    # ── Helpers ───────────────────────────────────────────────────────────────

    @staticmethod
    def _strip_to_json(text: str) -> str:
        """
        Strips markdown code fences and extracts the outermost JSON value.
        Handles:
          A) ```json{...}```  or  ```{...}```
          B) Plain {...}
          C) Plain [...]  (some models return an array)
          D) Prose with a JSON block somewhere inside
        """
        # Remove code fences
        text = re.sub(r"```(?:json)?\s*", "", text)
        text = re.sub(r"```", "", text).strip()

        obj_start = text.find("{")
        obj_end   = text.rfind("}")
        arr_start = text.find("[")
        arr_end   = text.rfind("]")

        has_obj = obj_start != -1 and obj_end != -1 and obj_end > obj_start
        has_arr = arr_start != -1 and arr_end != -1 and arr_end > arr_start

        if has_obj and has_arr:
            # Return whichever JSON structure starts first
            if obj_start < arr_start:
                return text[obj_start : obj_end + 1]
            return text[arr_start : arr_end + 1]

        if has_obj:
            return text[obj_start : obj_end + 1]

        if has_arr:
            return text[arr_start : arr_end + 1]

        return text


# ── Multi-file merge (module-level helper) ────────────────────────────────────

def merge_results(results: list[ExtractionResult]) -> ExtractionResult:
    """
    Merges extraction results from multiple documents into one.

    Merge strategy per field:
      - If only one result has a value → use it
      - If multiple results have a value → use the one with highest confidence
      - If no result has a value → field stays unfilled

    The merged result includes a `sources` list summarising each scanned document.
    """
    if not results:
        raise ValueError("merge_results requires at least one result.")

    if len(results) == 1:
        r = results[0]
        r.sources = [
            SourceResult(
                documentType=r.detectedDocumentType,
                autoDetected=r.autoDetected,
                confidence=r.confidence,
                fieldsFound=sum(1 for f in r.fields.values() if f.filled),
            )
        ]
        return r

    # Collect all field keys across every result
    all_keys: set[str] = set()
    for r in results:
        all_keys.update(r.fields.keys())

    # Per field: pick highest-confidence filled value across all results
    merged_fields: dict[str, FieldResult] = {}
    for key in all_keys:
        best: FieldResult | None = None
        for r in results:
            field = r.fields.get(key)
            if field and field.filled:
                if best is None or field.confidence > best.confidence:
                    best = field
        merged_fields[key] = best or FieldResult(value=None, confidence=0.0, filled=False)

    # Overall confidence
    filled       = [f for f in merged_fields.values() if f.filled]
    overall_conf = (
        round(sum(f.confidence for f in filled) / len(filled), 2)
        if filled else 0.0
    )

    # Warnings
    warnings: list[str] = []
    empty_keys = [k for k, f in merged_fields.items() if not f.filled]
    if empty_keys:
        warnings.append(
            f"{len(empty_keys)} field(s) not found in any document — "
            "please enter manually: " + ", ".join(empty_keys) + "."
        )

    # Sources summary — one entry per scanned file
    sources = [
        SourceResult(
            documentType=r.detectedDocumentType,
            autoDetected=r.autoDetected,
            confidence=r.confidence,
            fieldsFound=sum(1 for f in r.fields.values() if f.filled),
        )
        for r in results
    ]

    return ExtractionResult(
        documentType="MERGED",
        detectedDocumentType="MERGED",
        autoDetected=any(r.autoDetected for r in results),
        countryCode=results[0].countryCode,
        confidence=overall_conf,
        fields=merged_fields,
        warnings=warnings,
        sources=sources,
    )
