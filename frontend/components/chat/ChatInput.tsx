"use client";
import { useState, KeyboardEvent } from "react";
import { AgentStatus } from "@/types";
import { Spinner } from "@/components/ui/Spinner";

interface ChatInputProps {
  onSend: (message: string) => void;
  status: AgentStatus;
  disabled?: boolean;
}

const statusMessages: Record<AgentStatus, string> = {
  idle: "Ask me anything — I can search the web, calculate, check weather...",
  thinking: "Agent is thinking...",
  searching: "Searching the web...",
  calculating: "Calculating...",
  answering: "Preparing answer...",
};

const statusColors: Record<AgentStatus, string> = {
  idle: "",
  thinking: "border-purple-500",
  searching: "border-blue-500",
  calculating: "border-green-500",
  answering: "border-yellow-500",
};

export function ChatInput({ onSend, status, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const isLoading = status !== "idle";

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-800 p-4 bg-gray-900">
      {/* Status indicator */}
      {isLoading && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <Spinner size="sm" color="#a78bfa" />
          <span className="text-xs text-purple-400">{statusMessages[status]}</span>
        </div>
      )}

      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={statusMessages.idle}
          disabled={isLoading || disabled}
          className={`flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-xl px-4 py-3 
            text-sm outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 
            border transition-colors
            ${isLoading ? statusColors[status] || "border-gray-700" : "border-gray-700"}`}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim() || disabled}
          className="bg-purple-700 hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed 
            px-5 py-3 rounded-xl text-sm font-semibold transition flex items-center gap-2 shrink-0"
        >
          {isLoading ? <Spinner size="sm" /> : "Send →"}
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-2 text-center">
        Powered by Groq (Llama 3.1) · Real-time web search · Multi-step reasoning
      </p>
    </div>
  );
}
