from fastapi import HTTPException


MAX_MESSAGE_LENGTH = 1000

INJECTION_PATTERNS = [
    "ignore previous instructions",
    "ignore all instructions",
    "you are now",
    "forget your instructions",
    "system prompt",
    "jailbreak",
    "act as",
    "pretend you are",
]


def validate_message(message: str) -> str:
    """
    Validate and sanitize user input.
    - Check length
    - Detect prompt injection attempts
    - Strip dangerous characters
    """
    if not message or not message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    if len(message) > MAX_MESSAGE_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Message too long. Maximum {MAX_MESSAGE_LENGTH} characters allowed"
        )

    # Check for prompt injection
    lower = message.lower()
    for pattern in INJECTION_PATTERNS:
        if pattern in lower:
            raise HTTPException(
                status_code=400,
                detail="Invalid message content detected"
            )

    return message.strip()
