"""
GET /supported-doc-types
Frontend uses this to know which upload options to show per country.
"""
from fastapi import APIRouter

router = APIRouter()

SUPPORTED: dict[str, list[str]] = {
    "PH": ["IC", "PROPERTY_TITLE", "POLICY", "UTILITY_BILL"],
    "ID": ["IC", "PROPERTY_TITLE", "POLICY", "UTILITY_BILL"],
    "KH": ["IC", "PROPERTY_TITLE", "POLICY", "UTILITY_BILL"],
}


@router.get("/supported-doc-types", tags=["Meta"])
async def supported_doc_types() -> dict[str, list[str]]:
    return SUPPORTED
