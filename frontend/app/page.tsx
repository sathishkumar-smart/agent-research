"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSessions } from "@/hooks/useSessions";
import { useAgent } from "@/hooks/useAgent";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatInput } from "@/components/chat/ChatInput";
import { Spinner } from "@/components/ui/Spinner";

// ── Auth Screen ──
function AuthScreen({ onSuccess }: { onSuccess: () => void }) {
  const { login, register, loading, error, setError } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async () => {
    setSuccessMsg("");
    if (mode === "login") {
      const ok = await login(form.username, form.password);
      if (ok) onSuccess();
    } else {
      const ok = await register(form.username, form.email, form.password);
      if (ok) {
        setSuccessMsg("✅ Registered! Please login.");
        setMode("login");
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">🤖 Research Agent</h1>
          <p className="text-gray-400 mt-2 text-sm">
            AI-powered research with real-time tools
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 bg-gray-800 p-1 rounded-xl">
            {(["login", "register"] as const).map(m => (
              <button key={m}
                onClick={() => { setMode(m); setError(null); setSuccessMsg(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                  ${mode === m ? "bg-blue-600 text-white shadow" : "text-gray-400 hover:text-white"}`}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {mode === "register" && (
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-500 text-sm">✉️</span>
                <input type="email" placeholder="Email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" />
              </div>
            )}
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-500 text-sm">👤</span>
              <input type="text" placeholder="Username"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-500 text-sm">🔒</span>
              <input type="password" placeholder="Password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" />
            </div>
          </div>

          {(error || successMsg) && (
            <p className={`text-sm mt-3 px-3 py-2 rounded-lg ${
              successMsg ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
            }`}>
              {successMsg || error}
            </p>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2">
            {loading && <Spinner size="sm" />}
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          FastAPI · Groq (Llama 3.1) · JWT Auth · Session History
        </p>
      </div>
    </main>
  );
}

// ── Sessions Sidebar ──
function SessionsSidebar({
  sessions, activeSessionId, onSelect, onCreate, onDelete, loading
}: {
  sessions: { id: string; title: string; message_count: number; updated_at: string }[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  return (
    <div className="w-64 border-r border-gray-800 bg-gray-900 flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sessions</h2>
          <button onClick={onCreate} disabled={loading}
            className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-40 px-3 py-1.5 rounded-lg text-white font-semibold transition">
            {loading ? <Spinner size="sm" /> : "+ New"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-xs text-gray-500">No sessions yet</p>
            <p className="text-xs text-gray-600 mt-1">Click + New to start</p>
          </div>
        )}
        {sessions.map(session => (
          <div key={session.id}
            onClick={() => onSelect(session.id)}
            className={`group relative p-3 rounded-xl cursor-pointer transition border
              ${activeSessionId === session.id
                ? "bg-blue-600 border-blue-500"
                : "bg-gray-800 hover:bg-gray-750 border-gray-700"}`}>
            <p className="text-sm font-medium truncate pr-5">{session.title}</p>
            <p className={`text-xs mt-0.5 ${activeSessionId === session.id ? "text-blue-200" : "text-gray-500"}`}>
              {session.message_count} messages
            </p>
            <button
              onClick={e => { e.stopPropagation(); onDelete(session.id); }}
              className="absolute top-2.5 right-2 text-xs opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition">
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main App ──
export default function Home() {
  const auth = useAuth();
  const [view, setView] = useState<"auth" | "app">(
    auth.isAuthenticated ? "app" : "auth"
  );

  const { sessions, activeSession, setActiveSession, createSession, deleteSession, refreshSessions, loading: sessionsLoading } = useSessions(auth.token);

  const { messages, status, error, tools, currentSteps, sendMessage, clearMessages, isLoading } = useAgent(
    auth.token,
    activeSession?.id || null
  );

  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session);
      clearMessages();
    }
  };

  const handleNewSession = async () => {
    const session = await createSession("New Chat");
    if (session) clearMessages();
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId);
    clearMessages();
  };

  const handleLogout = () => {
    auth.logout();
    setView("auth");
  };

  if (view === "auth") {
    return <AuthScreen onSuccess={() => setView("app")} />;
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar
        status={status}
        messageCount={messages.length}
        onClear={clearMessages}
        username={auth.username}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sessions sidebar */}
        <SessionsSidebar
          sessions={sessions}
          activeSessionId={activeSession?.id || null}
          onSelect={handleSelectSession}
          onCreate={handleNewSession}
          onDelete={handleDeleteSession}
          loading={sessionsLoading}
        />

        {/* Tools + Chat */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {!activeSession ? (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <p className="text-6xl mb-4">🤖</p>
                  <p className="text-xl font-semibold text-gray-300">Welcome, {auth.username}!</p>
                  <p className="text-sm text-gray-500 mt-2">Create a new session to start researching</p>
                  <button onClick={handleNewSession}
                    className="mt-6 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-semibold transition">
                    + Start New Session
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Session header */}
                <div className="border-b border-gray-800 px-6 py-3 bg-gray-900 flex items-center justify-between shrink-0">
                  <div>
                    <p className="text-sm font-semibold">{activeSession.title}</p>
                    <p className="text-xs text-gray-400">{messages.length} messages in this session</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-900/30 border border-green-800 px-3 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-xs text-green-400 font-medium">Active</span>
                  </div>
                </div>
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
              </>
            )}
          </div>

          {/* Tools sidebar */}
          <Sidebar tools={tools} />
        </div>
      </div>
    </main>
  );
}