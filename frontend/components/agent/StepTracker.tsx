"use client";
import { useState } from "react";
import { AgentStep } from "@/types";
import { ToolBadge } from "./ToolBadge";

interface StepTrackerProps {
  steps: AgentStep[];
}

export function StepTracker({ steps }: StepTrackerProps) {
  const [expanded, setExpanded] = useState(false);

  const toolCalls = steps.filter(s => s.type === "tool_call");
  if (toolCalls.length === 0) return null;

  return (
    <div className="mt-2 border border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-800/50 hover:bg-gray-800 transition text-xs text-gray-400"
      >
        <div className="flex items-center gap-2">
          <span>⚡</span>
          <span>Agent used {toolCalls.length} tool{toolCalls.length > 1 ? "s" : ""}</span>
          <div className="flex gap-1">
            {toolCalls.map((s, i) => s.tool && <ToolBadge key={i} toolName={s.tool} />)}
          </div>
        </div>
        <span>{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="divide-y divide-gray-800">
          {steps.map((step, i) => (
            <div key={i} className="px-3 py-2 bg-gray-900/50">
              {step.type === "thinking" && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">🧠 Thinking</p>
                  <p className="text-xs text-gray-400 font-mono bg-gray-800 px-2 py-1 rounded">
                    {step.content}
                  </p>
                </div>
              )}
              {step.type === "tool_call" && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs text-gray-500">Tool Called:</p>
                    {step.tool && <ToolBadge toolName={step.tool} />}
                    {step.params && Object.keys(step.params).length > 0 && (
                      <span className="text-xs text-gray-600 font-mono">
                        ({JSON.stringify(step.params)})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded line-clamp-3">
                    {step.result}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
