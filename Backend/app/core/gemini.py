import json
from google import genai
from app.core.config import settings


class GeminiService:
    """Service for Gemini API calls using google.genai"""
    
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.model_name = "gemini-2.0-flash"
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None
    
    async def generate_examples(self, word: str, meaning_vi: str, word_type: str) -> list[str]:
        """Generate 3 natural English example sentences for a word."""
        if not self.client:
            print("Error: GEMINI_API_KEY not configured")
            return []
        
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

        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=prompt,
            )
            response_text = response.text.strip()
            
            if response_text.startswith('[') and response_text.endswith(']'):
                examples = json.loads(response_text)
                if isinstance(examples, list) and len(examples) == 3:
                    return examples
        except Exception as e:
            print(f"Error generating examples: {e}")
        
        return []
    
    async def generate_distractors(
        self,
        word: str,
        correct_meaning_vi: str,
        word_type: str,
        count: int = 3
    ) -> list[str]:
        """Generate plausible but WRONG Vietnamese meaning definitions (distractors)."""
        if not self.client:
            print("Error: GEMINI_API_KEY not configured")
            return []
        
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

        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=prompt,
            )
            response_text = response.text.strip()
            
            if response_text.startswith('[') and response_text.endswith(']'):
                distractors = json.loads(response_text)
                if isinstance(distractors, list) and len(distractors) == count:
                    filtered = [d for d in distractors if correct_meaning_vi.lower() not in d.lower()]
                    return filtered[:count]
        except Exception as e:
            print(f"Error generating distractors: {e}")
        
        return []


gemini_service = GeminiService()
