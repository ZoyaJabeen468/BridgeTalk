"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AuthGateLink } from "@/components/auth/auth-gate-link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/constants/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative isolate min-h-svh overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      >
        <Image
          src="/images/hero-conversation.jpg"
          alt="A calm living room ready for a careful family conversation"
          fill
          priority
          className="object-cover object-[68%_center] sm:object-center"
          sizes="100vw"
        />

        {/* Soft forest tint — light enough to keep the photo readable */}
        <div
          aria-hidden
          className="absolute inset-0 bg-forest-800/25 mix-blend-multiply"
        />

        {/* Text legibility: left veil only, fades into the room */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-warm-900/78 via-warm-900/40 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-warm-900/55 via-transparent to-warm-900/25"
        />
      </motion.div>

      <Container className="relative flex min-h-svh flex-col justify-end pb-16 pt-28 sm:pb-20 lg:justify-center lg:pb-24 lg:pt-32">
        <div className="max-w-xl lg:max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
            className="font-display text-[1.75rem] leading-none font-medium tracking-[-0.02em] text-white sm:text-[2rem]"
          >
            {siteConfig.name}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
            className="font-display mt-5 text-[2.35rem] leading-[1.08] font-semibold tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]"
          >
            Explain your choices.
            <span className="mt-1 block text-white/72">Not your respect.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
            className="mt-6 max-w-md font-sans text-base leading-relaxed text-white/78 sm:text-[1.0625rem]"
          >
            Calm words for hard talks at home. English and Urdu.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
            className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6"
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-forest shadow-card hover:bg-warm-50 active:bg-warm-100"
            >
              <AuthGateLink href="/generate" preferSignup>
                Prepare a conversation
                <ArrowRight className="h-4 w-4" />
              </AuthGateLink>
            </Button>

            <AuthGateLink
              href="/generate?sample=1"
              preferSignup
              className="group inline-flex items-center gap-1.5 font-sans text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              See a sample
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </AuthGateLink>
          </motion.div>
        </div>
      </Container>

      {/* Quiet bottom cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-canvas to-transparent"
      />
    </section>
  );
}
