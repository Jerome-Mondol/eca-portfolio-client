"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { loginApi, registerApi, logoutApi, meApi, handleGlobalLogout, isLoggingOut, type User } from "@/lib/api";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { fullName: string; email: string; username: string; password: string; confirmPassword: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    // Don't try to refresh if we're in the middle of logging out
    if (isLoggingOut()) {
      setUser(null);
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("folio_access") : null;
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const data = await meApi();
      setUser(data.user);
      localStorage.setItem("folio_user", JSON.stringify(data.user));
    } catch {
      // apiFetch already handles 401 -> handleGlobalLogout internally
      // Just clear user state here, don't call handleGlobalLogout again
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleLogoutEvent = () => {
      setUser(null);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("auth:logout", handleLogoutEvent);
    }
    const cached = typeof window !== "undefined" ? localStorage.getItem("folio_user") : null;
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {}
    }
    refreshUser().finally(() => setLoading(false));

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:logout", handleLogoutEvent);
      }
    };
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      setUser(data.user);
      // Prefetch for near-instant navigation — warms client + server Redis cache
      import("@/lib/api").then(({ prefetchAll }) => prefetchAll());
    } catch (e: any) {
      setError(e.message ?? "Login failed");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { fullName: string; email: string; username: string; password: string; confirmPassword: string }) => {
    setError(null);
    setLoading(true);
    try {
      const res = await registerApi(data);
      setUser(res.user);
      import("@/lib/api").then(({ prefetchAll }) => prefetchAll());
    } catch (e: any) {
      setError(e.message ?? "Registration failed");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, error, login, register, logout, refreshUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
