import json
import httpx
from app.core.config import settings

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


class AIService:
    """Service for OpenRouter API calls (OpenAI-compatible)"""

    def __init__(self):
        self.api_key = settings.openrouter_api_key
        self.model = settings.openrouter_model

    async def _call(self, prompt: str) -> str | None:
        if not self.api_key:
            print("Error: OPENROUTER_API_KEY not configured")
            return None
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        body = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
        }
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post(OPENROUTER_URL, headers=headers, json=body)
            if r.status_code != 200:
                print(f"OpenRouter error {r.status_code}: {r.text[:300]}")
                return None
            data = r.json()
            return data["choices"][0]["message"]["content"]

    async def generate_examples(self, word: str, meaning_vi: str, word_type: str) -> list[str]:
        """Generate 3 natural English example sentences for a word."""
        prompt = f"""Generate 3 natural, realistic English example sentences using the word "{word}" ({word_type}).

Meaning: {meaning_vi}

Requirements:
- Each sentence must be natural and commonly used
- Use different contexts/situations
- Show different aspects of the word's usage
- Sentences should be 8-15 words long
- Professional/daily conversation tone

Format your response as a JSON array with exactly 3 strings:
["sentence 1", "sentence 2", "sentence 3"]

Only return the JSON array, no other text."""
        text = await self._call(prompt)
        if not text:
            return []
        text = text.strip()
        try:
            if text.startswith("[") and text.endswith("]"):
                examples = json.loads(text)
                if isinstance(examples, list) and len(examples) == 3:
                    return examples
        except json.JSONDecodeError:
            pass
        return []

    async def generate_distractors(
        self, word: str, correct_meaning_vi: str, word_type: str, count: int = 3
    ) -> list[str]:
        """Generate plausible but WRONG Vietnamese definitions (distractors)."""
        prompt = f"""Generate {count} plausible but INCORRECT Vietnamese meanings for the English word "{word}" ({word_type}).

Correct meaning: {correct_meaning_vi}

Requirements:
- Each distractor should be plausible (not obviously wrong)
- Should relate to similar concepts but be INCORRECT
- Could be:
  * A related but different word meaning
  * A partial/incomplete definition
  * A common misconception
  * Related to the word's etymology or similar words
- Do NOT use the correct meaning
- Each definition should be 3-10 words in Vietnamese

Format your response as a JSON array with exactly {count} strings:
["distractor 1", "distractor 2", "distractor 3"]

Only return the JSON array, no other text."""
        text = await self._call(prompt)
        if not text:
            return []
        text = text.strip()
        try:
            if text.startswith("[") and text.endswith("]"):
                distractors = json.loads(text)
                if isinstance(distractors, list) and len(distractors) == count:
                    filtered = [d for d in distractors if correct_meaning_vi.lower() not in d.lower()]
                    return filtered[:count]
        except json.JSONDecodeError:
            pass
        return []


ai_service = AIService()
