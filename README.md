# Pombo - Ứng dụng học Tiếng Anh

English learning app with vocabulary management, spaced-repetition review, and AI-powered content generation.

## Project Structure

```
Pombo/
├── Frontend/          # Expo Router + React Native
│   ├── app/           # Expo Router file-based routes
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── constants/    # Theme, colors
│   │   ├── services/     # API client, auth
│   │   ├── store/        # Zustand stores
│   │   └── types/        # Shared TypeScript types
│   ├── app.json
│   └── package.json
├── Backend/           # FastAPI + Python
│   ├── app/
│   │   ├── core/         # DB, AI, JWT, config
│   │   ├── routes/       # auth.py, vocabulary.py
│   │   └── schemas/      # Pydantic models
│   ├── .env.example
│   └── README.md
└── README.md          ← you are here
```

---

## Backend Setup

### Requirements

- Python >= 3.11
- PostgreSQL (Supabase or local)
- `uv` package manager (recommended) or pip

### 1. Environment

```bash
cd Backend
cp .env.example .env
# Edit .env:
#   DATABASE_URL=postgresql://user:pass@host:5432/pombo
#   JWT_SECRET=<random-string>
#   OPENROUTER_API_KEY=sk-or-v1-...
```

### 2. Install & Run

```bash
cd Backend
uv pip install -e .
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

---

## Frontend Setup

### Requirements

- Node.js >= 18
- npm or yarn

### Install & Run

```bash
cd Frontend
npm install
npx expo start          # Dev server
npx expo start --web    # Web preview
npx expo start --android  # Android
npx expo start --ios    # iOS
```

---

## API Endpoints

All authenticated endpoints require `Authorization: Bearer <access_token>`.

### Auth (`/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Login |
| POST | `/auth/refresh` | No | Refresh access token |
| POST | `/auth/logout` | Yes | Logout |
| GET | `/auth/me` | Yes | Get profile |

### Vocabulary (`/vocabulary`)

#### Search & Browse

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/vocabulary/search?q=&limit=` | No | Search words |
| GET | `/vocabulary?offset=&limit=` | No | Paginated vocabulary list |
| GET | `/vocabulary/distractors?exclude_ids=&limit=` | No | Random words for quiz |

#### Notebook

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/vocabulary/sync` | Yes | Add word to notebook |
| GET | `/vocabulary/mine` | Yes | List user's words |
| PATCH | `/vocabulary/mine/{id}/toggle` | Yes | Toggle review flag |
| PATCH | `/vocabulary/mine/{id}/level` | Yes | Set review level |
| DELETE | `/vocabulary/mine/{id}` | Yes | Remove from notebook |

Daily sync limit: **10 words/day/user** (429 on exceed).

#### Review System

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/vocabulary/review?limit=10` | Yes | Get words for review |
| POST | `/vocabulary/review/{id}/answer` | Yes | Submit answer |

**Spaced Repetition Logic:**

- **New word:** `review_level = 5`, `correct_streak = 0`
- **Correct:** streak++. If streak == 3 OR 3 days elapsed → level-- (min 1), streak = 0
- **Wrong:** streak = 0, level = max(level - 1, 1)
- **Intervals:** `{1: 1d, 2: 3d, 3: 7d, 4: 14d, 5: 30d}`
- **No level decrease →** next review in 1 day

#### AI Features (OpenRouter)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/vocabulary/{id}/ai/examples` | Yes | 3 AI example sentences |
| GET | `/vocabulary/{id}/ai/distractors?count=3` | Yes | AI wrong definitions |
| POST | `/vocabulary/ai/distractors/batch` | Yes | Batch distractors |

Results cached 30 days in `ai_examples_cache` / `ai_distractors_cache`. Gracefully returns `[]` if OpenRouter is down.

---

## Quick Test

### With curl (PowerShell)

```powershell
# Login
$login = curl -Method POST -ContentType "application/json" `
  -Body '{"email":"test@test.com","password":"123456"}' `
  http://localhost:8000/auth/login | ConvertFrom-Json
$token = $login.access_token

# Sync a word
curl -Method POST -ContentType "application/json" `
  -Headers @{Authorization="Bearer $token"} `
  -Body '{"vocabulary_id":"000bc234-f75f-4487-8b6b-70390978539a"}' `
  http://localhost:8000/vocabulary/sync

# Review
curl -Method GET -Headers @{Authorization="Bearer $token"} `
  http://localhost:8000/vocabulary/review?limit=10

# Submit answer
curl -Method POST -ContentType "application/json" `
  -Headers @{Authorization="Bearer $token"} `
  -Body '{"correct":true}' `
  http://localhost:8000/vocabulary/review/{vocab_id}/answer

# AI distractors
curl -Method GET -Headers @{Authorization="Bearer $token"} `
  http://localhost:8000/vocabulary/{vocab_id}/ai/distractors?count=3
```

### Test accounts

- `test@test.com` / `123456` — has 10 pre-synced words

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| 422 on auth requests | Missing `Content-Type: application/json` header |
| Empty review results | No synced words — check `/vocabulary/mine` or sync via Search tab |
| AI returns `[]` | Check `OPENROUTER_API_KEY` in `Backend/.env` |
| 429 on sync | Daily limit (10 words) reached — wait until tomorrow |
| 401 on auth | Token expired — refresh or re-login |
