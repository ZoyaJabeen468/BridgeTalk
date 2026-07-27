"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, UserRound, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/constants/navigation";
import { useScrolled } from "@/hooks/use-scrolled";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Logo, LogoMark } from "@/components/brand/logo";
import { siteConfig } from "@/constants/site";

export function Navbar() {
  const scrolled = useScrolled(24);
  const pathname = usePathname();
  const { user, ready } = useAuth();
  const [open, setOpen] = useState(false);
  const overHero = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full transition-[background-color,border-color,box-shadow] duration-300 print:hidden",
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border/80 bg-canvas/90 shadow-subtle backdrop-blur-md"
      )}
    >
      <Container className="flex h-16 items-center justify-between lg:h-[4.25rem]">
        {overHero ? (
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2.5 rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label={siteConfig.name}
          >
            <LogoMark className="rounded-sm shadow-none ring-1 ring-white/20" />
            <span className="font-sans text-[15px] font-semibold tracking-tight text-white">
              {siteConfig.name}
            </span>
          </Link>
        ) : (
          <Logo onClick={() => setOpen(false)} />
        )}

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-sm px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2",
                overHero
                  ? "text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-white/40"
                  : "text-ink-muted hover:bg-warm-100 hover:text-ink focus-visible:ring-forest/40"
              )}
            >
              {link.label}
            </Link>
          ))}

          {ready && user ? (
            <>
              <Button
                asChild
                size="sm"
                className={cn(
                  "ml-2",
                  overHero &&
                    "bg-white text-forest shadow-subtle hover:bg-warm-50 hover:shadow-card active:bg-warm-100"
                )}
              >
                <Link href="/generate">Prepare conversation</Link>
              </Button>
              <Link
                href="/profile"
                className={cn(
                  "ml-1 inline-flex h-9 items-center gap-2 rounded-sm px-2.5 text-sm font-medium transition-colors",
                  overHero
                    ? "text-white hover:bg-white/10"
                    : "text-ink hover:bg-warm-100"
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold",
                    overHero
                      ? "bg-white/20 text-white"
                      : "bg-forest text-white"
                  )}
                >
                  {user.name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase() ?? "")
                    .join("") || "BT"}
                </span>
                <span className="max-w-[7rem] truncate">{user.name.split(" ")[0]}</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "ml-2 rounded-sm px-3 py-2 text-sm transition-colors",
                  overHero
                    ? "text-white/80 hover:bg-white/10 hover:text-white"
                    : "text-ink-muted hover:bg-warm-100 hover:text-ink"
                )}
              >
                Sign in
              </Link>
              <Button
                asChild
                size="sm"
                className={cn(
                  "ml-1",
                  overHero &&
                    "bg-white text-forest shadow-subtle hover:bg-warm-50 hover:shadow-card active:bg-warm-100"
                )}
              >
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </nav>

        <button
          type="button"
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-sm md:hidden focus-visible:outline-none focus-visible:ring-2",
            overHero
              ? "text-white focus-visible:ring-white/40"
              : "text-ink focus-visible:ring-forest/40"
          )}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 bg-canvas/95 backdrop-blur-md transition-all duration-300 md:hidden",
          open ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0 border-transparent"
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-surface hover:text-ink"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {ready && user ? (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-sm px-3 py-2.5 text-sm text-ink hover:bg-surface"
                onClick={() => setOpen(false)}
              >
                <UserRound className="h-4 w-4 text-forest" />
                Profile
              </Link>
              <Button asChild className="mt-2 w-full">
                <Link href="/generate" onClick={() => setOpen(false)}>
                  Prepare conversation
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="secondary" className="mt-2 w-full">
                <Link href="/login" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/signup" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </Container>
      </div>
    </header>
  );
}
