from pydantic import BaseModel
from typing import Any


class Message(BaseModel):
    role: str
    content: str


class AgentStep(BaseModel):
    type: str        # "thinking" | "tool_call" | "answer"
    content: str = ""
    tool: str = ""
    params: dict = {}
    result: str = ""


class ChatRequest(BaseModel):
    message: str
    history: list[Message] = []


class ChatResponse(BaseModel):
    answer: str
    steps: list[AgentStep]
    model: str
    tools_used: list[str] = []


class ToolInfo(BaseModel):
    name: str
    description: str
    params: str


class ToolsResponse(BaseModel):
    tools: list[ToolInfo]
    total: int


class HealthResponse(BaseModel):
    status: str
    version: str
    model: str
    tools: list[str]
