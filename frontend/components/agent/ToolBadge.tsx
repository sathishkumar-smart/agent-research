interface ToolBadgeProps {
  toolName: string;
}

const toolConfig: Record<string, { icon: string; label: string; color: string }> = {
  search_web: { icon: "🔍", label: "Web Search", color: "bg-blue-900/40 text-blue-400 border border-blue-800" },
  calculate: { icon: "🧮", label: "Calculator", color: "bg-green-900/40 text-green-400 border border-green-800" },
  get_datetime: { icon: "🕐", label: "Date & Time", color: "bg-purple-900/40 text-purple-400 border border-purple-800" },
  get_weather: { icon: "🌤️", label: "Weather", color: "bg-yellow-900/40 text-yellow-400 border border-yellow-800" },
};

export function ToolBadge({ toolName }: ToolBadgeProps) {
  const config = toolConfig[toolName] || { icon: "🔧", label: toolName, color: "bg-gray-700 text-gray-300" };
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
}
