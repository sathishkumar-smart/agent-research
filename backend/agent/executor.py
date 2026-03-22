from tools.registry import execute_tool, TOOL_REGISTRY


def run_tool(tool_name: str, params: dict) -> dict:
    """
    Execute a tool and return structured result.
    Handles errors gracefully.
    """
    if tool_name not in TOOL_REGISTRY:
        return {
            "success": False,
            "tool": tool_name,
            "result": f"Tool '{tool_name}' not found in registry",
            "error": "TOOL_NOT_FOUND"
        }

    try:
        result = execute_tool(tool_name, params)
        return {
            "success": True,
            "tool": tool_name,
            "params": params,
            "result": result,
            "error": None
        }
    except Exception as e:
        return {
            "success": False,
            "tool": tool_name,
            "params": params,
            "result": f"Tool execution failed: {str(e)}",
            "error": str(e)
        }


def get_available_tools() -> list:
    """Return list of all available tools with metadata."""
    return [
        {
            "name": name,
            "description": info["description"],
            "params": info["params"],
            "requires_params": info["requires_params"]
        }
        for name, info in TOOL_REGISTRY.items()
    ]
