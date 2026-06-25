"""
PdfTextExtractor — extracts raw text from digital PDFs using pdfplumber.

Used as the first attempt for any PDF upload.
If the extracted text is long enough (≥ MIN_CHARS), the text path is used
and no vision AI call is needed — faster and more accurate for digital documents.
If the PDF appears to be a scanned image (no/little text), returns None so the
caller can fall back to the vision path.
"""
import io

import pdfplumber

MIN_CHARS = 50


class PdfTextExtractor:
    def extract(self, pdf_bytes: bytes, max_pages: int = 3) -> str | None:
        """
        Extracts and returns all readable text from the first `max_pages` pages.
        Returns None if the PDF has fewer than MIN_CHARS of readable text
        (indicating a scanned/image-based PDF).
        """
        try:
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                parts: list[str] = []
                for page in pdf.pages[:max_pages]:
                    text = page.extract_text()
                    if text:
                        parts.append(text.strip())

                full_text = "\n\n".join(parts).strip()
                return full_text if len(full_text) >= MIN_CHARS else None

        except Exception:
            return None
