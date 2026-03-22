"use client";
import { useState, useCallback, useEffect } from "react";
import { sessionApi } from "@/lib/api";

export interface Session {
  id: string;
  title: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export function useSessions(token: string) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
    if (!token) return;
    try {
      const data = await sessionApi.list(token);
      setSessions(data);
    } catch {
      setSessions([]);
    }
  }, [token]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const createSession = useCallback(async (title: string = "New Chat") => {
    if (!token) return null;
    setLoading(true);
    try {
      const session = await sessionApi.create(token, title);
      setSessions(prev => [session, ...prev]);
      setActiveSession(session);
      return session;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteSession = useCallback(async (sessionId: string) => {
    if (!token) return;
    try {
      await sessionApi.delete(token, sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSession?.id === sessionId) {
        setActiveSession(null);
      }
    } catch {
      // ignore
    }
  }, [token, activeSession]);

  const refreshSessions = useCallback(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    activeSession,
    setActiveSession,
    createSession,
    deleteSession,
    refreshSessions,
    loading,
  };
}
