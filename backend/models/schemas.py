from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# ── Auth ──
class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime
    class Config:
        from_attributes = True


# ── Sessions ──
class SessionCreate(BaseModel):
    title: str = "New Chat"

class SessionResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0
    class Config:
        from_attributes = True


# ── Messages ──
class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    tools_used: str
    created_at: datetime
    class Config:
        from_attributes = True
