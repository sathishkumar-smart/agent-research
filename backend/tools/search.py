from ddgs import DDGS
from core.config import get_settings
import httpx

settings = get_settings()


def search_web(query: str) -> str:
    """
    Search the internet using DuckDuckGo.
    Falls back to alternative method if blocked.
    """
    # Method 1 — DuckDuckGo text search
    try:
        with DDGS(timeout=10) as ddgs:
            results = list(ddgs.text(
                query,
                max_results=settings.agent_max_search_results,
                backend="lite"  # lite backend less likely to be blocked
            ))

        if results:
            output = f"Search results for '{query}':\n\n"
            for i, r in enumerate(results, 1):
                output += f"{i}. {r['title']}\n"
                output += f"   {r['body']}\n\n"
            return output.strip()

    except Exception:
        pass

    # Method 2 — DuckDuckGo news search
    try:
        with DDGS(timeout=10) as ddgs:
            results = list(ddgs.news(
                query,
                max_results=settings.agent_max_search_results
            ))

        if results:
            output = f"News results for '{query}':\n\n"
            for i, r in enumerate(results, 1):
                output += f"{i}. {r['title']}\n"
                output += f"   {r['body']}\n\n"
            return output.strip()

    except Exception:
        pass

    return f"Search is currently unavailable. Please try again later."