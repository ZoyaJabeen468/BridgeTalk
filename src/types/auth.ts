export interface UserProfile {
  id: string;
  name: string;
  email: string;
  /** SHA-256 hex of password. Local demo auth only. */
  passwordHash: string;
  createdAt: string;
  bio?: string;
  preferredTone?: "calm" | "practical" | "warm";
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  signedInAt: string;
}

export type PublicUser = Omit<UserProfile, "passwordHash">;
