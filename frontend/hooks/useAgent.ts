"use client";
import { useState, useCallback, useEffect } from "react";
import { Message, AgentStep, AgentStatus, Tool } from "@/types";
import { agentApi } from "@/lib/api";
import { v4 as uuidv4 } from "uuid";

export function useAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [currentSteps, setCurrentSteps] = useState<AgentStep[]>([]);

  // Load available tools on mount
  useEffect(() => {
    agentApi.getTools()
      .then(data => setTools(data.tools))
      .catch(() => setTools([]));
  }, []);

  const getStatusFromTools = (toolsUsed: string[]): AgentStatus => {
    if (toolsUsed.includes("search_web")) return "searching";
    if (toolsUsed.includes("calculate")) return "calculating";
    return "answering";
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || status !== "idle") return;

    setError(null);
    setCurrentSteps([]);

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setStatus("thinking");

    // Build history for API
    const history = messages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await agentApi.chat({
        message: content,
        history,
      });

      setCurrentSteps(response.steps);
      setStatus(getStatusFromTools(response.tools_used));

      // Small delay to show status
      await new Promise(r => setTimeout(r, 500));

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
    } finally {
      setStatus("idle");
      setCurrentSteps([]);
    }
  }, [messages, status]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setCurrentSteps([]);
    setStatus("idle");
  }, []);

  return {
    messages,
    status,
    error,
    tools,
    currentSteps,
    sendMessage,
    clearChat,
    isLoading: status !== "idle",
  };
}
