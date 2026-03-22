import { Message } from "@/types";
import { StepTracker } from "@/components/agent/StepTracker";
import { ToolBadge } from "@/components/agent/ToolBadge";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-end gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>

        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
          ${isUser
            ? "bg-blue-600"
            : "bg-gradient-to-br from-purple-600 to-indigo-700"
          }`}>
          {isUser ? "You" : "AI"}
        </div>

        {/* Bubble */}
        <div className="flex flex-col gap-1">
          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
            ${isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700"
            }`}>
            {message.content}
          </div>

          {/* Tools used badges */}
          {!isUser && message.toolsUsed && message.toolsUsed.length > 0 && (
            <div className="flex gap-1 flex-wrap px-1">
              {message.toolsUsed.map((tool, i) => (
                <ToolBadge key={i} toolName={tool} />
              ))}
            </div>
          )}

          {/* Step tracker */}
          {!isUser && message.steps && (
            <StepTracker steps={message.steps} />
          )}

          {/* Timestamp */}
          <p className={`text-xs text-gray-600 px-1 ${isUser ? "text-right" : "text-left"}`}>
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    </div>
  );
}
