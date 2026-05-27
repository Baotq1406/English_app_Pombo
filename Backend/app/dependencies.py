from fastapi import Header, HTTPException
from app.core.jwt import verify_jwt


def get_current_user(authorization: str | None = Header(default=None)) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    if not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")
    token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")
    try:
        payload = verify_jwt(token)
        payload["raw_token"] = token
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
