import math


SAFE_FUNCTIONS = {
    'abs': abs, 'round': round,
    'min': min, 'max': max,
    'pow': pow, 'sqrt': math.sqrt,
    'floor': math.floor, 'ceil': math.ceil,
    'log': math.log, 'log10': math.log10,
    'pi': math.pi, 'e': math.e,
    'sin': math.sin, 'cos': math.cos, 'tan': math.tan,
}


def calculate(expression: str) -> str:
    """
    Safely evaluate a mathematical expression.
    Supports: +, -, *, /, **, sqrt, log, sin, cos, tan, pi, e
    """
    try:
        # Clean the expression
        expression = expression.strip()

        # Block any dangerous operations
        blocked = ['import', 'exec', 'eval', 'open', '__']
        for b in blocked:
            if b in expression:
                return f"Invalid expression: '{b}' is not allowed"

        result = eval(expression, {"__builtins__": {}}, SAFE_FUNCTIONS)

        # Format nicely
        if isinstance(result, float):
            if result == int(result):
                return f"Result: {int(result)}"
            return f"Result: {round(result, 6)}"

        return f"Result: {result}"

    except ZeroDivisionError:
        return "Error: Division by zero"
    except Exception as e:
        return f"Calculation error: {str(e)}"
