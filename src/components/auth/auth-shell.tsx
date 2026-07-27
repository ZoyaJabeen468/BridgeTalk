"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/brand/logo";
import { siteConfig } from "@/constants/site";

const EASE = [0.22, 1, 0.36, 1] as const;

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

/**
 * Split-panel auth layout: brand story on the left, form on the right.
 */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-forest-900 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(110_151_117_/_0.35),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgb(184_131_63_/_0.18),transparent_50%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <Link
          href="/"
          className="relative z-10 inline-flex items-center gap-2.5 text-white transition-opacity hover:opacity-85"
        >
          <LogoMark className="rounded-sm bg-white/15 shadow-none ring-1 ring-white/20" />
          <span className="font-sans text-[15px] font-semibold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        <motion.div
          className="relative z-10 max-w-md"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <p className="font-display text-4xl leading-[1.1] font-semibold tracking-[-0.03em] text-white xl:text-5xl">
            Prepare hard talks with clearer words.
          </p>
          <p className="mt-5 text-base leading-relaxed text-white/70">
            Calm openers. English and Urdu. Skills that help you stay respectful
            when the room gets quiet.
          </p>
          <ul className="mt-10 space-y-3 text-sm text-white/65">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-300" />
              Private to your browser until you choose a cloud account later
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-300" />
              No pressure to agree. Just better communication
            </li>
          </ul>
        </motion.div>

        <p className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </aside>

      <div className="relative flex flex-col bg-canvas">
        <div className="flex items-center justify-between px-6 py-5 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LogoMark className="rounded-sm" />
            <span className="text-[15px] font-semibold text-ink">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <motion.div
            className="w-full max-w-[420px]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
          >
            <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-[2rem]">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {subtitle}
            </p>

            <div className="mt-8">{children}</div>

            <div className="mt-8 text-center text-sm text-ink-muted">
              {footer}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
