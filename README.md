# 🤖 Research Agent

A production-grade AI agent that autonomously decides which tools to use,
chains multiple steps together, and delivers accurate answers.
Built with FastAPI + Groq (Llama 3.1) + Next.js.

## What Makes This an Agent (Not Just a Chatbot)?

| Chatbot | AI Agent (This Project) |
|---------|------------------------|
| Responds from training data | Searches the web for real-time info |
| Single step — question → answer | Multi-step — reason → tool → tool → answer |
| No memory between sessions | Full conversation history per user session |
| No external actions | Executes tools autonomously |

## Features

- 🔐 JWT Authentication — register, login, secure sessions
- 🧠 Multi-step reasoning — chains multiple tools automatically
- 🔍 Real-time web search — DuckDuckGo, no API key needed
- 🧮 Math calculations — arithmetic, percentages, compound interest
- 📅 Date intelligence — current time, date differences
- 🌤️ Weather lookup — any city worldwide
- 💾 Persistent chat history — stored in SQLite per user session
- ⚡ Retry logic — exponential backoff on LLM failures
- 🛡️ Input validation — prompt injection detection
- 📊 Structured logging — JSON logs with request IDs
- 🔒 Rate limiting — 20 requests/minute per user
- 📦 API versioning — all endpoints under `/api/v1/`

## Available Tools

| Tool | Description | Example |
|------|-------------|---------|
| 🔍 `search_web` | Real-time web search | "latest AI news today" |
| 🧮 `calculate` | Math expressions | "18% GST on 45000" |
| 🕐 `get_datetime` | Current date & time | "what day is today?" |
| 📅 `date_difference` | Days between dates | "days since 2024-01-01" |
| 🌤️ `get_weather` | City weather | "weather in Bangalore" |

## Tech Stack

- **Backend:** Python 3.12, FastAPI, SQLAlchemy (SQLite)
- **LLM:** Groq API — Llama 3.1 8B Instant (blazing fast, free tier)
- **Search:** ddgs (DuckDuckGo) — no API key needed
- **Auth:** JWT via python-jose + bcrypt password hashing
- **Rate Limiting:** slowapi
- **Logging:** structlog (structured JSON logs)
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Architecture:** Atomic design — components, hooks, lib, types separated

## Project Structure
```
agent-research/
├── backend/
│   ├── main.py                  # Entry point — app setup, middleware, routers
│   ├── core/
│   │   ├── config.py            # All settings via pydantic-settings
│   │   ├── prompts.py           # LLM system prompts
│   │   ├── security.py          # JWT creation/verification, bcrypt
│   │   ├── logging.py           # Structured JSON logging setup
│   │   └── middleware.py        # Request logging, request ID injection
│   ├── tools/
│   │   ├── registry.py          # Central tool registry — add tools here
│   │   ├── search.py            # DuckDuckGo web search
│   │   ├── calculator.py        # Safe math expression evaluator
│   │   ├── datetime_tool.py     # Current time + date difference
│   │   └── weather.py           # City weather lookup
│   ├── agent/
│   │   ├── brain.py             # Core agent loop — reason, tool, answer
│   │   └── executor.py          # Tool execution with error handling
│   ├── routers/
│   │   ├── auth.py              # Register, login endpoints
│   │   ├── chat.py              # Agent chat endpoint
│   │   └── history.py           # Session CRUD, message history
│   ├── services/
│   │   ├── agent_service.py     # Business logic — validate, load history, run agent
│   │   └── history_service.py   # DB operations for sessions and messages
│   ├── models/
│   │   ├── database.py          # SQLAlchemy models: User, ChatSession, ChatMessage
│   │   └── schemas.py           # Pydantic request/response schemas
│   └── utils/
│       ├── retry.py             # Async retry with exponential backoff decorator
│       └── validators.py        # Input length + prompt injection detection
└── frontend/
    ├── app/
    │   └── page.tsx             # Entry point — auth guard + layout
    ├── components/
    │   ├── chat/                # ChatWindow, MessageBubble, ChatInput
    │   ├── agent/               # StepTracker, ToolBadge
    │   ├── layout/              # Navbar, Sidebar
    │   └── ui/                  # Spinner, Badge (atoms)
    ├── hooks/
    │   ├── useAuth.ts           # Login, register, logout, localStorage
    │   ├── useSessions.ts       # Session CRUD, active session state
    │   └── useAgent.ts          # Send message, load history, status tracking
    ├── lib/
    │   └── api.ts               # All API calls centralized (authApi, sessionApi, agentApi)
    └── types/
        └── index.ts             # All TypeScript interfaces in one place
```

## How It Works
```
User Message
     ↓
Input Validation (length check + injection detection)
     ↓
Load Session History from SQLite
     ↓
Agent Brain — LLM decides: tool needed or direct answer?
     ↓
Tool Execution (with retry on failure)
     ↓
LLM synthesizes tool result into final answer
     ↓
Save messages to DB (user + assistant)
     ↓
Return answer + reasoning steps + tools used
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Create account | No |
| POST | `/api/v1/auth/login` | Login → JWT token | No |
| POST | `/api/v1/sessions/` | Create chat session | Yes |
| GET | `/api/v1/sessions/` | List all sessions | Yes |
| GET | `/api/v1/sessions/{id}/messages` | Get chat history | Yes |
| DELETE | `/api/v1/sessions/{id}` | Delete session | Yes |
| POST | `/api/v1/agent/chat/{session_id}` | Send message to agent | Yes |
| GET | `/api/v1/agent/tools` | List available tools | No |
| GET | `/api/v1/health` | Detailed health check | No |

## How to Run

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API key — free at [console.groq.com](https://console.groq.com)

### 1. Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `.env`:
```
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.1-8b-instant
USE_GROQ=true
SECRET_KEY=your-secret-key-here
```
```bash
uvicorn main:app --reload --port 8000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. API Docs
Open [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)

## Example Queries

- *"What are the latest developments in AI agents?"*
- *"Search gold price in India and calculate cost of 100 grams"*
- *"How many days since I started my job on 2024-06-01?"*
- *"What is 18% GST on ₹85,000?"*
- *"What is the weather in Bangalore today?"*
- *"What day of the week is March 15, 2025?"*