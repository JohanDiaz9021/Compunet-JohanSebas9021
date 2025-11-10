"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { apiLogin, apiGetUser } from "./api";
import { LoginRequest, User } from "./types";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  login: (cred: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  ready: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "eventapp_token";
const USER_ID_KEY = "eventapp_user_id";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const uid = localStorage.getItem(USER_ID_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (t) setToken(t);
    if (t && uid) {
      apiGetUser(uid, t).then(setUser).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  const login = useCallback(async (cred: LoginRequest) => {
    setError(null);
    try {
      const res = await apiLogin(cred);
      setToken(res.token);
      localStorage.setItem(TOKEN_KEY, res.token);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem(USER_ID_KEY, res.user.userId);
      }
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "message" in e ? String((e as any).message) : "Login failed";
      setError(msg);
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token || !user) return;
    try {
      const latest = await apiGetUser(user.userId, token);
      setUser(latest);
    } catch {
      // silent
    }
  }, [token, user]);

  const value: AuthContextValue = { token, user, login, logout, refreshUser, ready, error };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
