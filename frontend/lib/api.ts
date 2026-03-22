import { ChatRequest, ChatResponse, ToolsResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const API_PREFIX = `${BASE_URL}/api/v1`;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const authApi = {
  register: async (username: string, email: string, password: string) => {
    const res = await fetch(`${API_PREFIX}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse<{ id: string; username: string; email: string }>(res);
  },

  login: async (username: string, password: string) => {
    const res = await fetch(`${API_PREFIX}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse<{ access_token: string; username: string }>(res);
  },
};

export const sessionApi = {
  create: async (token: string, title: string = "New Chat") => {
    const res = await fetch(`${API_PREFIX}/sessions/?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    return handleResponse<{ id: string; title: string; message_count: number; created_at: string; updated_at: string }>(res);
  },

  list: async (token: string) => {
    const res = await fetch(`${API_PREFIX}/sessions/?token=${token}`);
    return handleResponse<{ id: string; title: string; message_count: number; created_at: string; updated_at: string }[]>(res);
  },

  getMessages: async (token: string, sessionId: string) => {
    const res = await fetch(`${API_PREFIX}/sessions/${sessionId}/messages?token=${token}`);
    return handleResponse<{ id: string; role: string; content: string; tools_used: string; created_at: string }[]>(res);
  },

  delete: async (token: string, sessionId: string) => {
    const res = await fetch(`${API_PREFIX}/sessions/${sessionId}?token=${token}`, {
      method: "DELETE",
    });
    return handleResponse<{ message: string }>(res);
  },
};

export const agentApi = {
  chat: async (token: string, sessionId: string, request: ChatRequest): Promise<ChatResponse> => {
    const res = await fetch(`${API_PREFIX}/agent/chat/${sessionId}?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleResponse<ChatResponse>(res);
  },

  getTools: async (): Promise<ToolsResponse> => {
    const res = await fetch(`${API_PREFIX}/agent/tools`);
    return handleResponse<ToolsResponse>(res);
  },
};