"use client";
import { useAgent } from "@/hooks/useAgent";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatInput } from "@/components/chat/ChatInput";

export default function Home() {
  const {
    messages,
    status,
    error,
    tools,
    currentSteps,
    sendMessage,
    clearChat,
    isLoading,
  } = useAgent();

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar
        status={status}
        messageCount={messages.length}
        onClear={clearChat}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar tools={tools} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatWindow
            messages={messages}
            status={status}
            currentSteps={currentSteps}
            error={error}
          />
          <ChatInput
            onSend={sendMessage}
            status={status}
            disabled={isLoading}
          />
        </div>
      </div>
    </main>
  );
}
