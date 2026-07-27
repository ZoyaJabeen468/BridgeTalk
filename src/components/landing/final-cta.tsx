"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AuthGateLink } from "@/components/auth/auth-gate-link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/motion/fade-in";

export function FinalCta() {
  return (
    <Section>
      <FadeIn>
        <motion.div
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-[1.75rem] border border-border bg-forest px-8 py-14 sm:px-12 sm:py-16"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
            animate={{ opacity: [0.35, 0.55, 0.35], y: [0, 12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/55">
              Start today
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Better talks start with better prep.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/72 sm:text-lg">
              Shape a calm opener, anticipate worries, and choose wording that
              keeps respect on both sides in a few minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-white text-forest hover:bg-canvas active:bg-stone-100"
              >
                <AuthGateLink href="/generate" preferSignup>
                  Prepare a conversation
                  <ArrowRight className="h-4 w-4" />
                </AuthGateLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="border-white/20 bg-transparent text-white hover:bg-white/10"
              >
                <AuthGateLink href="/generate?sample=1" preferSignup>
                  Try a sample
                </AuthGateLink>
              </Button>
            </div>
          </div>
        </motion.div>
      </FadeIn>
    </Section>
  );
}
