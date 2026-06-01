"""
PdfConverter — converts PDF pages to PNG bytes using pdf2image (poppler).

Windows local dev: poppler must be installed separately.
  1. Download: https://github.com/oschwartz10612/poppler-windows/releases
  2. Extract and add the `Library/bin` folder to your PATH.
  3. Restart your terminal.

Docker: poppler-utils is installed in the Dockerfile automatically.
"""
import io

from pdf2image import convert_from_bytes
from pdf2image.exceptions import PDFInfoNotInstalledError, PDFPageCountError


class PdfConverter:
    def convert(self, pdf_bytes: bytes, max_pages: int = 3) -> list[bytes]:
        """
        Converts the first `max_pages` pages of a PDF to PNG byte arrays.
        Returns a list of PNG bytes, one per page.

        Raises:
            RuntimeError  — poppler not installed or PDF is corrupt/unreadable
        """
        try:
            pil_images = convert_from_bytes(
                pdf_bytes,
                first_page=1,
                last_page=max_pages,
                fmt="png",
                dpi=200,          # high enough for text to be readable by LLaMA
            )
        except PDFInfoNotInstalledError:
            raise RuntimeError(
                "poppler is not installed or not in PATH. "
                "Download from https://github.com/oschwartz10612/poppler-windows/releases "
                "and add its Library/bin folder to PATH, then restart your terminal."
            )
        except PDFPageCountError as exc:
            raise RuntimeError(f"Could not read PDF — file may be corrupt: {exc}") from exc

        result: list[bytes] = []
        for img in pil_images:
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            result.append(buf.getvalue())

        return result
