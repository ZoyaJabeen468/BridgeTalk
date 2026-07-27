"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Gates product pages behind local sign-in / sign-up.
 * Guests are sent to login with a return URL.
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!ready || user) return;
    const query = searchParams.toString();
    const next = `${pathname}${query ? `?${query}` : ""}`;
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [ready, user, router, pathname, searchParams]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6">
        <LoaderCircle className="h-6 w-6 animate-spin text-forest" />
        <p className="text-sm text-ink-muted">Checking your account…</p>
      </div>
    );
  }

  return <>{children}</>;
}
