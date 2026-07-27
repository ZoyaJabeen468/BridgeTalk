"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/layout/section";
import { ProductFrame } from "@/components/layout/product-frame";
import { FadeIn, ScaleIn } from "@/components/motion/fade-in";

export function ExamplePreview() {
  return (
    <Section id="example" muted>
      <FadeIn>
        <SectionHeader
          eyebrow="What you get"
          title="Words you can actually say out loud."
          description="A calm opener, English and Urdu drafts, their likely worries, and safer ways to answer hard questions."
        />
      </FadeIn>

      <ScaleIn delay={0.08}>
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductFrame title="BridgeTalk · Sample pack">
            <div className="border-b border-border bg-canvas/70 px-6 py-4 sm:px-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">Remote freelancing</Badge>
                <Badge>English + Urdu</Badge>
                <Badge variant="success">Conflict risk · Low</Badge>
              </div>
              <p className="mt-3 text-sm text-ink-muted">
                Starting freelance design work while finishing university
              </p>
            </div>

            <div className="space-y-8 p-6 sm:p-8">
              <div>
                <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-ink-subtle">
                  Calm opener
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink">
                  “I want to talk about something important, and I care about
                  your advice. I’ve thought about stability carefully — can I
                  share my plan?”
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="rounded-xl border border-border bg-canvas/40 p-5"
                >
                  <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-ink-subtle">
                    English
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink">
                    I’m not rejecting a traditional path. I’m building skills and
                    clients while I study, with a monthly savings target and a
                    six-month review so we can decide together if this is
                    working.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.22 }}
                  className="rounded-xl border border-border bg-canvas/40 p-5"
                >
                  <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-ink-subtle">
                    Urdu · spoken draft
                  </h3>
                  <p
                    className="font-urdu mt-2 text-[1.05rem] text-ink"
                    dir="rtl"
                    lang="ur"
                  >
                    میں روایتی راستے کو رد نہیں کر رہا۔ پڑھائی کے ساتھ مہارت اور
                    کلائنٹس بنا رہا ہوں، مہینہ وار بچت کا ہدف رکھا ہے، اور چھ
                    مہینے بعد آپ کے ساتھ جائزہ لیں گے۔
                  </p>
                </motion.div>
              </div>

              <div>
                <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-ink-subtle">
                  What they may worry about
                </h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    "Stable and predictable income",
                    "Long-term career security",
                    "What relatives will think",
                    "Whether you’ll regret this later",
                  ].map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.08 * index }}
                      className="flex items-start gap-2 text-sm text-ink"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest"
                        aria-hidden
                      />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </ProductFrame>
        </motion.div>
      </ScaleIn>
    </Section>
  );
}
