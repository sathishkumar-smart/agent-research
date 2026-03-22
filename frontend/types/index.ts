export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  steps?: AgentStep[];
  toolsUsed?: string[];
}

export interface AgentStep {
  type: "thinking" | "tool_call" | "answer";
  content: string;
  tool?: string;
  params?: Record<string, unknown>;
  result?: string;
}

export interface ChatRequest {
  message: string;
  history: { role: string; content: string }[];
}

export interface ChatResponse {
  answer: string;
  steps: AgentStep[];
  model: string;
  tools_used: string[];
}

export interface Tool {
  name: string;
  description: string;
  params: string;
  requires_params: boolean;
}

export interface ToolsResponse {
  tools: Tool[];
  total: number;
}

export type AgentStatus =
  | "idle"
  | "thinking"
  | "searching"
  | "calculating"
  | "answering";
