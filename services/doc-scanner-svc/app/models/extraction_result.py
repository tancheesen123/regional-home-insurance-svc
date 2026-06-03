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


