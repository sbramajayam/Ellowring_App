"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "./api";

export type Role = "STUDENT" | "COLLEGE" | "COMPANY" | "TRAINING" | "PARTNER" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: Record<string, string>) => Promise<AuthUser>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "ellowring_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { token: string; user: AuthUser };
        setToken(parsed.token);
        setUser(parsed.user);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (nextToken: string, nextUser: AuthUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ accessToken: string; user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    persist(res.accessToken, res.user);
    return res.user;
  }, []);

  const register = useCallback(async (payload: Record<string, string>) => {
    const res = await api<{ accessToken: string; user: AuthUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    persist(res.accessToken, res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const refresh = useCallback(async () => {
    if (!token) return;
    const me = await api<AuthUser>("/auth/me", { token });
    setUser({ id: me.id, email: me.email, name: me.name, role: me.role });
  }, [token]);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, refresh }),
    [user, token, loading, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function dashboardPath(role: Role) {
  const map: Record<Role, string> = {
    STUDENT: "/dashboard/student/",
    COLLEGE: "/dashboard/college/",
    COMPANY: "/dashboard/hr/",
    TRAINING: "/dashboard/training/",
    PARTNER: "/dashboard/partner/",
    ADMIN: "/dashboard/admin/",
  };
  return map[role];
}
