from pydantic import BaseModel, Field

from app.models.extraction_result import FieldResult, SourceResult


class RandomScanResult(BaseModel):
    """Response returned by POST /scan-document."""
    countryCode:      str
    extractionMethod: str         = "vision"
    confidence:       float       = Field(ge=0.0, le=1.0)
    fields:           dict[str, FieldResult]
    warnings:         list[str]   = []
    sources:          list[SourceResult] = []
