from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Ollama
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "tinyllama"
    ollama_timeout: int = 60

    # Groq
    groq_api_key: str = ""
    groq_model: str = "llama-3.1-8b-instant"
    use_groq: bool = False

    # Agent
    agent_max_iterations: int = 3
    agent_max_search_results: int = 4

    # App
    app_name: str = "Research Agent"
    app_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    debug: bool = False

    # Auth
    secret_key: str = "research-agent-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # Database
    database_url: str = "sqlite:///./agent.db"

    # Rate limiting
    rate_limit_per_minute: int = 20

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
