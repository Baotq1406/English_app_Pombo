from datetime import datetime

from pydantic import BaseModel, Field


class VocabularyResponse(BaseModel):
    id: str
    word: str
    type: str | None = None
    phonetic: str | None = None
    meaning_vi: str | None = None
    definition_vi: str | None = None
    example_en: str | None = None
    example_vi: str | None = None
    level: int | None = None

    model_config = {"from_attributes": True}


class UserVocabularyResponse(BaseModel):
    id: str
    word: str
    type: str | None = None
    phonetic: str | None = None
    meaning_vi: str | None = None
    definition_vi: str | None = None
    example_en: str | None = None
    example_vi: str | None = None
    vocab_level: int | None = None
    is_reviewing: bool | None = None
    review_level: int | None = None
    next_review_at: datetime | None = None
    last_reviewed_at: datetime | None = None
    review_count: int | None = None
    added_at: datetime | None = None

    model_config = {"from_attributes": True}


class SyncRequest(BaseModel):
    vocabulary_id: str


class ToggleResponse(BaseModel):
    is_reviewing: bool


class UpdateLevelRequest(BaseModel):
    level: int = Field(ge=1, le=5)


class SubmitAnswerRequest(BaseModel):
    correct: bool


class SubmitAnswerResponse(BaseModel):
    review_level: int
    next_review_at: datetime
    review_count: int
