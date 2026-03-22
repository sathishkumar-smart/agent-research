from fastapi import APIRouter
from schemas.models import ChatRequest, ChatResponse, ToolsResponse, ToolInfo
from agent.brain import run_agent
from agent.executor import get_available_tools
from core.config import get_settings

router = APIRouter(prefix="/agent", tags=["Agent"])
settings = get_settings()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main agent endpoint.
    Accepts a message + conversation history.
    Returns answer + reasoning steps + tools used.
    """
    result = await run_agent(request.message, request.history)
    return ChatResponse(
        answer=result["answer"],
        steps=result["steps"],
        model=settings.ollama_model,
        tools_used=result["tools_used"]
    )


@router.get("/tools", response_model=ToolsResponse)
def list_tools():
    """List all available tools the agent can use."""
    tools = get_available_tools()
    return ToolsResponse(
        tools=[ToolInfo(**t) for t in tools],
        total=len(tools)
    )
