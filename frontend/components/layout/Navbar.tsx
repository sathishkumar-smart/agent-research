"use client";
import { AgentStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface NavbarProps {
  status: AgentStatus;
  messageCount: number;
  onClear: () => void;
  username: string;
  onLogout: () => void;
}

const statusBadge: Record<AgentStatus, { label: string; variant: "success" | "warning" | "info" | "purple" | "default" }> = {
  idle: { label: "Ready", variant: "success" },
  thinking: { label: "Thinking", variant: "purple" },
  searching: { label: "Searching", variant: "info" },
  calculating: { label: "Calculating", variant: "warning" },
  answering: { label: "Answering", variant: "warning" },
};

export function Navbar({ status, messageCount, onClear, username, onLogout }: NavbarProps) {
  const badge = statusBadge[status];
  return (
    <nav className="border-b border-gray-800 px-6 py-3 flex items-center justify-between bg-gray-900 shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-white">🤖 Research Agent</span>
        <Badge label="v1.0" variant="default" />
        <Badge label={badge.label} variant={badge.variant} />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">👤 {username}</span>
        </div>
        {messageCount > 0 && (
          <button onClick={onClear}
            className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition text-gray-300">
            Clear
          </button>
        )}
        <button onClick={onLogout}
          className="text-sm bg-red-900/40 hover:bg-red-900/60 border border-red-800 px-4 py-2 rounded-lg transition text-red-400">
          Logout
        </button>
      </div>
    </nav>
  );
}