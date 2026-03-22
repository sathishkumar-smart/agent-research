"use client";
import { useState, useCallback, useEffect } from "react";
import { Message, AgentStep, AgentStatus, Tool } from "@/types";
import { agentApi, sessionApi } from "@/lib/api";
import { v4 as uuidv4 } from "uuid";

export function useAgent(token: string, sessionId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [currentSteps, setCurrentSteps] = useState<AgentStep[]>([]);

  // Load tools
  useEffect(() => {
    agentApi.getTools()
      .then(data => setTools(data.tools))
      .catch(() => setTools([]));
  }, []);

  // Load messages when session changes
  useEffect(() => {
    if (!token || !sessionId) {
      setMessages([]);
      return;
    }
    sessionApi.getMessages(token, sessionId).then(dbMessages => {
      const loaded: Message[] = dbMessages.map(m => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        timestamp: new Date(m.created_at),
        toolsUsed: m.tools_used ? m.tools_used.split(",").filter(Boolean) : [],
      }));
      setMessages(loaded);
    }).catch(() => setMessages([]));
  }, [token, sessionId]);

  const getStatusFromTools = (toolsUsed: string[]): AgentStatus => {
    if (toolsUsed.includes("search_web")) return "searching";
    if (toolsUsed.includes("calculate")) return "calculating";
    return "answering";
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || status !== "idle" || !sessionId) return;

    setError(null);
    setCurrentSteps([]);

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setStatus("thinking");

    try {
      const response = await agentApi.chat(token, sessionId, { message: content, history: [] });
      setCurrentSteps(response.steps);
      setStatus(getStatusFromTools(response.tools_used));
      await new Promise(r => setTimeout(r, 400));

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
        steps: response.steps,
        toolsUsed: response.tools_used,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setStatus("idle");
      setCurrentSteps([]);
    }
  }, [token, sessionId, status]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    status,
    error,
    tools,
    currentSteps,
    sendMessage,
    clearMessages,
    isLoading: status !== "idle",
  };
}
