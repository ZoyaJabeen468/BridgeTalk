import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "center" | "left";
  children?: React.ReactNode;
}

/**
 * Consistent top-of-page header for internal product pages
 * (/generate, /result, /about) — distinct from the marketing
 * SectionHeader used on the landing page.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  align = "center",
  children,
}: PageHeaderProps) {
  return (
    <div className={cn("border-b border-border bg-canvas-muted/40 pt-28 pb-10 sm:pt-32 sm:pb-14", className)}>
      <Container>
        <div className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl")}>
          {eyebrow ? (
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-forest">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={cn(
              "text-3xl font-semibold tracking-tight text-ink sm:text-4xl",
              eyebrow && "mt-3"
            )}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </Container>
    </div>
  );
}
