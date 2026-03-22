from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from routers.chat import router as agent_router
from routers.auth import router as auth_router
from routers.history import router as history_router
from schemas.models import HealthResponse
from core.config import get_settings
from core.logging import setup_logging, get_logger
from core.middleware import RequestLoggingMiddleware
from models.database import create_tables
from tools.registry import TOOL_REGISTRY

# Setup logging first
setup_logging()
logger = get_logger(__name__)
settings = get_settings()

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Production-grade AI Research Agent",
    docs_url=f"{settings.api_prefix}/docs",
    redoc_url=f"{settings.api_prefix}/redoc",
    openapi_url=f"{settings.api_prefix}/openapi.json"
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Middlewares
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables on startup
@app.on_event("startup")
def startup():
    create_tables()
    logger.info(
        "app_started",
        version=settings.app_version,
        model=settings.groq_model if settings.use_groq else settings.ollama_model,
        tools=list(TOOL_REGISTRY.keys())
    )

# Register routers with API versioning
app.include_router(auth_router, prefix=settings.api_prefix)
app.include_router(agent_router, prefix=settings.api_prefix)
app.include_router(history_router, prefix=settings.api_prefix)


@app.get("/", response_model=HealthResponse)
def health():
    return HealthResponse(
        status="running",
        version=settings.app_version,
        model=settings.groq_model if settings.use_groq else settings.ollama_model,
        tools=list(TOOL_REGISTRY.keys())
    )


@app.get(f"{settings.api_prefix}/health")
def detailed_health():
    return {
        "status": "healthy",
        "version": settings.app_version,
        "api_prefix": settings.api_prefix,
        "model": settings.groq_model if settings.use_groq else settings.ollama_model,
        "tools_count": len(TOOL_REGISTRY),
        "features": [
            "jwt-auth",
            "rate-limiting",
            "structured-logging",
            "chat-history",
            "retry-logic",
            "input-validation",
            "api-versioning"
        ]
    }
