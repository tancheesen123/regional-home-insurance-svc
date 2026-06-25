from pydantic import BaseModel, Field


class ContentItem(BaseModel):
    """A single identified item within a room."""
    name:           str
    category:       str
    estimatedPrice: float   = Field(ge=0)
    confidence:     float   = Field(ge=0.0, le=1.0)
    lowConfidence:  bool    = False
    note:           str | None = None


class RoomResult(BaseModel):
    """All items detected in one photo / room."""
    roomType:   str
    photoIndex: int
    items:      list[ContentItem]
    subtotal:   float = Field(ge=0)


class ContentScanResult(BaseModel):
    """Full response returned by POST /scan-content."""
    countryCode:   str
    currency:      str
    rooms:         list[RoomResult]
    totalEstimate: float = Field(ge=0)
    totalItems:    int   = Field(ge=0)
    warnings:      list[str] = []
