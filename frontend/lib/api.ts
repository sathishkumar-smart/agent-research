import { ChatRequest, ChatResponse, ToolsResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const agentApi = {
  chat: async (request: ChatRequest): Promise<ChatResponse> => {
    const res = await fetch(`${BASE_URL}/agent/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleResponse<ChatResponse>(res);
  },

  getTools: async (): Promise<ToolsResponse> => {
    const res = await fetch(`${BASE_URL}/agent/tools`);
    return handleResponse<ToolsResponse>(res);
  },

  healthCheck: async (): Promise<{ status: string; model: string }> => {
    const res = await fetch(`${BASE_URL}/`);
    return handleResponse(res);
  },
};
