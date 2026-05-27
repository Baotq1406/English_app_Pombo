import asyncpg
from datetime import datetime, timezone
from app.core.config import settings


class Database:
    def __init__(self) -> None:
        self._pool: asyncpg.Pool | None = None

    async def connect(self) -> None:
        if self._pool is None:
            self._pool = await asyncpg.create_pool(dsn=settings.database_url, min_size=1, max_size=5)

    async def close(self) -> None:
        if self._pool is not None:
            await self._pool.close()
            self._pool = None

    async def insert_profile(self, profile: dict) -> dict:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = """
            INSERT INTO public.profiles (
                id, display_name, phone, avatar_url, goal, level, pom_coin, gem, words_learned
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING id, display_name, phone, avatar_url, goal, level, pom_coin, gem, words_learned, created_at, updated_at
        """
        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(
                query,
                profile.get("id"),
                profile.get("display_name"),
                profile.get("phone"),
                profile.get("avatar_url"),
                profile.get("goal"),
                profile.get("level"),
                profile.get("pom_coin"),
                profile.get("gem"),
                profile.get("words_learned"),
            )
            return dict(row) if row else {}

    async def get_profile(self, user_id: str) -> dict | None:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = """
            SELECT id, display_name, phone, avatar_url, goal, level,
                   pom_coin, gem, words_learned, created_at, updated_at
            FROM public.profiles
            WHERE id = $1
            LIMIT 1
        """
        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(query, user_id)
            return dict(row) if row else None

    async def create_user(self, email: str, password_hash: str) -> dict:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = """
            INSERT INTO public.users (email, password_hash)
            VALUES ($1, $2)
            RETURNING id, email, created_at, updated_at
        """
        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(query, email, password_hash)
            return dict(row) if row else {}

    async def get_user_by_email(self, email: str) -> dict | None:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = """
            SELECT id, email, password_hash, created_at, updated_at
            FROM public.users
            WHERE email = $1
            LIMIT 1
        """
        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(query, email)
            return dict(row) if row else None

    async def store_refresh_token(self, user_id: str, refresh_token_hash: str, expires_at) -> None:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = """
            INSERT INTO public.user_sessions (user_id, refresh_token_hash, expires_at)
            VALUES ($1, $2, $3)
        """
        async with self._pool.acquire() as conn:
            await conn.execute(query, user_id, refresh_token_hash, expires_at)

    async def find_refresh_session(self, refresh_token_hash: str) -> dict | None:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = """
            SELECT id, user_id, refresh_token_hash, expires_at
            FROM public.user_sessions
            WHERE refresh_token_hash = $1
            LIMIT 1
        """
        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(query, refresh_token_hash)
            return dict(row) if row else None

    async def delete_refresh_session(self, session_id: str) -> None:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = "DELETE FROM public.user_sessions WHERE id = $1"
        async with self._pool.acquire() as conn:
            await conn.execute(query, session_id)

    async def delete_refresh_sessions_for_user(self, user_id: str) -> None:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = "DELETE FROM public.user_sessions WHERE user_id = $1"
        async with self._pool.acquire() as conn:
            await conn.execute(query, user_id)

    # ────── Vocabulary ──────

    async def search_vocabulary(self, q: str, limit: int = 50) -> list:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = """
            SELECT id, word, type, phonetic, meaning_vi, definition_vi,
                   example_en, example_vi, level
            FROM public.vocabulary
            WHERE word ILIKE $1
            ORDER BY
                CASE WHEN word ILIKE $2 THEN 0 ELSE 1 END,
                length(word),
                word
            LIMIT $3
        """
        async with self._pool.acquire() as conn:
            rows = await conn.fetch(query, f"%{q}%", f"{q}%", limit)
            return [dict(r) for r in rows]

    async def get_vocabulary_by_id(self, vocab_id: str) -> dict | None:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = """
            SELECT id, word, type, phonetic, meaning_vi, definition_vi,
                   example_en, example_vi, level
            FROM public.vocabulary
            WHERE id = $1
            LIMIT 1
        """
        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(query, vocab_id)
            return dict(row) if row else None

    async def get_all_vocabulary(self, limit: int = 50, offset: int = 0) -> list:
        """Get paginated list of all vocabulary"""
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = """
            SELECT id, word, type, phonetic, meaning_vi, definition_vi,
                   example_en, example_vi, level
            FROM public.vocabulary
            ORDER BY id
            LIMIT $1 OFFSET $2
        """
        async with self._pool.acquire() as conn:
            rows = await conn.fetch(query, limit, offset)
            return [dict(r) for r in rows]

    async def get_vocabulary_distractors(self, exclude_ids: list[str], limit: int = 100) -> list:
        """Get random vocabulary meanings for quiz distractors"""
        if self._pool is None:
            raise RuntimeError("Database not connected")
        
        if exclude_ids:
            # Build the exclusion list as a SQL array
            placeholders = ','.join([f"${i}" for i in range(1, len(exclude_ids) + 1)])
            query = f"""
                SELECT id, word, type, phonetic, meaning_vi, definition_vi,
                       example_en, example_vi, level
                FROM public.vocabulary
                WHERE meaning_vi IS NOT NULL
                  AND id NOT IN ({placeholders})
                ORDER BY RANDOM()
                LIMIT ${len(exclude_ids) + 1}
            """
            params = exclude_ids + [limit]
        else:
            query = """
                SELECT id, word, type, phonetic, meaning_vi, definition_vi,
                       example_en, example_vi, level
                FROM public.vocabulary
                WHERE meaning_vi IS NOT NULL
                ORDER BY RANDOM()
                LIMIT $1
            """
            params = [limit]
        
        async with self._pool.acquire() as conn:
            rows = await conn.fetch(query, *params)
            return [dict(r) for r in rows]

    async def add_user_vocabulary(self, user_id: str, vocabulary_id: str) -> dict | tuple[None, str]:
        """
        Add vocabulary to user's notebook.
        Returns dict on success, or (None, "error_reason") on failure.
        error_reason can be: "daily_limit", "already_exists"
        """
        if self._pool is None:
            raise RuntimeError("Database not connected")
        
        async with self._pool.acquire() as conn:
            # Check daily limit (max 10 words per day)
            daily_count = await conn.fetchval(
                """
                SELECT COUNT(*)
                FROM public.user_vocabulary
                WHERE user_id = $1
                  AND DATE(created_at) = DATE(now())
                """,
                user_id,
            )
            
            if daily_count and daily_count >= 10:
                return (None, "daily_limit")
            
            # Check if already exists
            existing = await conn.fetchrow(
                "SELECT user_id FROM public.user_vocabulary WHERE user_id = $1 AND vocabulary_id = $2",
                user_id, vocabulary_id
            )
            if existing:
                return (None, "already_exists")
            
            query = """
                INSERT INTO public.user_vocabulary (user_id, vocabulary_id, review_level)
                VALUES ($1, $2, 5)
                RETURNING user_id, vocabulary_id, is_reviewing, review_level,
                          next_review_at, last_reviewed_at, review_count, created_at
            """
            row = await conn.fetchrow(query, user_id, vocabulary_id)
            return dict(row) if row else (None, "unknown_error")

    async def get_user_vocabulary(
        self,
        user_id: str,
        is_reviewing: bool | None = None,
        review_level: int | None = None,
        search: str | None = None,
    ) -> list:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        conditions = ["uv.user_id = $1"]
        params: list = [user_id]
        idx = 2
        if is_reviewing is not None:
            conditions.append(f"uv.is_reviewing = ${idx}")
            params.append(is_reviewing)
            idx += 1
        if review_level is not None:
            conditions.append(f"uv.review_level = ${idx}")
            params.append(review_level)
            idx += 1
        if search:
            conditions.append(f"v.word ILIKE ${idx}")
            params.append(f"%{search}%")
            idx += 1
        where = " AND ".join(conditions)
        query = f"""
            SELECT v.id, v.word, v.type, v.phonetic, v.meaning_vi, v.definition_vi,
                   v.example_en, v.example_vi, v.level AS vocab_level,
                   uv.is_reviewing, uv.review_level, uv.next_review_at,
                   uv.last_reviewed_at, uv.review_count, uv.created_at AS added_at
            FROM public.user_vocabulary uv
            JOIN public.vocabulary v ON v.id = uv.vocabulary_id
            WHERE {where}
            ORDER BY v.word
        """
        async with self._pool.acquire() as conn:
            rows = await conn.fetch(query, *params)
            return [dict(r) for r in rows]

    async def toggle_user_vocabulary(self, user_id: str, vocab_id: str) -> dict | None:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = """
            UPDATE public.user_vocabulary
            SET is_reviewing = NOT is_reviewing
            WHERE user_id = $1 AND vocabulary_id = $2
            RETURNING user_id, vocabulary_id, is_reviewing, review_level,
                      next_review_at, last_reviewed_at, review_count
        """
        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(query, user_id, vocab_id)
            return dict(row) if row else None

    async def update_review_level(self, user_id: str, vocab_id: str, new_level: int) -> dict | None:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = """
            UPDATE public.user_vocabulary
            SET review_level = $3
            WHERE user_id = $1 AND vocabulary_id = $2
            RETURNING user_id, vocabulary_id, is_reviewing, review_level,
                      next_review_at, last_reviewed_at, review_count
        """
        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(query, user_id, vocab_id, new_level)
            return dict(row) if row else None

    async def get_words_for_review(self, user_id: str, limit: int = 10) -> list:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = """
            SELECT v.id, v.word, v.type, v.phonetic, v.meaning_vi, v.definition_vi,
                   v.example_en, v.example_vi, v.level AS vocab_level,
                   uv.is_reviewing, uv.review_level, uv.next_review_at,
                   uv.last_reviewed_at, uv.review_count
            FROM public.user_vocabulary uv
            JOIN public.vocabulary v ON v.id = uv.vocabulary_id
            WHERE uv.user_id = $1
              AND uv.is_reviewing = true
            ORDER BY RANDOM()
            LIMIT $2
        """
        async with self._pool.acquire() as conn:
            rows = await conn.fetch(query, user_id, limit)
            return [dict(r) for r in rows]

    async def submit_review_answer(self, user_id: str, vocab_id: str, correct: bool):
        if self._pool is None:
            raise RuntimeError("Database not connected")
        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                SELECT review_level, correct_streak, created_at 
                FROM public.user_vocabulary 
                WHERE user_id = $1 AND vocabulary_id = $2
                """,
                user_id, vocab_id,
            )
            if not row:
                return None
            
            current_level = row["review_level"]
            current_streak = row["correct_streak"] or 0
            created_at = row["created_at"]
            
            if correct:
                new_streak = current_streak + 1
                new_level = current_level
                
                # Check: 3 consecutive correct OR 3 days elapsed
                days_elapsed = (datetime.now(timezone.utc) - created_at.replace(tzinfo=timezone.utc)).days
                should_decrease = (new_streak == 3) or (days_elapsed >= 3)
                
                if should_decrease and current_level > 1:
                    new_level = current_level - 1
                    new_streak = 0
                    intervals = {1: 1, 2: 3, 3: 7, 4: 14, 5: 30}
                    days = intervals.get(new_level, 1)
                else:
                    # Level didn't decrease - review again soon
                    days = 1
            else:
                # Wrong answer: reset streak + decrease level
                new_streak = 0
                new_level = max(current_level - 1, 1)
                days = 1
            
            result = await conn.fetchrow(
                """
                UPDATE public.user_vocabulary
                SET review_level = $3,
                    correct_streak = $4,
                    next_review_at = now() + ($5 || ' days')::interval,
                    last_reviewed_at = now(),
                    review_count = review_count + 1
                WHERE user_id = $1 AND vocabulary_id = $2
                RETURNING user_id, vocabulary_id, is_reviewing, review_level,
                          correct_streak, next_review_at, last_reviewed_at, review_count
                """,
                user_id, vocab_id, new_level, new_streak, str(days),
            )
            return dict(result) if result else None

    async def get_vocabulary_by_ids(self, vocab_ids: list[str]) -> list:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = """
            SELECT id, word, type, phonetic, meaning_vi, definition_vi,
                   example_en, example_vi, level
            FROM public.vocabulary
            WHERE id = ANY($1::uuid[])
        """
        async with self._pool.acquire() as conn:
            rows = await conn.fetch(query, vocab_ids)
            return [dict(r) for r in rows]

    async def delete_user_vocabulary(self, user_id: str, vocab_id: str) -> bool:
        if self._pool is None:
            raise RuntimeError("Database not connected")
        query = "DELETE FROM public.user_vocabulary WHERE user_id = $1 AND vocabulary_id = $2"
        async with self._pool.acquire() as conn:
            result = await conn.execute(query, user_id, vocab_id)
            return "DELETE 1" in result

    # AI Cache Methods
    async def get_ai_examples_cache(self, vocab_id: str) -> list[str] | None:
        """Get cached AI-generated examples. Returns None if expired or not found."""
        if self._pool is None:
            raise RuntimeError("Database not connected")
        
        import json
        query = """
            SELECT examples FROM public.ai_examples_cache
            WHERE vocabulary_id = $1 AND expires_at > NOW()
        """
        async with self._pool.acquire() as conn:
            result = await conn.fetchval(query, vocab_id)
            if result:
                try:
                    return json.loads(result) if isinstance(result, str) else result
                except (json.JSONDecodeError, TypeError):
                    return []
            return None
    
    async def cache_ai_examples(self, vocab_id: str, examples: list[str]) -> bool:
        """Cache AI-generated examples. Updates if already exists."""
        if self._pool is None:
            raise RuntimeError("Database not connected")
        
        import json
        query = """
            INSERT INTO public.ai_examples_cache (vocabulary_id, examples)
            VALUES ($1, $2)
            ON CONFLICT (vocabulary_id) 
            DO UPDATE SET 
                examples = $2,
                created_at = CURRENT_TIMESTAMP,
                expires_at = CURRENT_TIMESTAMP + INTERVAL '30 days'
        """
        async with self._pool.acquire() as conn:
            examples_json = json.dumps(examples, ensure_ascii=False)
            await conn.execute(query, vocab_id, examples_json)
            return True
    
    async def get_ai_distractors_cache(self, vocab_id: str, count: int = 3) -> list[str] | None:
        """Get cached AI-generated distractors. Returns None if expired or not found."""
        if self._pool is None:
            raise RuntimeError("Database not connected")
        
        import json
        query = """
            SELECT distractors FROM public.ai_distractors_cache
            WHERE vocabulary_id = $1 AND expires_at > NOW()
        """
        async with self._pool.acquire() as conn:
            result = await conn.fetchval(query, vocab_id)
            if result:
                try:
                    distractors = json.loads(result) if isinstance(result, str) else result
                    return distractors[:count] if isinstance(distractors, list) else []
                except (json.JSONDecodeError, TypeError):
                    return []
            return None
    
    async def cache_ai_distractors(self, vocab_id: str, distractors: list[str]) -> bool:
        """Cache AI-generated distractors. Updates if already exists."""
        if self._pool is None:
            raise RuntimeError("Database not connected")
        
        import json
        query = """
            INSERT INTO public.ai_distractors_cache (vocabulary_id, distractors)
            VALUES ($1, $2)
            ON CONFLICT (vocabulary_id) 
            DO UPDATE SET 
                distractors = $2,
                created_at = CURRENT_TIMESTAMP,
                expires_at = CURRENT_TIMESTAMP + INTERVAL '30 days'
        """
        async with self._pool.acquire() as conn:
            distractors_json = json.dumps(distractors, ensure_ascii=False)
            await conn.execute(query, vocab_id, distractors_json)
            return True


db = Database()
