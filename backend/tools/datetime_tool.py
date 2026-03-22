from datetime import datetime


def get_datetime() -> str:
    """Get the current date and time with full details."""
    now = datetime.now()
    return (
        f"Current Date & Time:\n"
        f"  Date: {now.strftime('%A, %B %d, %Y')}\n"
        f"  Time: {now.strftime('%I:%M:%S %p')}\n"
        f"  Day of week: {now.strftime('%A')}\n"
        f"  Week number: {now.isocalendar()[1]}\n"
        f"  Unix timestamp: {int(now.timestamp())}"
    )
