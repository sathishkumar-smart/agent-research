"use client";
import { useEffect, useRef } from "react";
import { Message, AgentStep, AgentStatus } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { Spinner } from "@/components/ui/Spinner";
import { ToolBadge } from "@/components/agent/ToolBadge";

interface ChatWindowProps {
  messages: Message[];
  status: AgentStatus;
  currentSteps: AgentStep[];
  error: string | null;
}

const statusConfig: Record<AgentStatus, { label: string; color: string }> = {
  idle: { label: "", color: "" },
  thinking: { label: "Agent is reasoning...", color: "text-purple-400" },
  searching: { label: "Searching the web...", color: "text-blue-400" },
  calculating: { label: "Calculating...", color: "text-green-400" },
  answering: { label: "Preparing answer...", color: "text-yellow-400" },
};

export function ChatWindow({ messages, status, currentSteps, error }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isLoading = status !== "idle";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, currentSteps]);

  const toolsInProgress = currentSteps
    .filter(s => s.type === "tool_call")
    .map(s => s.tool || "")
    .filter(Boolean);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">

      {/* Empty state */}
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center py-20">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-xl font-semibold text-gray-300 mb-2">Research Agent</h2>
          <p className="text-gray-500 text-sm max-w-md">
            I can search the web, do calculations, check the weather,
            and chain multiple tools together to answer complex questions.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 max-w-lg">
            {[
              { icon: "🔍", text: "What are the latest AI developments?" },
              { icon: "🧮", text: "Calculate 15% tip on ₹2,450" },
              { icon: "🌤️", text: "Weather in Bangalore today?" },
              { icon: "📅", text: "What day is it today?" },
            ].map((s, i) => (
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-left">
                <span className="text-lg">{s.icon}</span>
                <p className="text-xs text-gray-400 mt-1">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex items-end gap-2 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
              AI
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <Spinner size="sm" color="#a78bfa" />
                <span className={`text-xs font-medium ${statusConfig[status].color}`}>
                  {statusConfig[status].label}
                </span>
              </div>
              {toolsInProgress.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {toolsInProgress.map((tool, i) => (
                    <ToolBadge key={i} toolName={tool} />
                  ))}
                </div>
              )}
              {toolsInProgress.length === 0 && (
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex justify-center">
          <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm px-4 py-2 rounded-xl">
            ❌ {error}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
