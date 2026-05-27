# Pombo Backend

FastAPI backend for Pombo English learning app. Handles auth, vocabulary management, spaced-repetition review, and AI-powered example/distractor generation via OpenRouter.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | FastAPI (async) |
| Database | PostgreSQL via `asyncpg` |
| Auth | JWT (access + refresh tokens), Argon2 password hashing |
| AI | OpenRouter API (OpenAI-compatible), free model |

## Setup

### Requirements

- Python >= 3.11
- PostgreSQL (Supabase or local)
- `uv` package manager (recommended) or pip

### 1. Environment

```bash
cp .env.example .env
# Edit .env with your values:
#   DATABASE_URL=postgresql://...
#   JWT_SECRET=<random-string>
#   OPENROUTER_API_KEY=sk-or-v1-...
```

### 2. Install dependencies

```bash
uv pip install -e .
# or: pip install -e .
```

### 3. Run server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

---

## Architecture

```
Backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, router mounts
│   ├── dependencies.py      # get_current_user() JWT dependency
│   ├── core/
│   │   ├── config.py        # Pydantic settings (env vars)
│   │   ├── db.py            # Database methods (asyncpg pool)
│   │   ├── gemini.py        # AIService — OpenRouter chat/completions
│   │   ├── jwt.py           # JWT encode/decode helpers
│   │   ├── security.py      # Password hashing, refresh token utils
│   │   └── supabase.py      # Supabase client init
│   ├── routes/
│   │   ├── auth.py          # register, login, refresh, logout, me
│   │   └── vocabulary.py    # search, sync, mine, review, AI endpoints
│   └── schemas/
│       ├── auth.py          # Pydantic request/response models
│       └── vocabulary.py    # Pydantic request/response models
├── .env.example
├── pyproject.toml
└── README.md
```

---

## API Endpoints

All authenticated endpoints require `Authorization: Bearer <access_token>` header.

### Auth (`/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Login, returns access + refresh tokens |
| POST | `/auth/refresh` | No | Exchange refresh token for new access token |
| POST | `/auth/logout` | Yes | Invalidate refresh token |
| GET | `/auth/me` | Yes | Get current user profile |

### Vocabulary (`/vocabulary`)

#### Search & Browse

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/vocabulary/search?q=&limit=` | No | Search vocabulary by word |
| GET | `/vocabulary?offset=&limit=` | No | Paginated list of all vocabulary (2000 words, 50/page) |
| GET | `/vocabulary/distractors?exclude_ids=&limit=` | No | Random vocabulary pool for quiz fallback |

#### Notebook (User's Personal Vocabulary)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/vocabulary/sync` | Yes | Add word to notebook (`body: { vocabulary_id: "uuid" }`) |
| GET | `/vocabulary/mine?is_reviewing=&review_level=&search=` | Yes | List user's notebook words |
| PATCH | `/vocabulary/mine/{id}/toggle` | Yes | Toggle `is_reviewing` flag |
| PATCH | `/vocabulary/mine/{id}/level` | Yes | Manually set `review_level` |
| DELETE | `/vocabulary/mine/{id}` | Yes | Remove word from notebook |

**Daily sync limit:** max 10 words/day/user (returns 429).

#### Review System (Spaced Repetition)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/vocabulary/review?limit=10` | Yes | Get words ready for review (random order) |
| POST | `/vocabulary/review/{id}/answer` | Yes | Submit answer (`body: { correct: true/false }`) |

**Review logic (`db.py:submit_review_answer`):**

- **New word** → `review_level = 5`, `correct_streak = 0`
- **Correct answer:**
  - `streak += 1`
  - If `streak == 3` OR 3 days elapsed since word was created → **level decreases by 1** (min 1), streak resets to 0
  - If level decreased → `next_review_at = now + interval(new_level)`: `{1: 1d, 2: 3d, 3: 7d, 4: 14d, 5: 30d}`
  - If level NOT decreased → `next_review_at = now + 1 day`
- **Wrong answer:**
  - `streak = 0`, `level = max(level - 1, 1)`
  - `next_review_at = now + 1 day`

#### AI-Powered Features

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/vocabulary/{id}/ai/examples` | Yes | 3 AI-generated example sentences |
| GET | `/vocabulary/{id}/ai/distractors?count=3` | Yes | AI-generated wrong definitions |
| POST | `/vocabulary/ai/distractors/batch` | Yes | Batch distractors (`body: { vocabulary_ids: [...], count: 3 }`) |

**Cache:** AI results are cached in `ai_examples_cache` / `ai_distractors_cache` tables with 30-day TTL. Cached results return instantly without calling OpenRouter.

**Graceful degradation:** If OpenRouter is unreachable (quota, overload, no API key), endpoints return `[]` instead of crashing.

---

## Database Tables

### `vocabulary` (2000 rows, seeded)
Word bank: `id`, `word`, `type`, `phonetic`, `meaning_vi`, `definition_vi`, `example_en`, `example_vi`, `level`, `created_at`

### `user_vocabulary`
User's notebook: `user_id`, `vocabulary_id`, `is_reviewing` (default true), `review_level` (1-5), `correct_streak`, `next_review_at`, `last_reviewed_at`, `review_count`, `created_at`

### `users` / `profiles`
User accounts and profile info.

### `ai_examples_cache` / `ai_distractors_cache`
AI cache tables with `vocabulary_id` (unique), `examples`/`distractors` (TEXT, JSON-encoded list), `created_at`, `expires_at` (30 days).

---

## AI Service Details

Uses OpenRouter's OpenAI-compatible `/chat/completions` endpoint.

**Prompt strategy** (`Backend/app/core/gemini.py`):

```text
Generate {count} plausible but INCORRECT Vietnamese meanings for "{word}".
Correct meaning: {meaning_vi}
Requirements:
- Plausible, not obviously wrong
- Related concepts but WRONG
- No duplicate of correct meaning
Format: JSON array of strings
```

Model: `nvidia/nemotron-3-super-120b-a12b:free` (free tier, no credit card).

To switch model, change `OPENROUTER_MODEL` in `.env` (e.g., `openai/gpt-4o`, `anthropic/claude-3.5-sonnet`).

---

## Testing

### Quick test with curl (Windows PowerShell)

```powershell
# Register
$reg = curl -Method POST -ContentType "application/json" -Body '{"name":"test","email":"test@test.com","password":"123456","confirm_password":"123456"}' http://localhost:8000/auth/register | ConvertFrom-Json

# Login
$login = curl -Method POST -ContentType "application/json" -Body '{"email":"test@test.com","password":"123456"}' http://localhost:8000/auth/login | ConvertFrom-Json
$token = $login.access_token

# Add a word to notebook
curl -Method POST -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body '{"vocabulary_id":"000bc234-f75f-4487-8b6b-70390978539a"}' http://localhost:8000/vocabulary/sync

# Get review words
curl -Method GET -Headers @{Authorization="Bearer $token"} http://localhost:8000/vocabulary/review?limit=10

# Submit answer
curl -Method POST -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body '{"correct":true}' http://localhost:8000/vocabulary/review/000bc234-f75f-4487-8b6b-70390978539a/answer

# Get AI distractors
curl -Method GET -Headers @{Authorization="Bearer $token"} http://localhost:8000/vocabulary/000bc234-f75f-4487-8b6b-70390978539a/ai/distractors?count=3
```

### Common test accounts

- `test@test.com` / `123456` — has 10 pre-synced words
- `nhailtvop@gmail.com` — real user, no synced words yet

### Troubleshooting

- **422 Unprocessable Entity** on authenticated endpoints → missing `Content-Type: application/json` header in request
- **Empty review** → user hasn't synced words yet (check `/vocabulary/mine`)
- **AI returns `[]`** → check `OPENROUTER_API_KEY` in `.env`, verify key at https://openrouter.ai/keys
- **Cache not working** → `ai_examples_cache` / `ai_distractors_cache` tables need `vocabulary_id` (UUID) + TEXT columns with `json.dumps` values
- **Login 401** → wrong email/password or JWT secret changed
