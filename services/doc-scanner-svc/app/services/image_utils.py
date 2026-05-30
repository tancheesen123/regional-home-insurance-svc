"""
ImageUtils — validates and pre-processes image files before inference.
Implemented in Step 3.
"""

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "application/pdf"}


class ImageUtils:
    def validate(self, file_bytes: bytes, content_type: str, max_mb: int = 10) -> None:
        """
        Raises ValueError if file type or size is not allowed.
        Implemented in Step 3.
        """
        raise NotImplementedError("ImageUtils implemented in Step 3.")

    def resize_for_inference(self, image_bytes: bytes, max_px: int = 1280) -> bytes:
        """
        Resizes the longest edge to max_px to keep inference time predictable.
        Implemented in Step 3.
        """
        raise NotImplementedError("ImageUtils implemented in Step 3.")
