from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    # ── Ollama ────────────────────────────────────────────────────────────────
    ollama_base_url: str = "http://localhost:11434"
    model_name: str = "llama3.2-vision:11b"

    # ── File limits ───────────────────────────────────────────────────────────
    max_file_size_mb: int = 10
    max_pdf_pages: int = 3            # only first N pages scanned from a PDF

    # ── Auth ──────────────────────────────────────────────────────────────────
    # Must match the JWT secret used by ApplicationService
    jwt_secret: str = ""
    jwt_algorithm: str = "HS256"

    # ── App ───────────────────────────────────────────────────────────────────
    app_env: str = "development"
    allowed_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    # ── Confidence ────────────────────────────────────────────────────────────
    low_confidence_threshold: float = 0.80   # below this → "please verify" yellow


settings = Settings()
