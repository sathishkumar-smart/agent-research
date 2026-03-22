# 🤖 Research Agent

A production-grade AI agent that thinks, uses tools, and chains 
multiple steps to answer complex questions.
Built with FastAPI + Groq (Llama 3.1) + Next.js.

## What Makes This an Agent?

Unlike a chatbot that just responds, this agent:
1. **Reasons** about what tools it needs
2. **Executes** tools autonomously  
3. **Chains** multiple tools together
4. **Synthesizes** results into a clear answer

## Tools Available
| Tool | Description |
|------|-------------|
| 🔍 search_web | Real-time web search via DuckDuckGo |
| 🧮 calculate | Math expressions, percentages, powers |
| 🕐 get_datetime | Current date, time, day of week |
| 🌤️ get_weather | Current weather for any city |

## Tech Stack
- **Backend:** Python, FastAPI (production structure)
- **LLM:** Groq API (Llama 3.1 8B) — fast inference
- **Search:** DuckDuckGo (ddgs) — no API key needed
- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Architecture:** Atomic design — components, hooks, lib, types

## Project Structure
```
agent-research/
├── backend/
│   ├── main.py              # Entry point
│   ├── core/
│   │   ├── config.py        # Settings
│   │   └── prompts.py       # LLM prompts
│   ├── tools/
│   │   ├── registry.py      # Tool registry
│   │   ├── search.py        # Web search
│   │   ├── calculator.py    # Math
│   │   ├── datetime_tool.py # Date/time
│   │   └── weather.py       # Weather
│   ├── agent/
│   │   ├── brain.py         # Agent loop
│   │   └── executor.py      # Tool execution
│   ├── routers/
│   │   └── chat.py          # API endpoints
│   └── schemas/
│       └── models.py        # Pydantic models
└── frontend/
    ├── components/
    │   ├── chat/            # Chat UI components
    │   ├── agent/           # Agent step tracker
    │   ├── layout/          # Navbar, Sidebar
    │   └── ui/              # Atoms (Spinner, Badge)
    ├── hooks/
    │   └── useAgent.ts      # Agent logic hook
    ├── lib/
    │   └── api.ts           # API layer
    └── types/
        └── index.ts         # TypeScript types
```

## How to Run

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API key (free at console.groq.com)

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Example Queries
- "What is the distance from Bangalore to Hyderabad?"
- "Search gold price in India and calculate cost of 100 grams"
- "What is 18% GST on ₹45,000?"
- "What are the latest AI developments today?"
- "Weather in Mumbai right now?"
