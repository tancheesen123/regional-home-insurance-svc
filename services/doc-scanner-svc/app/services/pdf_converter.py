"""
PdfConverter — converts PDF pages to PNG images before sending to the vision model.
Uses pdf2image (wraps poppler). Implemented in Step 3.
"""


class PdfConverter:
    def convert(self, pdf_bytes: bytes, max_pages: int = 3) -> list[bytes]:
        """
        Returns a list of PNG byte arrays, one per page (up to max_pages).
        Implemented in Step 3.
        """
        raise NotImplementedError("PdfConverter implemented in Step 3.")
