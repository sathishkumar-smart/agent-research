from tools.search import search_web
from tools.calculator import calculate
from tools.datetime_tool import get_datetime
from tools.weather import get_weather
from tools.datetime_tool import get_datetime, date_difference

# Central registry — add new tools here
TOOL_REGISTRY = {
    "search_web": {
        "function": search_web,
        "description": "Search the internet for current info, news, prices, facts, people",
        "params": "query (string)",
        "requires_params": True
    },
    "calculate": {
        "function": calculate,
        "description": "Perform mathematical calculations — arithmetic, percentages, powers, roots",
        "params": "expression (math expression string e.g. '150 * 1.18')",
        "requires_params": True
    },
    "get_datetime": {
        "function": get_datetime,
        "description": "Get the current date, time, day of week",
        "params": "none",
        "requires_params": False
    },
    "get_weather": {
        "function": get_weather,
        "description": "Get current weather for any city",
        "params": "city (string e.g. 'Bangalore' or 'London')",
        "requires_params": True
    },
    "date_difference": {
        "function": date_difference,
        "description": "Calculate exact number of days, months, years between a past date and today. Use for questions like 'how long ago', 'how many days since', 'time gap from date to now'",
        "params": "from_date (string in YYYY-MM-DD format e.g. '2024-01-15')",
        "requires_params": True
    },
}


def get_tools_description() -> str:
    """Format tools for the system prompt."""
    lines = []
    for name, info in TOOL_REGISTRY.items():
        lines.append(f"- {name}: {info['description']} | params: {info['params']}")
    return "\n".join(lines)


def execute_tool(tool_name: str, params: dict) -> str:
    """Execute a tool by name with given params."""
    if tool_name not in TOOL_REGISTRY:
        return f"Unknown tool: {tool_name}"

    tool = TOOL_REGISTRY[tool_name]
    fn = tool["function"]

    if tool["requires_params"] and params:
        param_value = list(params.values())[0]
        return fn(param_value)
    else:
        return fn()
