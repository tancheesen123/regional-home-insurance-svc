from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    # ── Inference backend — set USE_GROQ=true to use Groq, false for local Ollama
    use_groq: bool = False

    # ── Groq (cloud) ──────────────────────────────────────────────────────────
    groq_api_key: str = ""
    groq_model: str = "meta-llama/llama-4-scout-17b-16e-instruct"

    # ── Ollama (local) ────────────────────────────────────────────────────────
    ollama_base_url: str = "http://localhost:11434"
    model_name: str = "llama3.2-vision:11b"

    # ── File limits ───────────────────────────────────────────────────────────
    max_file_size_mb: int = 10
    max_pdf_pages: int = 3            # only first N pages scanned from a PDF

    # ── Auth ──────────────────────────────────────────────────────────────────
    # Must match JwtSettings in ApplicationService appsettings.json
    jwt_secret: str = ""
    jwt_algorithm: str = "HS256"
    jwt_audience: str = "ApplicationServiceClients"   # matches Audience in appsettings.json
    jwt_issuer: str = "ApplicationService"             # matches Issuer in appsettings.json

    # ── App ───────────────────────────────────────────────────────────────────
    app_env: str = "development"
    allowed_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    # ── Confidence ────────────────────────────────────────────────────────────
    low_confidence_threshold: float = 0.80   # below this → "please verify" yellow


settings = Settings()
