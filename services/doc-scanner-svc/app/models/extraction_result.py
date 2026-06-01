from pydantic import BaseModel, Field


class FieldResult(BaseModel):
    """Result for a single extracted field."""
    value:      str | None
    confidence: float = Field(ge=0.0, le=1.0)
    filled:     bool


class SourceResult(BaseModel):
    """Summary of one scanned document contributing to a merged result."""
    documentType:  str
    autoDetected:  bool
    confidence:    float = Field(ge=0.0, le=1.0)
    fieldsFound:   int


class ExtractionResult(BaseModel):
    """Full response returned by POST /scan."""
    documentType:         str
    detectedDocumentType: str
    autoDetected:         bool
    extractionMethod:     str = "vision"   # "text" | "vision"
    countryCode:          str
    confidence:           float = Field(ge=0.0, le=1.0)
    fields:               dict[str, FieldResult]
    warnings:             list[str] = []
    # Populated when multiple files are scanned — one entry per file
    sources:              list[SourceResult] = []
