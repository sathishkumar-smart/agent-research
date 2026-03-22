"use client";
import { AgentStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface NavbarProps {
  status: AgentStatus;
  messageCount: number;
  onClear: () => void;
}

const statusBadge: Record<AgentStatus, { label: string; variant: "success" | "warning" | "info" | "purple" | "default" }> = {
  idle: { label: "Ready", variant: "success" },
  thinking: { label: "Thinking", variant: "purple" },
  searching: { label: "Searching", variant: "info" },
  calculating: { label: "Calculating", variant: "warning" },
  answering: { label: "Answering", variant: "warning" },
};

export function Navbar({ status, messageCount, onClear }: NavbarProps) {
  const badge = statusBadge[status];
  return (
    <nav className="border-b border-gray-800 px-6 py-3 flex items-center justify-between bg-gray-900 shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-white">🤖 Research Agent</span>
        <Badge label="v1.0" variant="default" />
        <Badge label={badge.label} variant={badge.variant} />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500">
          {messageCount} message{messageCount !== 1 ? "s" : ""}
        </span>
        {messageCount > 0 && (
          <button
            onClick={onClear}
            className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition text-gray-300">
            Clear Chat
          </button>
        )}
      </div>
    </nav>
  );
}
