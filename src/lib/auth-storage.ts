import type { AuthSession, PublicUser, UserProfile } from "@/types/auth";

const USERS_KEY = "bridgetalk:users";
const SESSION_KEY = "bridgetalk:session";

function safeLocal(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const probe = "__bridgetalk_auth_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return undefined;
  }
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`bridgetalk:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function readUsers(): UserProfile[] {
  const storage = safeLocal();
  if (!storage) return [];
  try {
    const raw = storage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UserProfile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: UserProfile[]): void {
  const storage = safeLocal();
  if (!storage) return;
  storage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublic(user: UserProfile): PublicUser {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

export function getSession(): AuthSession | null {
  const storage = safeLocal();
  if (!storage) return null;
  try {
    const raw = storage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function setSession(session: AuthSession | null): void {
  const storage = safeLocal();
  if (!storage) return;
  if (!session) {
    storage.removeItem(SESSION_KEY);
    return;
  }
  storage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getCurrentUser(): PublicUser | null {
  const session = getSession();
  if (!session) return null;
  const user = readUsers().find((item) => item.id === session.userId);
  return user ? toPublic(user) : null;
}

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: PublicUser } | { error: string }> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (name.length < 2) return { error: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (password.length < 6) {
    return { error: "Password should be at least 6 characters." };
  }

  const users = readUsers();
  if (users.some((user) => user.email === email)) {
    return { error: "An account with this email already exists." };
  }

  const user: UserProfile = {
    id: `user_${Date.now()}`,
    name,
    email,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
    preferredTone: "calm",
  };

  writeUsers([...users, user]);
  setSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    signedInAt: new Date().toISOString(),
  });

  return { user: toPublic(user) };
}

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<{ user: PublicUser } | { error: string }> {
  const email = input.email.trim().toLowerCase();
  const users = readUsers();
  const user = users.find((item) => item.email === email);
  if (!user) return { error: "No account found with that email." };

  const hash = await hashPassword(input.password);
  if (hash !== user.passwordHash) {
    return { error: "Incorrect password. Try again." };
  }

  setSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    signedInAt: new Date().toISOString(),
  });

  return { user: toPublic(user) };
}

export function signOut(): void {
  setSession(null);
}

export function updateProfile(
  updates: Partial<Pick<UserProfile, "name" | "bio" | "preferredTone">>
): PublicUser | { error: string } {
  const session = getSession();
  if (!session) return { error: "Please sign in first." };

  const users = readUsers();
  const index = users.findIndex((item) => item.id === session.userId);
  if (index < 0) return { error: "Account not found." };

  const current = users[index];
  if (!current) return { error: "Account not found." };

  const next: UserProfile = {
    ...current,
    name: updates.name?.trim() || current.name,
    bio: updates.bio?.trim() ?? current.bio,
    preferredTone: updates.preferredTone ?? current.preferredTone,
  };

  users[index] = next;
  writeUsers(users);
  setSession({
    ...session,
    name: next.name,
  });

  return toPublic(next);
}
