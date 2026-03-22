from sqlalchemy.orm import Session
from models.database import ChatSession, ChatMessage
from core.logging import get_logger
import uuid
from datetime import datetime

logger = get_logger(__name__)


def create_session(db: Session, user_id: str, title: str = "New Chat") -> ChatSession:
    session = ChatSession(
        id=str(uuid.uuid4()),
        title=title,
        user_id=user_id
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    logger.info("session_created", session_id=session.id, user_id=user_id)
    return session


def get_user_sessions(db: Session, user_id: str) -> list:
    return db.query(ChatSession).filter(
        ChatSession.user_id == user_id
    ).order_by(ChatSession.updated_at.desc()).all()


def get_session(db: Session, session_id: str, user_id: str) -> ChatSession | None:
    return db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == user_id
    ).first()


def delete_session(db: Session, session_id: str, user_id: str) -> bool:
    session = get_session(db, session_id, user_id)
    if not session:
        return False
    db.delete(session)
    db.commit()
    logger.info("session_deleted", session_id=session_id)
    return True


def save_message(
    db: Session,
    session_id: str,
    role: str,
    content: str,
    tools_used: list = []
) -> ChatMessage:
    message = ChatMessage(
        id=str(uuid.uuid4()),
        session_id=session_id,
        role=role,
        content=content,
        tools_used=",".join(tools_used)
    )
    db.add(message)

    # Update session timestamp and auto-title
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if session:
        session.updated_at = datetime.utcnow()
        if session.title == "New Chat" and role == "user":
            session.title = content[:50] + ("..." if len(content) > 50 else "")

    db.commit()
    db.refresh(message)
    return message


def get_session_messages(db: Session, session_id: str) -> list:
    return db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.created_at.asc()).all()
