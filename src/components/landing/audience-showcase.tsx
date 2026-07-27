"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { AuthGateLink } from "@/components/auth/auth-gate-link";
import { audiences } from "@/constants/form";
import { Container } from "@/components/layout/container";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/fade-in";

const showcase = audiences.filter((item) => item.value !== "other");

export function AudienceShowcase() {
  return (
    <section
      id="who"
      className="border-y border-border bg-surface"
      aria-labelledby="communication-heading"
    >
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <FadeIn className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-forest">
              Effective communication
            </p>
            <h2
              id="communication-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
            >
              Prepare the talk before it gets hard.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-[17px]">
              BridgeTalk helps you explain clearly and understand the other
              side — with parents, family, partners, or mentors.
            </p>
          </FadeIn>

          <FadeIn delay={0.08} className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end lg:text-right">
            <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
              Same product for every listener. Different tone. Clearer talk.
            </p>
            <AuthGateLink
              href="/generate"
              preferSignup
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-forest transition-opacity hover:opacity-80"
            >
              Start a pack
              <ArrowUpRight className="h-4 w-4" />
            </AuthGateLink>
          </FadeIn>
        </div>

        {/* Mobile: horizontal snap */}
        <div className="mt-10 -mx-5 sm:hidden">
          <StaggerChildren className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {showcase.map((item) => (
              <StaggerItem
                key={item.value}
                className="w-[76%] max-w-[260px] shrink-0 snap-start"
              >
                <AudienceCard item={item} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>

        {/* Tablet + desktop grid */}
        <StaggerChildren className="mt-10 hidden gap-3 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:mt-12 lg:grid-cols-5 lg:gap-4">
          {showcase.map((item) => (
            <StaggerItem key={item.value}>
              <AudienceCard item={item} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}

function AudienceCard({
  item,
}: {
  item: (typeof showcase)[number];
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
      <AuthGateLink
        href={`/generate?audience=${item.value}`}
        preferSignup
        className="group block h-full overflow-hidden rounded-2xl border border-border bg-canvas shadow-[0_1px_0_rgba(24,24,27,0.04)] transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(24,24,27,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/35"
      >
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[4/3] lg:aspect-[3/4]">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={item.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 33vw, 20vw"
            />
          </motion.div>
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
            <p className="text-[15px] font-semibold tracking-tight text-white">
              {item.shortLabel}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/80 sm:text-[13px]">
              {item.blurb}
            </p>
          </div>
        </div>
      </AuthGateLink>
    </motion.div>
  );
}
