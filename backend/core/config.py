from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Ollama (fallback)
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "tinyllama"
    ollama_timeout: int = 60

    # Groq
    groq_api_key: str = ""
    groq_model: str = "llama3-8b-8192"
    use_groq: bool = False

    # Agent
    agent_max_iterations: int = 3
    agent_max_search_results: int = 4

    # App
    app_name: str = "Research Agent"
    app_version: str = "1.0.0"
    debug: bool = False

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()