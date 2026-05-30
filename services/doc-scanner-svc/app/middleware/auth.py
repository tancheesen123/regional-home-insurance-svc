"""
JWT validation middleware.
Validates the same bearer token issued by ApplicationService.
Algorithm and secret are read from config so swapping is a one-line env change.
"""
from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.config import settings

_bearer_scheme = HTTPBearer(auto_error=False)


async def require_jwt(request: Request) -> dict:
    """
    FastAPI dependency — attach to any route that needs auth.

    Usage:
        @router.post("/scan")
        async def scan(..., _claims: dict = Depends(require_jwt)):
            ...
    """
    credentials: HTTPAuthorizationCredentials | None = await _bearer_scheme(request)

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not settings.jwt_secret:
        # Dev convenience: if no secret is configured, skip validation
        # Never reaches production because .env sets JWT_SECRET
        if settings.app_env == "development":
            return {"sub": "dev-bypass"}
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT_SECRET is not configured.",
        )

    try:
        claims = jwt.decode(
            credentials.credentials,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
        return claims
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
