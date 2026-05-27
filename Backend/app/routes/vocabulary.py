from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.db import db
from app.dependencies import get_current_user
from app.schemas.vocabulary import (
    SubmitAnswerRequest,
    SubmitAnswerResponse,
    SyncRequest,
    ToggleResponse,
    UpdateLevelRequest,
    UserVocabularyResponse,
    VocabularyResponse,
)

router = APIRouter()


def _vocab_to_dict(r: dict) -> dict:
    return {k: str(v) if isinstance(v, UUID) else v for k, v in r.items()}


@router.get("/search", response_model=list[VocabularyResponse])
async def search_vocabulary(
    q: str = Query(min_length=1),
    limit: int = Query(default=50, ge=1, le=200),
):
    results = await db.search_vocabulary(q, limit)
    return [VocabularyResponse(**_vocab_to_dict(r)) for r in results]


@router.get("", response_model=list[VocabularyResponse])
async def list_vocabulary(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
):
    """Get paginated list of all vocabulary for search/lazy load"""
    results = await db.get_all_vocabulary(limit, offset)
    return [VocabularyResponse(**_vocab_to_dict(r)) for r in results]


@router.get("/distractors", response_model=list[VocabularyResponse])
async def get_distractors(
    exclude_ids: str = Query(default=""),
    limit: int = Query(default=100, ge=1, le=500),
):
    """Get random vocabulary for quiz distractors"""
    exclude_list = [id.strip() for id in exclude_ids.split(',') if id.strip()]
    results = await db.get_vocabulary_distractors(exclude_list, limit)
    return [VocabularyResponse(**_vocab_to_dict(r)) for r in results]


@router.post("/sync", response_model=UserVocabularyResponse)
async def sync_vocabulary(
    payload: SyncRequest,
    user=Depends(get_current_user),
):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    word = await db.get_vocabulary_by_id(payload.vocabulary_id)
    if not word:
        raise HTTPException(status_code=404, detail="Vocabulary not found")

    result = await db.add_user_vocabulary(str(user_id), payload.vocabulary_id)
    
    # Handle different error cases
    if isinstance(result, tuple) and result[0] is None:
        error_reason = result[1]
        if error_reason == "daily_limit":
            raise HTTPException(status_code=429, detail="Bạn đã thêm tối đa 10 từ hôm nay rồi. Hãy quay lại ngày mai!")
        elif error_reason == "already_exists":
            raise HTTPException(status_code=409, detail="Từ này đã có trong sổ tay của bạn")
        else:
            raise HTTPException(status_code=400, detail="Không thể thêm từ này")

    data = _vocab_to_dict(word)
    data.update({
        "vocab_level": word.get("level"),
        "is_reviewing": result.get("is_reviewing"),
        "review_level": result.get("review_level"),
        "next_review_at": result.get("next_review_at"),
        "last_reviewed_at": result.get("last_reviewed_at"),
        "review_count": result.get("review_count"),
        "added_at": result.get("created_at"),
    })
    return UserVocabularyResponse(**data)


@router.get("/mine", response_model=list[UserVocabularyResponse])
async def get_my_vocabulary(
    is_reviewing: bool | None = None,
    review_level: int | None = Query(default=None, ge=1, le=5),
    search: str | None = None,
    user=Depends(get_current_user),
):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    results = await db.get_user_vocabulary(
        str(user_id),
        is_reviewing=is_reviewing,
        review_level=review_level,
        search=search,
    )
    return [UserVocabularyResponse(**_vocab_to_dict(r)) for r in results]


@router.patch("/mine/{vocabulary_id}/toggle", response_model=ToggleResponse)
async def toggle_review_status(
    vocabulary_id: str,
    user=Depends(get_current_user),
):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    result = await db.toggle_user_vocabulary(str(user_id), vocabulary_id)
    if not result:
        raise HTTPException(status_code=404, detail="Vocabulary not found in your notebook")
    return ToggleResponse(is_reviewing=result["is_reviewing"])


@router.patch("/mine/{vocabulary_id}/level", response_model=UserVocabularyResponse)
async def update_review_level(
    vocabulary_id: str,
    payload: UpdateLevelRequest,
    user=Depends(get_current_user),
):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    result = await db.update_review_level(
        str(user_id), vocabulary_id, payload.level
    )
    if not result:
        raise HTTPException(status_code=404, detail="Vocabulary not found in your notebook")

    word = await db.get_vocabulary_by_id(vocabulary_id)
    data = _vocab_to_dict(word) if word else {"word": "unknown"}
    data.update({
        "vocab_level": word.get("level") if word else None,
        "is_reviewing": result.get("is_reviewing"),
        "review_level": result.get("review_level"),
        "next_review_at": result.get("next_review_at"),
        "last_reviewed_at": result.get("last_reviewed_at"),
        "review_count": result.get("review_count"),
    })
    return UserVocabularyResponse(**data)


@router.get("/review", response_model=list[UserVocabularyResponse])
async def get_review_words(
    limit: int = Query(default=20, ge=1, le=100),
    user=Depends(get_current_user),
):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    results = await db.get_words_for_review(str(user_id), limit)
    return [UserVocabularyResponse(**_vocab_to_dict(r)) for r in results]


@router.post("/review/{vocabulary_id}/answer", response_model=SubmitAnswerResponse)
async def submit_answer(
    vocabulary_id: str,
    payload: SubmitAnswerRequest,
    user=Depends(get_current_user),
):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    result = await db.submit_review_answer(
        str(user_id), vocabulary_id, payload.correct
    )
    if not result:
        raise HTTPException(
            status_code=404,
            detail="Word not found in your review list",
        )
    data = _vocab_to_dict(result)
    return SubmitAnswerResponse(
        review_level=data["review_level"],
        next_review_at=data["next_review_at"],
        review_count=data["review_count"],
    )


@router.delete("/mine/{vocabulary_id}")
async def remove_from_notebook(
    vocabulary_id: str,
    user=Depends(get_current_user),
):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    deleted = await db.delete_user_vocabulary(str(user_id), vocabulary_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Vocabulary not found in your notebook")
    return {"ok": True}
