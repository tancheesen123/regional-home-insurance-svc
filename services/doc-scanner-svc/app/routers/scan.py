"""
POST /scan
Receives an uploaded document + metadata, returns extracted field JSON.
Extraction logic (Ollama / LLaMA) is wired in Step 3.
"""
from fastapi import APIRouter, UploadFile, Form, Depends, HTTPException, status
from app.models.document_type import DocumentType, CountryCode
from app.models.extraction_result import ExtractionResult
from app.middleware.auth import require_jwt

router = APIRouter()


@router.post("/scan", response_model=ExtractionResult, tags=["Scan"])
async def scan(
    file:         UploadFile,
    documentType: DocumentType = Form(...),
    countryCode:  CountryCode  = Form(...),
    _claims:      dict         = Depends(require_jwt),
) -> ExtractionResult:
    """
    Upload a document (PDF / JPG / PNG / WEBP, max 10 MB).
    Returns extracted field values ready to auto-fill the purchase form.

    Implemented in Step 3 — returns 501 until then.
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Scan endpoint not yet implemented. Coming in Step 3.",
    )
