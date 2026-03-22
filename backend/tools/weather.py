from ddgs import DDGS


def get_weather(city: str) -> str:
    """Get current weather for a city."""

    # Method 1 — text search
    try:
        with DDGS(timeout=10) as ddgs:
            results = list(ddgs.text(
                f"weather {city} today temperature",
                max_results=2,
                backend="lite"
            ))
        if results:
            output = f"Weather for {city}:\n\n"
            for r in results:
                output += f"{r['title']}\n{r['body']}\n\n"
            return output.strip()
    except Exception:
        pass

    # Method 2 — news search
    try:
        with DDGS(timeout=10) as ddgs:
            results = list(ddgs.news(
                f"weather {city} today",
                max_results=2
            ))
        if results:
            output = f"Weather news for {city}:\n\n"
            for r in results:
                output += f"{r['title']}\n{r['body']}\n\n"
            return output.strip()
    except Exception:
        pass

    return f"Weather information for {city} is currently unavailable."