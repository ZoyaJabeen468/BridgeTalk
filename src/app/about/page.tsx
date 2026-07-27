import type { Metadata } from "next";
import {
  Ear,
  HeartHandshake,
  Lock,
  MessagesSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeader } from "@/components/layout/section";
import { AuthGateLink } from "@/components/auth/auth-gate-link";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion/fade-in";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why BridgeTalk exists, and the principles behind every conversation pack it prepares.",
};

const principles = [
  {
    icon: HeartHandshake,
    title: "Improve communication, not force agreement",
    description:
      "We help you explain your side clearly. We never promise, or aim for, the other person simply saying yes.",
  },
  {
    icon: Ear,
    title: "No one is the villain",
    description:
      "Every pack includes their likely worries, so the conversation stays two-sided instead of you against them.",
  },
  {
    icon: ShieldCheck,
    title: "No manipulation, no guilt",
    description:
      "We don't coach persuasion tricks, guilt trips, or 'winning' an argument. Just honest, respectful wording.",
  },
  {
    icon: Users,
    title: "Culturally aware, not stereotyped",
    description:
      "BridgeTalk understands South Asian and Pakistani family dynamics without flattening anyone into a cliché.",
  },
  {
    icon: MessagesSquare,
    title: "Plain, sayable language",
    description:
      "Every draft — English or Urdu — is written the way a real person would actually speak it out loud.",
  },
  {
    icon: Lock,
    title: "Private by default",
    description:
      "No account, no server-side storage of your answers. Your conversation pack stays in your browser.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About BridgeTalk"
        title="Hard conversations deserve preparation, not luck."
        description={siteConfig.description}
      />

      <Section id="why">
        <SectionHeader
          eyebrow="Why it exists"
          title="Not everyone gets to rehearse the big talk."
          align="left"
        />
        <FadeIn delay={0.1}>
          <div className="mt-6 max-w-3xl space-y-5 text-[15px] leading-relaxed text-ink-muted">
            <p>
              A lot of important life decisions don&apos;t fail because they were
              bad decisions — they fail because the conversation about them went
              badly. Someone felt unheard, someone felt attacked, and a
              disagreement about a career or a choice turned into a rift.
            </p>
            <p>
              That happens far beyond parents and children. It happens between
              siblings figuring out who takes care of aging family, between
              partners negotiating a move, between a student and a mentor
              disagreeing on a path, between relatives who mean well but push
              hard. BridgeTalk exists for all of those moments — anywhere you
              need to explain a choice to someone whose opinion matters to you,
              without losing their respect or your own footing.
            </p>
            <p>
              We built it because most advice about &quot;difficult
              conversations&quot; is either too abstract to use in the moment, or
              written for a Western, individualist context that doesn&apos;t
              account for joint families, izzat, or collective decision-making.
              BridgeTalk tries to close that gap: practical, bilingual, and
              aware of the room you&apos;re actually walking into.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Section muted id="principles">
        <SectionHeader
          eyebrow="How we approach it"
          title="A few rules we don't break."
          description="These shape every prompt, every draft, and every conversation pack BridgeTalk prepares."
        />

        <StaggerChildren className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle) => (
            <StaggerItem key={principle.title}>
              <div className="h-full rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
                  <principle.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-ink">
                  {principle.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {principle.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      <Section>
        <FadeIn className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Ready to prepare your own conversation?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            It takes a few minutes, and nothing you write is saved on a server.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild size="lg">
              <AuthGateLink href="/generate" preferSignup>
                Prepare a conversation
              </AuthGateLink>
            </Button>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
