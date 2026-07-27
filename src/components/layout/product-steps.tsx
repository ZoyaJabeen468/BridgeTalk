import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductStep {
  label: string;
  description?: string;
}

interface ProductStepsProps {
  steps: ProductStep[];
  currentStep: number;
  className?: string;
}

/**
 * Horizontal step indicator for the product flow
 * (Share details -> Generate -> Result).
 */
export function ProductSteps({ steps, currentStep, className }: ProductStepsProps) {
  return (
    <ol className={cn("flex w-full items-start", className)}>
      {steps.map((step, index) => {
        const state =
          index < currentStep ? "done" : index === currentStep ? "current" : "upcoming";
        const isLast = index === steps.length - 1;

        return (
          <li key={step.label} className={cn("flex flex-col", isLast ? "shrink-0" : "flex-1")}>
            <div className="flex items-center">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                  state === "done" && "border-forest bg-forest text-white",
                  state === "current" &&
                    "border-forest bg-white text-forest ring-4 ring-forest/12",
                  state === "upcoming" && "border-border bg-white text-ink-subtle"
                )}
              >
                {state === "done" ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              {!isLast ? (
                <span
                  className={cn(
                    "mx-2 h-px flex-1 transition-colors sm:mx-3",
                    state === "done" ? "bg-forest" : "bg-border"
                  )}
                  aria-hidden
                />
              ) : null}
            </div>
            <div className="mt-2 max-w-[9rem]">
              <p
                className={cn(
                  "text-xs font-medium sm:text-sm",
                  state === "upcoming" ? "text-ink-subtle" : "text-ink"
                )}
              >
                {step.label}
              </p>
              {step.description ? (
                <p className="hidden text-xs text-ink-subtle sm:block">
                  {step.description}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
