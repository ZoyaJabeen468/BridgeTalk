"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

const STEPS = [
  "Reading your situation…",
  "Thinking about their perspective…",
  "Drafting a calm opener…",
  "Writing the English explanation…",
  "Preparing the Urdu draft…",
  "Finding safer phrasing…",
];

interface GenerationProgressProps {
  className?: string;
}

/**
 * Shown while the conversation pack is being generated. Cycles through
 * reassuring status messages so the wait feels purposeful rather than
 * a plain frozen spinner.
 */
export function GenerationProgress({ className }: GenerationProgressProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(
    96,
    Math.round(((stepIndex + 1) / STEPS.length) * 100)
  );

  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-5 py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest/10">
          <Loader2 className="h-6 w-6 animate-spin text-forest" />
        </span>

        <div className="min-h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 text-sm font-medium text-ink"
            >
              <Sparkles className="h-4 w-4 text-forest" aria-hidden />
              {STEPS[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-canvas-muted">
          <motion.div
            className="h-full rounded-full bg-forest"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <p className="max-w-xs text-xs text-ink-subtle">
          This usually takes a few seconds. We&apos;re preparing both English
          and Urdu drafts.
        </p>
      </div>
    </div>
  );
}
