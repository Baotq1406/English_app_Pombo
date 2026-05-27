# Pombo Backend

## Setup

1. Copy `.env.example` to `.env` and fill values (including `DATABASE_URL`).
2. Install deps with uv:

```bash
uv pip install -e .
```

3. Run the server:

```bash
uvicorn app.main:app --reload --port 8000
```

## Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
