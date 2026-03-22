def get_system_prompt(tools_description: str) -> str:
    return f"""You are a research agent. You have these tools:

{tools_description}

STRICT RULES:
- Use ONE tool at a time only
- Output ONLY the JSON when calling a tool — no other text
- For get_datetime: {{"tool": "get_datetime", "params": {{}}}}
- After getting tool result, either use another tool OR give final answer

EXAMPLES:
User: what time is it?
You: {{"tool": "get_datetime", "params": {{}}}}

User: search for AI news
You: {{"tool": "search_web", "params": {{"query": "latest AI news 2026"}}}}

User: what is 25 * 4?
You: {{"tool": "calculate", "params": {{"expression": "25 * 4"}}}}

User: what is the capital of France?
You: The capital of France is Paris.

IMPORTANT:
- ONE tool call per response
- Never combine multiple tool calls
- Never call a tool inside another tool's params"""


def get_final_answer_prompt(tool_name: str, tool_result: str) -> str:
    return f"""Tool '{tool_name}' returned this result:

{tool_result}

Now write a clear, helpful answer in plain English to the user.
DO NOT output JSON. DO NOT call another tool. Just answer directly in plain text.
Be concise and friendly."""