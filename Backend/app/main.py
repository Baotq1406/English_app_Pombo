from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.vocabulary import router as vocabulary_router
from app.core.db import db


app = FastAPI(title="Pombo API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    await db.connect()


@app.on_event("shutdown")
async def on_shutdown() -> None:
    await db.close()

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(vocabulary_router, prefix="/vocabulary", tags=["vocabulary"])


@app.get("/health")
async def health() -> dict:
    return {"ok": True}


@app.get("/health/db")
async def health_db() -> dict:
    try:
        if db._pool is None:
            await db.connect()
        async with db._pool.acquire() as conn:
            await conn.fetchval("select 1")
        return {"ok": True}
    except Exception:
        return {"ok": False}
