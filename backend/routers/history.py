from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db
from models.schemas import SessionResponse, SessionCreate, MessageResponse
from services.history_service import (
    create_session, get_user_sessions,
    get_session, delete_session, get_session_messages
)
from routers.auth import get_current_user

router = APIRouter(prefix="/sessions", tags=["Chat History"])


@router.post("/", response_model=SessionResponse)
def new_session(
    data: SessionCreate,
    token: str = "",
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    session = create_session(db, user.id, data.title)
    session.message_count = 0
    return session


@router.get("/", response_model=list[SessionResponse])
def list_sessions(token: str = "", db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    sessions = get_user_sessions(db, user.id)
    result = []
    for s in sessions:
        s.message_count = len(s.messages)
        result.append(s)
    return result


@router.get("/{session_id}/messages", response_model=list[MessageResponse])
def get_messages(
    session_id: str,
    token: str = "",
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    session = get_session(db, session_id, user.id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return get_session_messages(db, session_id)


@router.delete("/{session_id}")
def remove_session(
    session_id: str,
    token: str = "",
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    if not delete_session(db, session_id, user.id):
        raise HTTPException(status_code=404, detail="Session not found")
    return {"message": "Session deleted"}
