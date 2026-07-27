import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  muted?: boolean;
  containerClassName?: string;
}

export function Section({
  id,
  muted,
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-20 sm:py-28", muted && "bg-canvas-muted/40", className)}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "center" | "left";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-forest">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-3xl font-semibold tracking-tight text-ink sm:text-4xl",
          eyebrow && "mt-3"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
