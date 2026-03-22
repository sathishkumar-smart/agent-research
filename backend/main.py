from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.chat import router as agent_router
from schemas.models import HealthResponse
from core.config import get_settings
from tools.registry import TOOL_REGISTRY

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Production-grade AI Research Agent with tool use"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent_router)


@app.get("/", response_model=HealthResponse)
def health():
    return HealthResponse(
        status="running",
        version=settings.app_version,
        model=settings.ollama_model,
        tools=list(TOOL_REGISTRY.keys())
    )
