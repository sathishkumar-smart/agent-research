from sqlalchemy.orm import Session
from agent.brain import run_agent
from services.history_service import save_message, get_session_messages
from utils.validators import validate_message
from schemas.models import ChatRequest
from core.logging import get_logger

logger = get_logger(__name__)


async def process_chat(
    request: ChatRequest,
    session_id: str,
    user_id: str,
    db: Session
) -> dict:
    """
    Full chat processing pipeline:
    1. Validate input
    2. Load session history from DB
    3. Run agent
    4. Save messages to DB
    5. Return response
    """
    # Validate
    clean_message = validate_message(request.message)

    # Load history from DB
    db_messages = get_session_messages(db, session_id)
    history = [
        {"role": msg.role, "content": msg.content}
        for msg in db_messages
    ]

    logger.info(
        "agent_processing",
        user_id=user_id,
        session_id=session_id,
        message_length=len(clean_message),
        history_length=len(history)
    )

    # Run agent
    result = await run_agent(clean_message, history)

    # Save to DB
    save_message(db, session_id, "user", clean_message)
    save_message(db, session_id, "assistant", result["answer"], result["tools_used"])

    logger.info(
        "agent_completed",
        session_id=session_id,
        tools_used=result["tools_used"],
        answer_length=len(result["answer"])
    )

    return result
