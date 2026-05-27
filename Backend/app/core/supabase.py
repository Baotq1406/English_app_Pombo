import httpx
from app.core.config import settings


class SupabaseAuthClient:
    def __init__(self) -> None:
        self.base_url = settings.supabase_url.rstrip("/")
        self.anon_key = settings.supabase_anon_key

    @property
    def _headers(self) -> dict:
        return {
            "apikey": self.anon_key,
            "Authorization": f"Bearer {self.anon_key}",
            "Content-Type": "application/json",
        }

    async def sign_up(self, email: str, password: str) -> dict:
        url = f"{self.base_url}/auth/v1/signup"
        payload = {"email": email, "password": password}
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(url, json=payload, headers=self._headers)
            return await _parse_response(resp)

    async def sign_in_with_password(self, email: str, password: str) -> dict:
        url = f"{self.base_url}/auth/v1/token?grant_type=password"
        payload = {"email": email, "password": password}
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(url, json=payload, headers=self._headers)
            return await _parse_response(resp)

    async def refresh_token(self, refresh_token: str) -> dict:
        url = f"{self.base_url}/auth/v1/token?grant_type=refresh_token"
        payload = {"refresh_token": refresh_token}
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(url, json=payload, headers=self._headers)
            return await _parse_response(resp)


async def _parse_response(resp: httpx.Response) -> dict:
    if resp.is_error:
        try:
            data = resp.json()
        except ValueError:
            data = {"message": resp.text}
        raise SupabaseAuthError(resp.status_code, data)
    return resp.json()


class SupabaseAuthError(RuntimeError):
    def __init__(self, status_code: int, payload: dict) -> None:
        self.status_code = status_code
        self.payload = payload
        message = payload.get("error_description") or payload.get("msg") or payload.get("message") or "Supabase auth error"
        super().__init__(message)


supabase_auth = SupabaseAuthClient()
