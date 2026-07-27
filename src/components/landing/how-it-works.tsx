"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/layout/section";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/fade-in";

const steps = [
  {
    step: "01",
    title: "Share your situation",
    description:
      "Choose who you’ll talk to, what you want to explain, and what they may worry about.",
  },
  {
    step: "02",
    title: "Receive a conversation pack",
    description:
      "Get a calm opener, English and Urdu drafts, worries to address, practical answers, and safer phrasing.",
  },
  {
    step: "03",
    title: "Walk in prepared",
    description:
      "Copy what you need, make it sound like you, and start the talk with less tension.",
  },
] as const;

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <FadeIn>
        <SectionHeader
          eyebrow="How it works"
          title="From nervous to ready in three steps."
          description="Tell us what’s hard to say. We’ll help you walk into that talk clearer and calmer."
        />
      </FadeIn>

      <div className="relative">
        <motion.div
          aria-hidden
          className="absolute top-5 right-[12%] left-[12%] hidden h-px origin-left bg-border md:block"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />

        <StaggerChildren className="relative grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((item) => (
            <StaggerItem key={item.step}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="relative"
              >
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-xs font-semibold tracking-[0.08em] text-forest shadow-sm">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                  {item.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </Section>
  );
}
