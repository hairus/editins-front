"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { currentUser, logout as logoutRequest, type AuthUser } from "@/lib/api/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setLoading] = useState(true);
  const hasBooted = useRef(false);

  const refreshUser = useCallback(async () => {
    if (!hasBooted.current) {
      setLoading(true);
    }

    try {
      const nextUser = await currentUser();
      setUser(nextUser);
      return nextUser;
    } finally {
      setLoading(false);
      hasBooted.current = true;
    }
  }, []);

  useEffect(() => {
    const referralCode = new URLSearchParams(window.location.search).get("ref");

    if (referralCode) {
      window.localStorage.setItem("editins_ref", referralCode);
    }

    refreshUser().catch(() => {
      setUser(null);
      setLoading(false);
    });
  }, [refreshUser]);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      refreshUser,
      setUser,
      logout,
    }),
    [isLoading, logout, refreshUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
