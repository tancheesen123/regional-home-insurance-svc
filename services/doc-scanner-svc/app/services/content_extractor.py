"""
ContentExtractorService — detects furniture/items from room photos and estimates prices.

Each photo is processed independently (concurrent).
Results are then grouped by room type and merged into a single ContentScanResult.
"""
import json
import re
from pathlib import Path

import httpx

from app.config import settings
from app.models.content_scan_result import ContentItem, ContentScanResult, RoomResult
from app.services.groq_client import GroqClient
from app.services.image_utils import ImageUtils
from app.services.ollama_client import OllamaClient

_PROMPTS_DIR = Path(__file__).parent.parent / "prompts"

# Low-confidence threshold — items below this get flagged
_LOW_CONF = 0.70

# Currency config per region
_CURRENCY: dict[str, dict] = {
    "PH": {
        "code":         "PHP",
        "note":         "Philippine Peso — 1 USD ≈ ₱56",
        "minValue":     "₱200",
    },
    "ID": {
        "code":         "IDR",
        "note":         "Indonesian Rupiah — 1 USD ≈ Rp 16,000",
        "minValue":     "Rp 50,000",
    },
    "KH": {
        "code":         "USD",
        "note":         "US Dollar",
        "minValue":     "$5",
    },
}
_DEFAULT_CURRENCY = {"code": "USD", "note": "US Dollar", "minValue": "$5"}


class ContentExtractorService:
    def __init__(self) -> None:
        self._client      = GroqClient() if settings.use_groq else OllamaClient()
        self._image_utils = ImageUtils()

    # ── Public ────────────────────────────────────────────────────────────────

    async def extract_room(
        self,
        image_bytes:  bytes,
        country_code: str,
        photo_index:  int,
    ) -> RoomResult:
        """
        Scan a single room photo.
        Returns a RoomResult with detected room type, items, and subtotal.
        """
        image_bytes = self._image_utils.resize_for_inference(image_bytes, max_px=1024)
        prompt      = self._build_prompt(country_code)

        try:
            raw = await self._client.chat_with_image(prompt, image_bytes)
        except (httpx.TimeoutException, httpx.HTTPStatusError):
            raise

        return self._parse_room(raw, photo_index)

    # ── Prompt ────────────────────────────────────────────────────────────────

    def _build_prompt(self, country_code: str) -> str:
        cfg = _CURRENCY.get(country_code.upper(), _DEFAULT_CURRENCY)
        template = (_PROMPTS_DIR / "content_scan.txt").read_text(encoding="utf-8")
        return (
            template
            .replace("{countryCode}",  country_code.upper())
            .replace("{currency}",     cfg["code"])
            .replace("{currencyNote}", cfg["note"])
            .replace("{minValue}",     cfg["minValue"])
        )

    # ── Parsing ───────────────────────────────────────────────────────────────

    def _parse_room(self, raw: str, photo_index: int) -> RoomResult:
        json_str = _strip_to_json(raw)

        try:
            data = json.loads(json_str)
        except (json.JSONDecodeError, ValueError):
            return RoomResult(
                roomType="Unknown",
                photoIndex=photo_index,
                items=[],
                subtotal=0.0,
            )

        if isinstance(data, list):
            data = data[0] if data and isinstance(data[0], dict) else {}

        room_type    = str(data.get("roomType", "Unknown")).strip()
        raw_items    = data.get("items", [])
        if not isinstance(raw_items, list):
            raw_items = []

        items: list[ContentItem] = []
        for entry in raw_items:
            if not isinstance(entry, dict):
                continue

            name  = str(entry.get("name", "")).strip()
            cat   = str(entry.get("category", "")).strip()
            price = _to_float(entry.get("estimatedPrice", 0))
            conf  = _clamp(float(entry.get("confidence", 0.85)))

            if not name or price <= 0:
                continue

            low_conf = conf < _LOW_CONF
            note     = "Partially visible or unclear — please verify." if low_conf else None

            items.append(ContentItem(
                name=name,
                category=cat,
                estimatedPrice=round(price, 2),
                confidence=round(conf, 2),
                lowConfidence=low_conf,
                note=note,
            ))

        subtotal = round(sum(i.estimatedPrice for i in items), 2)

        return RoomResult(
            roomType=room_type,
            photoIndex=photo_index,
            items=items,
            subtotal=subtotal,
        )


# ── Merge helper ──────────────────────────────────────────────────────────────

def build_content_result(
    rooms:        list[RoomResult],
    country_code: str,
) -> ContentScanResult:
    """
    Combines per-photo RoomResults into a final ContentScanResult.
    If two photos are identified as the same room type, their items are merged.
    """
    cfg      = _CURRENCY.get(country_code.upper(), _DEFAULT_CURRENCY)
    warnings: list[str] = []

    # Merge rooms with the same roomType
    merged: dict[str, RoomResult] = {}
    for room in rooms:
        key = room.roomType.lower()
        if key in merged:
            existing = merged[key]
            merged[key] = RoomResult(
                roomType=existing.roomType,
                photoIndex=existing.photoIndex,
                items=existing.items + room.items,
                subtotal=round(existing.subtotal + room.subtotal, 2),
            )
        else:
            merged[key] = room

    final_rooms  = list(merged.values())
    total        = round(sum(r.subtotal for r in final_rooms), 2)
    total_items  = sum(len(r.items) for r in final_rooms)

    low_conf_count = sum(
        1 for r in final_rooms for i in r.items if i.lowConfidence
    )
    if low_conf_count > 0:
        warnings.append(
            f"{low_conf_count} item(s) could not be identified clearly — "
            "please review and verify the highlighted items."
        )

    unknown_count = sum(1 for r in final_rooms if r.roomType.lower() == "unknown")
    if unknown_count > 0:
        warnings.append(
            f"{unknown_count} room(s) could not be identified — "
            "please select the correct room type."
        )

    if total_items == 0:
        warnings.append(
            "No significant items were detected. "
            "Try uploading a clearer photo with better lighting."
        )

    return ContentScanResult(
        countryCode=country_code.upper(),
        currency=cfg["code"],
        rooms=final_rooms,
        totalEstimate=total,
        totalItems=total_items,
        warnings=warnings,
    )


# ── Utilities ─────────────────────────────────────────────────────────────────

def _to_float(val) -> float:
    try:
        return float(str(val).replace(",", "").replace(" ", ""))
    except (ValueError, TypeError):
        return 0.0


def _clamp(val: float) -> float:
    return max(0.0, min(1.0, val))


def _strip_to_json(text: str) -> str:
    text = re.sub(r"```(?:json)?\s*", "", text)
    text = re.sub(r"```", "", text).strip()
    obj_start = text.find("{")
    obj_end   = text.rfind("}")
    arr_start = text.find("[")
    arr_end   = text.rfind("]")
    has_obj   = obj_start != -1 and obj_end > obj_start
    has_arr   = arr_start != -1 and arr_end > arr_start
    if has_obj and has_arr:
        return text[obj_start:obj_end + 1] if obj_start < arr_start else text[arr_start:arr_end + 1]
    if has_obj:
        return text[obj_start:obj_end + 1]
    if has_arr:
        return text[arr_start:arr_end + 1]
    return text
