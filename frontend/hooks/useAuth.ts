"use client";
import { useState, useCallback } from "react";
import { authApi } from "@/lib/api";

interface AuthState {
  token: string;
  username: string;
}

const STORAGE_KEY = "agent_auth";

function loadAuth(): AuthState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveAuth(auth: AuthState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState | null>(() => {
    if (typeof window !== "undefined") return loadAuth();
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(username, password);
      const authData = { token: data.access_token, username: data.username };
      setAuth(authData);
      saveAuth(authData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.register(username, email, password);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuth(null);
  }, []);

  return {
    token: auth?.token || "",
    username: auth?.username || "",
    isAuthenticated: !!auth?.token,
    loading,
    error,
    login,
    register,
    logout,
    setError,
  };
}
