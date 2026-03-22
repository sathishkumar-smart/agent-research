import json
import httpx
from utils.retry import async_retry
from groq import AsyncGroq
from core.config import get_settings
from core.prompts import get_system_prompt, get_final_answer_prompt
from tools.registry import get_tools_description, execute_tool, TOOL_REGISTRY

settings = get_settings()


async def call_llm(messages: list) -> str:
    if settings.use_groq and settings.groq_api_key:
        return await call_groq(messages)
    return await call_ollama(messages)

@async_retry(max_attempts=3, delay=1.0, backoff=2.0)
async def call_groq(messages: list) -> str:
    client = AsyncGroq(api_key=settings.groq_api_key)
    response = await client.chat.completions.create(
        model=settings.groq_model,
        messages=messages,
        temperature=0.1,
        max_tokens=1024
    )
    return response.choices[0].message.content

@async_retry(max_attempts=2, delay=0.5, backoff=2.0)
async def call_ollama(messages: list) -> str:
    async with httpx.AsyncClient(timeout=settings.ollama_timeout) as client:
        response = await client.post(
            f"{settings.ollama_base_url}/api/chat",
            json={
                "model": settings.ollama_model,
                "messages": messages,
                "stream": False
            }
        )
        response.raise_for_status()
        return response.json()["message"]["content"]


def parse_tool_call(llm_response: str) -> dict | None:
    """
    Extract FIRST valid tool call JSON from LLM response.
    Handles cases where LLM outputs multiple tool calls.
    """
    try:
        clean = llm_response.strip()

        # Find all { positions
        brace_positions = [i for i, c in enumerate(clean) if c == "{"]

        for start in brace_positions:
            # Try to find matching closing brace
            depth = 0
            for i, c in enumerate(clean[start:], start):
                if c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
                    if depth == 0:
                        json_str = clean[start:i+1]
                        try:
                            parsed = json.loads(json_str)
                            if "tool" in parsed and parsed["tool"] in TOOL_REGISTRY:
                                return parsed  # Return FIRST valid tool call
                        except json.JSONDecodeError:
                            break

    except Exception:
        pass
    return None

def is_tool_call_response(text: str) -> bool:
    """Check if response is still a tool call instead of final answer."""
    stripped = text.strip()
    return stripped.startswith("{") and "tool" in stripped

async def run_agent(user_message: str, history: list) -> dict:
    """
    Multi-step agent loop:
    - Runs up to max_iterations
    - Each iteration can call one tool
    - Results from previous tools are passed to next iteration
    - Stops when LLM gives a direct answer (no tool call)
    """
    messages = [
        {
            "role": "system",
            "content": get_system_prompt(get_tools_description())
        }
    ]

    for msg in history:
        if isinstance(msg, dict):
            messages.append({"role": msg["role"], "content": msg["content"]})
        else:
            messages.append({"role": msg.role, "content": msg.content})
        
    messages.append({"role": "user", "content": user_message})

    steps = []
    tools_used = []
    tool_results_summary = []

    for iteration in range(settings.agent_max_iterations):

        # If we have previous tool results, remind LLM what it found
        if tool_results_summary and iteration > 0:
            context = "So far you have gathered:\n" + "\n".join(tool_results_summary)
            context += "\n\nNow either use another tool OR give the final answer to the user."
            messages.append({"role": "user", "content": context})

        llm_response = await call_llm(messages)

        steps.append({
            "type": "thinking",
            "content": llm_response,
            "tool": "",
            "params": {},
            "result": ""
        })

        tool_call = parse_tool_call(llm_response)

        if tool_call:
            tool_name = tool_call.get("tool", "")
            tool_params = tool_call.get("params", {})

            if tool_name not in TOOL_REGISTRY:
                messages.append({
                    "role": "assistant",
                    "content": llm_response
                })
                messages.append({
                    "role": "user",
                    "content": f"Tool '{tool_name}' does not exist. Use one of: {list(TOOL_REGISTRY.keys())}"
                })
                continue

            # Execute tool
            tool_result = execute_tool(tool_name, tool_params)
            tools_used.append(tool_name)
            tool_results_summary.append(f"- {tool_name}: {tool_result[:300]}")

            steps.append({
                "type": "tool_call",
                "tool": tool_name,
                "params": tool_params,
                "result": tool_result,
                "content": ""
            })

            # Add to message history
            messages.append({"role": "assistant", "content": llm_response})
            messages.append({
                "role": "user",
                "content": get_final_answer_prompt(tool_name, tool_result) + f"\n\nOriginal user question: {user_message}"
            })

            # Ask LLM — does it need another tool or can it answer?
            next_response = await call_llm(messages)

            next_tool = parse_tool_call(next_response)

            if next_tool:
                # Needs another tool — continue loop
                steps.append({
                    "type": "thinking",
                    "content": next_response,
                    "tool": "",
                    "params": {},
                    "result": ""
                })
                messages.append({"role": "assistant", "content": next_response})
                # Execute second tool immediately
                tool_name2 = next_tool.get("tool", "")
                tool_params2 = next_tool.get("params", {})

                if tool_name2 in TOOL_REGISTRY:
                    tool_result2 = execute_tool(tool_name2, tool_params2)
                    tools_used.append(tool_name2)

                    steps.append({
                        "type": "tool_call",
                        "tool": tool_name2,
                        "params": tool_params2,
                        "result": tool_result2,
                        "content": ""
                    })

                    messages.append({
                        "role": "user",
                        "content": get_final_answer_prompt(tool_name2, tool_result2)
                    })

                    final_answer = await call_llm(messages)
                    # Safety — if LLM still returns tool call, force plain answer
                    if is_tool_call_response(final_answer):
                        messages.append({"role": "assistant", "content": final_answer})
                        messages.append({
                            "role": "user",
                            "content": "Please answer in plain English. Do not use JSON or tool calls."
                        })
                        final_answer = await call_llm(messages)
                        # Safety — if LLM still returns tool call, force plain answer
                        if is_tool_call_response(final_answer):
                            messages.append({"role": "assistant", "content": final_answer})
                            messages.append({
                                "role": "user",
                                "content": "Please answer in plain English. Do not use JSON or tool calls."
                            })
                            final_answer = await call_llm(messages)
                else:
                    final_answer = next_response

            else:
                # Direct answer after tool
                final_answer = next_response

            steps.append({
                "type": "answer",
                "content": final_answer,
                "tool": "",
                "params": {},
                "result": ""
            })

            return {
                "answer": final_answer,
                "steps": steps,
                "tools_used": tools_used
            }

        else:
            # Direct answer — no tool needed
            steps.append({
                "type": "answer",
                "content": llm_response,
                "tool": "",
                "params": {},
                "result": ""
            })

            return {
                "answer": llm_response,
                "steps": steps,
                "tools_used": tools_used
            }

    return {
        "answer": "Maximum reasoning steps reached. Please rephrase your question.",
        "steps": steps,
        "tools_used": tools_used
    }