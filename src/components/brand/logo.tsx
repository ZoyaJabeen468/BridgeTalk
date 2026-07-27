import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/constants/site";

interface LogoMarkProps {
  className?: string;
}

/**
 * The standalone icon mark: two arcs reaching toward each other over a
 * shared point, representing a bridge between two people. Colors are
 * fixed (forest badge, white glyph) so it reads the same over photos,
 * dark sections, and light surfaces.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest shadow-sm",
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-[18px] w-[18px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 16c2.5-6 6-9 9-9s6.5 3 9 9"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 16h18"
          stroke="white"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="6.2" cy="16" r="1.4" fill="white" />
        <circle cx="17.8" cy="16" r="1.4" fill="white" />
      </svg>
    </span>
  );
}

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

/**
 * Full wordmark: icon mark + product name. Used wherever the surrounding
 * area is a light surface (navbar when scrolled, footer, page headers).
 */
export function Logo({ className, onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40",
        className
      )}
      aria-label={siteConfig.name}
    >
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight text-ink">
        {siteConfig.name}
      </span>
    </Link>
  );
}
