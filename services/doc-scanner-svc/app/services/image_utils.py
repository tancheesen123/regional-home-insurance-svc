"""
ImageUtils — validates uploaded files and resizes images before inference.
Keeps inference time predictable and rejects unsupported file types early.
"""
import io

from PIL import Image

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
}


class ImageUtils:
    def validate(self, file_bytes: bytes, content_type: str, max_mb: int = 10) -> None:
        """
        Raises ValueError if the file type is not allowed or the file exceeds max_mb.
        Call this before any processing.
        """
        clean_type = (content_type or "").split(";")[0].strip().lower()
        if clean_type not in ALLOWED_MIME_TYPES:
            raise ValueError(
                f"Unsupported file type '{clean_type}'. "
                "Allowed types: PDF, JPG, PNG, WEBP."
            )

        size_mb = len(file_bytes) / (1024 * 1024)
        if size_mb > max_mb:
            raise ValueError(
                f"File size {size_mb:.1f} MB exceeds the {max_mb} MB limit. "
                "Please upload a smaller file."
            )

    def resize_for_inference(self, image_bytes: bytes, max_px: int = 1280) -> bytes:
        """
        Resizes the image so its longest edge is at most max_px.
        Keeps aspect ratio. Converts to RGB PNG for consistent model input.
        Returns PNG bytes.
        """
        img = Image.open(io.BytesIO(image_bytes))

        # Normalise colour mode — LLaMA expects RGB
        if img.mode not in ("RGB",):
            img = img.convert("RGB")

        width, height = img.size
        if max(width, height) > max_px:
            ratio    = max_px / max(width, height)
            new_size = (int(width * ratio), int(height * ratio))
            img      = img.resize(new_size, Image.LANCZOS)

        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()
