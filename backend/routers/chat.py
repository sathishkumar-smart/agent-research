from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db
from schemas.models import ChatRequest, ChatResponse, ToolsResponse, ToolInfo
from services.agent_service import process_chat
from services.history_service import create_session, get_session
from routers.auth import get_current_user
from agent.executor import get_available_tools
from core.config import get_settings
from core.logging import get_logger

router = APIRouter(prefix="/agent", tags=["Agent"])
settings = get_settings()
logger = get_logger(__name__)


@router.post("/chat/{session_id}", response_model=ChatResponse)
async def chat(
    session_id: str,
    request: ChatRequest,
    token: str = "",
    db: Session = Depends(get_db)
):
    """
    Send a message to the agent within a session.
    History is loaded from DB automatically.
    """
    user = get_current_user(token, db)

    # Verify session belongs to user
    session = get_session(db, session_id, user.id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    result = await process_chat(request, session_id, user.id, db)

    return ChatResponse(
        answer=result["answer"],
        steps=result["steps"],
        model=settings.groq_model if settings.use_groq else settings.ollama_model,
        tools_used=result["tools_used"]
    )


@router.get("/tools", response_model=ToolsResponse)
def list_tools():
    tools = get_available_tools()
    return ToolsResponse(
        tools=[ToolInfo(**t) for t in tools],
        total=len(tools)
    )
