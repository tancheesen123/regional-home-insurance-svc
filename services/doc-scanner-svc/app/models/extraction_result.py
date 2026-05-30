from pydantic import BaseModel, Field


class FieldResult(BaseModel):
    """Result for a single extracted field."""
    value:      str | None
    confidence: float = Field(ge=0.0, le=1.0)
    filled:     bool


class ExtractionResult(BaseModel):
    """Full response returned by POST /scan."""
    documentType: str
    countryCode:  str
    confidence:   float = Field(ge=0.0, le=1.0, description="Overall document confidence")
    fields:       dict[str, FieldResult]
    warnings:     list[str] = []
