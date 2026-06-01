"""
POST /scan-document
Scans any document (no predefined schema) and returns all extractable fields as JSON.

Supports 1–3 files. Results from multiple files are merged by highest confidence per field.
Auto-detects text vs scanned PDF — no poppler needed for digital PDFs.
"""
import asyncio

import httpx
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.middleware.auth import require_jwt
from app.models.document_type import CountryCode
from app.models.random_scan_result import RandomScanResult
from app.services.random_extractor import RandomExtractorService, merge_random_results

router    = APIRouter()
MAX_FILES = 3


@router.post("/scan-document", response_model=RandomScanResult, tags=["Scan"])
async def scan_document(
    files:       list[UploadFile] = File(...),
    countryCode: CountryCode      = Form(...),
    _claims:     dict             = Depends(require_jwt),
) -> RandomScanResult:
    """
    Upload 1–3 documents (PDF / JPG / PNG / WEBP, max 10 MB each).

    - **files** *(required)*: 1–3 files — any document type
    - **countryCode** *(required)*: `PH` | `ID` | `KH`

    The AI extracts every readable field and returns them as camelCase key-value pairs
    with confidence scores. No fixed schema — works on any document.

    When multiple files are uploaded, results are merged (highest confidence per field wins).
    Response includes `extractionMethod: "text" | "vision"` so you know which path was used.
    """
    if not files:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="At least one file is required.")
    if len(files) > MAX_FILES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Maximum {MAX_FILES} files per request.")

    extractor = RandomExtractorService()

    async def extract_one(file: UploadFile) -> RandomScanResult:
        file_bytes   = await file.read()
        content_type = (file.content_type or "").lower()
        return await extractor.extract(
            file_bytes=file_bytes,
            content_type=content_type,
            country_code=countryCode.value,
        )

    try:
        results: list[RandomScanResult] = await asyncio.gather(
            *[extract_one(f) for f in files]
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    except httpx.TimeoutException:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Model took too long to respond. Please try again.")
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail=f"Model error ({exc.response.status_code}). Please try again.")
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail=f"Could not extract fields from document: {exc}")

    return merge_random_results(list(results))
