"""
POST /scan-content
Upload 1–10 room photos — AI detects furniture/items, categorises them by room,
and estimates the replacement price in local currency.

Customer reviews the itemised list before the total is applied to the content sum insured.
"""
import asyncio

import httpx
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.middleware.auth import require_jwt
from app.models.content_scan_result import ContentScanResult
from app.models.document_type import CountryCode
from app.services.content_extractor import ContentExtractorService, build_content_result
from app.services.image_utils import ImageUtils

router     = APIRouter()
MAX_PHOTOS = 10
_utils     = ImageUtils()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}


@router.post("/scan-content", response_model=ContentScanResult, tags=["Scan"])
async def scan_content(
    files:       list[UploadFile] = File(...),
    countryCode: CountryCode      = Form(...),
    _claims:     dict             = Depends(require_jwt),
) -> ContentScanResult:
    """
    Upload 1–10 room photos (JPG / PNG / WEBP, max 10 MB each).

    - **files** *(required)*: 1–10 room photos
    - **countryCode** *(required)*: `PH` | `ID` | `KH`

    The AI will:
    1. Detect which room each photo shows (Living Room, Bedroom, Kitchen, etc.)
    2. Identify all significant items and their categories
    3. Estimate replacement price per item in local currency (PHP / IDR / USD)

    Results are grouped by room. If two photos show the same room, their items are merged.
    Items the AI could not identify clearly are flagged with `lowConfidence: true`.
    """
    if not files:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="At least one photo is required.")
    if len(files) > MAX_PHOTOS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Maximum {MAX_PHOTOS} photos per request.")

    # Validate all files are images (not PDFs — content scan is vision only)
    for f in files:
        ct = (f.content_type or "").lower().split(";")[0].strip()
        if ct not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{f.filename}': only JPG, PNG, WEBP images are supported for content scanning."
            )

    extractor = ContentExtractorService()

    async def scan_one(file: UploadFile, index: int):
        file_bytes = await file.read()
        try:
            _utils.validate(file_bytes, file.content_type or "", max_mb=10)
        except ValueError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"'{file.filename}': {exc}")
        return await extractor.extract_room(
            image_bytes=file_bytes,
            country_code=countryCode.value,
            photo_index=index,
        )

    try:
        rooms = await asyncio.gather(*[scan_one(f, i) for i, f in enumerate(files)])
    except httpx.TimeoutException:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Model took too long to respond. Please try again.")
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail=f"Model error ({exc.response.status_code}). Please try again.")
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail=f"Could not scan content: {exc}")

    return build_content_result(list(rooms), countryCode.value)
