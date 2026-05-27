# Pombo - Học Tiếng Anh

App học từ vựng có ôn tập theo lịch, sinh câu hỏi AI.

## Cài đặt Backend

### Yêu cầu
- Python >= 3.11
- PostgreSQL (Supabase)
- `uv` (hoặc pip)

### 1. Tạo file .env

```bash
cd Backend
cp .env.example .env
```

Sửa file `.env`:
- `DATABASE_URL` — link kết nối PostgreSQL
- `JWT_SECRET` — chuỗi bí mật để ký token
- `OPENROUTER_API_KEY` — key từ https://openrouter.ai/keys (miễn phí, không cần credit card)

### 2. Cài thư viện & chạy

```bash
cd Backend
uv pip install -e .
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Mở http://localhost:8000/docs để xem thử API.

---

## Backend có những gì?

### 1. Đăng ký / Đăng nhập (`/auth`)

| Việc | Gửi lên |
|------|---------|
| Đăng ký | `POST /auth/register` với `{name, email, password, confirm_password}` |
| Đăng nhập | `POST /auth/login` với `{email, password}` → trả về `access_token` + `refresh_token` |
| Làm mới token | `POST /auth/refresh` với `{refresh_token}` |
| Đăng xuất | `POST /auth/logout` với `{refresh_token}` (cần Bearer token) |
| Xem profile | `GET /auth/me` (cần Bearer token) |

Sau khi login, lấy `access_token` gửi kèm header `Authorization: Bearer <token>` cho các API cần auth.

### 2. Tra cứu từ vựng

| Việc | Gửi lên |
|------|---------|
| Tìm từ | `GET /vocabulary/search?q=hello&limit=50` |
| Xem danh sách | `GET /vocabulary?offset=0&limit=50` (2000 từ, load dần) |
| Lấy từ random | `GET /vocabulary/distractors?exclude_ids=id1,id2&limit=10` (làm đáp án nhiễu) |

3 API này **không cần** đăng nhập.

### 3. Sổ tay từ vựng (Notebook) — cần đăng nhập

| Việc | Gửi lên |
|------|---------|
| Thêm từ vào sổ tay | `POST /vocabulary/sync` với `{vocabulary_id: "uuid"}` |
| Xem từ đã lưu | `GET /vocabulary/mine` |
| Bật/tắt ôn tập | `PATCH /vocabulary/mine/{id}/toggle` |
| Đặt level | `PATCH /vocabulary/mine/{id}/level` với `{level: 1-5}` |
| Xoá khỏi sổ tay | `DELETE /vocabulary/mine/{id}` |

**Giới hạn:** Chỉ thêm được tối đa **10 từ/ngày**. Quá 10 sẽ báo lỗi 429.

### 4. Ôn tập (Spaced Repetition) — cần đăng nhập

| Việc | Gửi lên |
|------|---------|
| Lấy từ cần ôn | `GET /vocabulary/review?limit=10` |
| Gửi kết quả | `POST /vocabulary/review/{id}/answer` với `{correct: true/false}` |

**Cách hoạt động:**
- Từ mới thêm vào → `review_level = 5`
- **Trả lời đúng:** streak +1. Nếu streak = 3 hoặc đã 3 ngày → level giảm 1 (tối thiểu 1), streak về 0
- **Trả lời sai:** streak = 0, level = max(level - 1, 1)
- **Khoảng cách ôn tập:**
  - Level 1: 1 ngày sau
  - Level 2: 3 ngày
  - Level 3: 7 ngày
  - Level 4: 14 ngày
  - Level 5: 30 ngày
- Nếu level chưa giảm (streak < 3 và chưa đủ 3 ngày) → hẹn ôn lại vào **ngày hôm sau**

### 5. AI sinh câu hỏi (OpenRouter) — cần đăng nhập

Dùng AI để sinh nội dung cho từ vựng.

| Việc | Gửi lên |
|------|---------|
| Sinh 3 câu ví dụ | `GET /vocabulary/{id}/ai/examples` |
| Sinh đáp án nhiễu | `GET /vocabulary/{id}/ai/distractors?count=3` |
| Sinh nhiễu hàng loạt | `POST /vocabulary/ai/distractors/batch` với `{vocabulary_ids: [...], count: 3}` |

**AI xài model gì?** `nvidia/nemotron-3-super-120b-a12b:free` — free, không cần credit card.

**Có cache không?** Có. Kết quả AI được lưu 30 ngày trong bảng `ai_examples_cache` và `ai_distractors_cache`. Lần sau xài lại không cần gọi AI nữa.

**Lỡ hết quota / lỗi?** API trả về `[]` thay vì crash.

---

## Test nhanh bằng curl (PowerShell)

```powershell
# 1. Đăng nhập
$r = curl -Method POST -ContentType "application/json" `
  -Body '{"email":"test@test.com","password":"123456"}' `
  http://localhost:8000/auth/login | ConvertFrom-Json
$token = $r.access_token

# 2. Thêm từ vào sổ tay
curl -Method POST -ContentType "application/json" `
  -Headers @{Authorization="Bearer $token"} `
  -Body '{"vocabulary_id":"000bc234-f75f-4487-8b6b-70390978539a"}' `
  http://localhost:8000/vocabulary/sync

# 3. Xem từ đã lưu
curl -Method GET -Headers @{Authorization="Bearer $token"} `
  http://localhost:8000/vocabulary/mine

# 4. Lấy từ để ôn tập
curl -Method GET -Headers @{Authorization="Bearer $token"} `
  http://localhost:8000/vocabulary/review?limit=10

# 5. Gửi kết quả ôn tập (trả lời đúng)
curl -Method POST -ContentType "application/json" `
  -Headers @{Authorization="Bearer $token"} `
  -Body '{"correct":true}' `
  http://localhost:8000/vocabulary/review/{vocab_id}/answer

# 6. AI sinh đáp án nhiễu
curl -Method GET -Headers @{Authorization="Bearer $token"} `
  http://localhost:8000/vocabulary/{vocab_id}/ai/distractors?count=3
```

### Tài khoản test có sẵn

- `test@test.com` / `123456` — có 10 từ trong sổ tay

---

## Lỗi thường gặp

| Lỗi | Nguyên nhân |
|-----|-------------|
| 422 khi gọi API | Thiếu header `Content-Type: application/json` |
| Ôn tập không có từ | User chưa thêm từ nào vào sổ tay (gọi `/vocabulary/mine` để kiểm tra) |
| AI trả về rỗng | Sai `OPENROUTER_API_KEY` trong `.env` hoặc key hết quota |
| 429 khi sync | Đã thêm đủ 10 từ hôm nay |
| 401 | Token hết hạn — refresh hoặc login lại |

---

## Frontend (chạy thử)

```bash
cd Frontend
npm install
npx expo start --web
```
