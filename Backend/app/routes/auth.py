from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta, timezone

from app.core.db import db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    hash_refresh_token,
    verify_password,
)
from app.dependencies import get_current_user
from app.core.config import settings
from app.schemas.auth import AuthResponse, LoginRequest, LogoutRequest, MeResponse, ProfileResponse, RefreshRequest, RefreshResponse, RegisterRequest


router = APIRouter()


@router.post("/register", response_model=AuthResponse)
async def register(payload: RegisterRequest) -> AuthResponse:
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = await db.get_user_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = await db.create_user(payload.email, hash_password(payload.password))
    user_id = user.get("id")
    if not user_id:
        raise HTTPException(status_code=500, detail="Failed to create user")

    profile_payload = {
        "id": user_id,
        "display_name": payload.name,
        "phone": None,
        "avatar_url": None,
        "goal": None,
        "level": None,
        "pom_coin": 0,
        "gem": 0,
        "words_learned": 0,
    }

    profile = None
    try:
        profile = await db.insert_profile(profile_payload)
    except Exception:
        profile = None

    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token()
    refresh_hash = hash_refresh_token(refresh_token)
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    await db.store_refresh_token(user_id, refresh_hash, expires_at)

    if profile and "id" in profile:
        profile["id"] = str(profile["id"])
    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=str(user_id),
        profile=ProfileResponse.model_validate(profile) if profile else None,
    )


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest) -> AuthResponse:
    user = await db.get_user_by_email(payload.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(payload.password, user.get("password_hash")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_id = user.get("id")
    profile = await db.get_profile(user_id)

    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token()
    refresh_hash = hash_refresh_token(refresh_token)
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    await db.store_refresh_token(user_id, refresh_hash, expires_at)

    if profile and "id" in profile:
        profile["id"] = str(profile["id"])
    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=str(user_id),
        profile=ProfileResponse.model_validate(profile) if profile else None,
    )


@router.post("/refresh", response_model=RefreshResponse)
async def refresh(payload: RefreshRequest) -> RefreshResponse:
    refresh_hash = hash_refresh_token(payload.refresh_token)
    session = await db.find_refresh_session(refresh_hash)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    if session.get("expires_at") and session["expires_at"].astimezone(timezone.utc) < datetime.now(timezone.utc):
        await db.delete_refresh_session(session["id"])
        raise HTTPException(status_code=401, detail="Refresh token expired")

    user_id = session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid refresh session")

    access_token = create_access_token(user_id)
    return RefreshResponse(access_token=access_token)


@router.post("/logout")
async def logout(payload: LogoutRequest, user=Depends(get_current_user)) -> dict:
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    if payload.refresh_token:
        refresh_hash = hash_refresh_token(payload.refresh_token)
        session = await db.find_refresh_session(refresh_hash)
        if session:
            await db.delete_refresh_session(session["id"])
    else:
        await db.delete_refresh_sessions_for_user(str(user_id))

    return {"ok": True}


@router.get("/me", response_model=MeResponse)
async def me(user=Depends(get_current_user)):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    profile = await db.get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if profile and "id" in profile:
        profile["id"] = str(profile["id"])
    return MeResponse(user_id=str(user_id), profile=ProfileResponse.model_validate(profile))
