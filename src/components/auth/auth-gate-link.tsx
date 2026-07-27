"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";

interface AuthGateLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  /** Prefer signup for new users from marketing CTAs */
  preferSignup?: boolean;
}

/**
 * Sends guests to sign in/up with a return URL; signed-in users go straight through.
 */
export function AuthGateLink({
  href,
  children,
  className,
  onClick,
  preferSignup = false,
}: AuthGateLinkProps) {
  const { user, ready } = useAuth();
  const gatePath = preferSignup ? "/signup" : "/login";
  const target =
    ready && !user
      ? `${gatePath}?next=${encodeURIComponent(href)}`
      : href;

  return (
    <Link href={target} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
