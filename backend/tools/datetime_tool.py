from datetime import datetime, date


def get_datetime() -> str:
    """Get the current date and time with full details."""
    now = datetime.now()
    return (
        f"Current Date & Time:\n"
        f"  Date: {now.strftime('%A, %B %d, %Y')}\n"
        f"  Time: {now.strftime('%I:%M:%S %p')}\n"
        f"  Day of week: {now.strftime('%A')}\n"
        f"  Week number: {now.isocalendar()[1]}\n"
        f"  Unix timestamp: {int(now.timestamp())}\n"
        f"  ISO format: {now.strftime('%Y-%m-%d')}"
    )


def date_difference(from_date: str) -> str:
    """
    Calculate exact difference between a given date and today.
    Input format: YYYY-MM-DD
    """
    try:
        start = datetime.strptime(from_date.strip(), "%Y-%m-%d").date()
        today = date.today()

        delta = today - start
        total_days = delta.days

        if total_days < 0:
            return f"The date {from_date} is in the future — {abs(total_days)} days from now."

        years = total_days // 365
        remaining = total_days % 365
        months = remaining // 30
        days = remaining % 30

        parts = []
        if years > 0:
            parts.append(f"{years} year{'s' if years > 1 else ''}")
        if months > 0:
            parts.append(f"{months} month{'s' if months > 1 else ''}")
        if days > 0:
            parts.append(f"{days} day{'s' if days > 1 else ''}")

        readable = ", ".join(parts) if parts else "0 days"

        return (
            f"Date difference from {from_date} to today ({today}):\n"
            f"  Total days: {total_days}\n"
            f"  Breakdown: {readable}\n"
            f"  Weeks: {total_days // 7}\n"
            f"  Months (approx): {total_days // 30}"
        )
    except ValueError:
        return f"Invalid date format: {from_date}. Please use YYYY-MM-DD format."