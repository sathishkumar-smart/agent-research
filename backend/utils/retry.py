import asyncio
import functools
from core.logging import get_logger

logger = get_logger(__name__)


def async_retry(max_attempts: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """
    Decorator for async functions with exponential backoff retry.
    max_attempts: total attempts
    delay: initial delay in seconds
    backoff: multiplier for each retry
    """
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            current_delay = delay
            last_exception = None

            for attempt in range(1, max_attempts + 1):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt == max_attempts:
                        logger.error(
                            "max_retries_exceeded",
                            function=func.__name__,
                            attempts=attempt,
                            error=str(e)
                        )
                        raise

                    logger.warning(
                        "retry_attempt",
                        function=func.__name__,
                        attempt=attempt,
                        delay=current_delay,
                        error=str(e)
                    )
                    await asyncio.sleep(current_delay)
                    current_delay *= backoff

            raise last_exception
        return wrapper
    return decorator
