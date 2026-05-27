from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    access_token_expire_seconds: int = 10800
    database_url: str
    jwt_secret: str
    jwt_issuer: str = "pombo-api"
    jwt_audience: str = "pombo-app"
    refresh_token_expire_days: int = 30
    
    # AI & LLM (OpenRouter)
    openrouter_api_key: str = ""
    openrouter_model: str = "openai/gpt-4o-mini"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
