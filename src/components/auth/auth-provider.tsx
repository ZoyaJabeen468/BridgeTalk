"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PublicUser, UserProfile } from "@/types/auth";
import {
  getCurrentUser,
  signIn as storageSignIn,
  signOut as storageSignOut,
  signUp as storageSignUp,
  updateProfile as storageUpdateProfile,
} from "@/lib/auth-storage";

interface AuthContextValue {
  user: PublicUser | null;
  ready: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  signOut: () => void;
  updateProfile: (
    updates: Partial<Pick<UserProfile, "name" | "bio" | "preferredTone">>
  ) => { ok: true; user: PublicUser } | { ok: false; error: string };
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      refresh,
      async signIn(email, password) {
        const result = await storageSignIn({ email, password });
        if ("error" in result) return { ok: false, error: result.error };
        setUser(result.user);
        return { ok: true };
      },
      async signUp(name, email, password) {
        const result = await storageSignUp({ name, email, password });
        if ("error" in result) return { ok: false, error: result.error };
        setUser(result.user);
        return { ok: true };
      },
      signOut() {
        storageSignOut();
        setUser(null);
      },
      updateProfile(updates) {
        const result = storageUpdateProfile(updates);
        if ("error" in result) return { ok: false, error: result.error };
        setUser(result);
        return { ok: true, user: result };
      },
    }),
    [user, ready, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
