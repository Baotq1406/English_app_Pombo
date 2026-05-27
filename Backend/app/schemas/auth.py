from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=6)
    confirm_password: str = Field(min_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str | None = None


class ProfileResponse(BaseModel):
    id: str
    display_name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    goal: str | None = None
    level: str | None = None
    pom_coin: int | None = None
    gem: int | None = None
    words_learned: int | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}


class MeResponse(BaseModel):
    user_id: str
    profile: ProfileResponse


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user_id: str
    profile: ProfileResponse | None = None


class RefreshResponse(BaseModel):
    access_token: str
