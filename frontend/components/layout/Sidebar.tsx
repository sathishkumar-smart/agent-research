"use client";
import { Tool } from "@/types";
import { ToolBadge } from "@/components/agent/ToolBadge";

interface SidebarProps {
  tools: Tool[];
}

const EXAMPLE_QUERIES = [
  "What are the latest AI news today?",
  "What is the weather in Mumbai?",
  "Calculate compound interest: 100000 * (1 + 0.08) ** 5",
  "Search gold price in India and calculate cost of 10 grams",
  "What day of the week is today?",
  "Search latest cricket scores",
];

export function Sidebar({ tools }: SidebarProps) {
  return (
    <aside className="w-72 border-r border-gray-800 bg-gray-900 flex flex-col overflow-y-auto shrink-0">

      {/* Tools Section */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Available Tools
        </h2>
        <div className="space-y-3">
          {tools.map(tool => (
            <div key={tool.name} className="bg-gray-800 rounded-xl p-3 border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <ToolBadge toolName={tool.name} />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {tool.description}
              </p>
              {tool.params !== "none" && (
                <p className="text-xs text-gray-600 mt-1 font-mono">
                  params: {tool.params}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Example Queries */}
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Example Queries
        </h2>
        <div className="space-y-2">
          {EXAMPLE_QUERIES.map((q, i) => (
            <div key={i}
              className="text-xs text-gray-400 bg-gray-800 hover:bg-gray-750 border border-gray-700 
                rounded-lg p-2.5 cursor-default leading-relaxed">
              💬 {q}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-gray-800">
        <p className="text-xs text-gray-600 text-center">
          Powered by Groq · Llama 3.1 · DuckDuckGo
        </p>
      </div>
    </aside>
  );
}
