import { cn } from "@/lib/utils";

interface ProductFrameProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * A window-like chrome used to present product output (sample packs,
 * generated results) as a tangible artifact rather than a plain card.
 */
export function ProductFrame({ title, className, children }: ProductFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-[0_1px_2px_rgba(24,24,27,0.04),0_16px_40px_-20px_rgba(24,24,27,0.25)]",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-border bg-canvas-muted/60 px-5 py-3.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5928c]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e3c17f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#8fbd93]" />
        </div>
        {title ? (
          <p className="flex-1 truncate text-center text-xs font-medium text-ink-subtle">
            {title}
          </p>
        ) : (
          <span className="flex-1" />
        )}
        <span className="w-[54px]" aria-hidden />
      </div>
      {children}
    </div>
  );
}
