"use client";

import {
  Download,
  Languages,
  Lightbulb,
  ListChecks,
  MessageCircleHeart,
  Quote,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import type { ConversationPack } from "@/types";
import type { ConversationFormInput } from "@/lib/validation/conversation";
import {
  getAudienceLabel,
  getSituationLabel,
  getToneLabel,
} from "@/constants/form";
import { formatPackAsText, formatWhatsAppSummary, type PackSource } from "@/lib/pack-storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductFrame } from "@/components/layout/product-frame";
import { CopyButton } from "@/components/result/copy-button";

interface ConversationPackViewProps {
  pack: ConversationPack;
  input: ConversationFormInput;
  source?: PackSource;
}

const RISK_LABEL: Record<"low" | "medium" | "high", string> = {
  low: "Conflict risk · Low",
  medium: "Conflict risk · Medium",
  high: "Conflict risk · High",
};

const RISK_VARIANT: Record<"low" | "medium" | "high", "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

export function ConversationPackView({ pack, input, source }: ConversationPackViewProps) {
  const fullText = formatPackAsText(pack, input);

  function handleDownload() {
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bridgetalk-conversation-pack.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const whatsAppHref = `https://wa.me/?text=${encodeURIComponent(formatWhatsAppSummary(pack))}`;

  return (
    <ProductFrame title="BridgeTalk · Your conversation pack">
      <div className="border-b border-border bg-canvas/70 px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">{getAudienceLabel(input.audience)}</Badge>
          <Badge>{getSituationLabel(input.situation)}</Badge>
          <Badge>{getToneLabel(input.tone)} tone</Badge>
          {pack.scores ? (
            <Badge variant={RISK_VARIANT[pack.scores.conflictRisk]}>
              {RISK_LABEL[pack.scores.conflictRisk]}
            </Badge>
          ) : null}
          {source === "demo" ? (
            <Badge variant="warning">Demo preview</Badge>
          ) : null}
        </div>
        <p className="mt-3 text-sm text-ink-muted">{input.decisionSummary}</p>
      </div>

      <div className="space-y-10 p-6 sm:p-8">
        <PackSection
          icon={<Quote className="h-4 w-4" />}
          title="Calm opener"
          action={<CopyButton text={pack.calmOpener} />}
        >
          <p className="rounded-xl border border-forest/15 bg-forest/5 p-4 text-[15px] leading-relaxed text-ink">
            “{pack.calmOpener}”
          </p>
        </PackSection>

        <div className="grid gap-4 lg:grid-cols-2">
          <PackSection
            icon={<Languages className="h-4 w-4" />}
            title="English"
            action={<CopyButton text={pack.englishExplanation} />}
          >
            <p className="rounded-xl border border-border bg-canvas/40 p-4 text-sm leading-relaxed text-ink">
              {pack.englishExplanation}
            </p>
          </PackSection>

          <PackSection
            icon={<Languages className="h-4 w-4" />}
            title="Urdu · spoken draft"
            action={<CopyButton text={pack.urduExplanation} />}
          >
            <p
              dir="rtl"
              lang="ur"
              className="font-urdu rounded-xl border border-border bg-canvas/40 p-4 text-[1.05rem] text-ink"
            >
              {pack.urduExplanation}
            </p>
          </PackSection>
        </div>

        <PackSection
          icon={<Sparkles className="h-4 w-4" />}
          title="What they may worry about"
        >
          <ul className="grid gap-2 sm:grid-cols-2">
            {pack.theirPerspective.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </PackSection>

        <PackSection icon={<ListChecks className="h-4 w-4" />} title="Likely questions">
          <div className="space-y-2">
            {pack.faqAnswers.map((qa) => (
              <details
                key={qa.question}
                className="group rounded-lg border border-border bg-white px-4 py-3 open:bg-canvas/40"
              >
                <summary className="cursor-pointer list-none text-sm font-medium text-ink marker:content-none">
                  <span className="flex items-center justify-between gap-3">
                    {qa.question}
                    <span className="text-ink-subtle transition-transform group-open:rotate-180">
                      ⌄
                    </span>
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{qa.answer}</p>
              </details>
            ))}
          </div>
        </PackSection>

        <PackSection
          icon={<ListChecks className="h-4 w-4" />}
          title="Practical plan"
          action={<CopyButton text={pack.practicalPlan} />}
        >
          <p className="rounded-xl border border-border bg-canvas/40 p-4 text-sm leading-relaxed text-ink">
            {pack.practicalPlan}
          </p>
        </PackSection>

        <PackSection icon={<ShieldAlert className="h-4 w-4" />} title="Phrases to avoid">
          <div className="space-y-3">
            {pack.riskyPhrases.map((item) => (
              <div
                key={item.phrase}
                className="rounded-xl border border-danger/20 bg-danger/5 p-4"
              >
                <p className="text-sm font-medium text-danger">“{item.phrase}”</p>
                <p className="mt-1.5 text-xs text-ink-muted">{item.whyItEscalates}</p>
                <p className="mt-2 rounded-lg border border-success/25 bg-success/10 px-3 py-2 text-sm text-ink">
                  Try instead: “{item.betterAlternative}”
                </p>
              </div>
            ))}
          </div>
        </PackSection>

        {pack.prepTips?.length ? (
          <PackSection icon={<Lightbulb className="h-4 w-4" />} title="Before you talk">
            <ul className="space-y-2">
              {pack.prepTips.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-ink">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" aria-hidden />
                  {tip}
                </li>
              ))}
            </ul>
          </PackSection>
        ) : null}

        {pack.scores ? (
          <PackSection icon={<Sparkles className="h-4 w-4" />} title="How this pack scores">
            <div className="grid gap-4 sm:grid-cols-3">
              <ScoreBar label="Respect" value={pack.scores.respect} />
              <ScoreBar label="Clarity" value={pack.scores.clarity} />
              <ScoreBar label="Practicality" value={pack.scores.practicality} />
            </div>
          </PackSection>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-canvas-muted/40 px-6 py-5 sm:px-8">
        <p className="text-xs text-ink-subtle">
          Adapt this to your own voice before the conversation.
        </p>
        <div className="flex flex-wrap gap-2">
          <CopyButton text={fullText} label="Copy full pack" />
          <Button type="button" variant="secondary" size="sm" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5" />
            Download .txt
          </Button>
          <Button asChild variant="secondary" size="sm">
            <a href={whatsAppHref} target="_blank" rel="noreferrer">
              <MessageCircleHeart className="h-3.5 w-3.5" />
              Share summary
            </a>
          </Button>
        </div>
      </div>
    </ProductFrame>
  );
}

function PackSection({
  icon,
  title,
  action,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-ink-subtle">
          <span className="text-forest">{icon}</span>
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs text-ink-muted">
        <span>{label}</span>
        <span className="font-medium text-ink">{value}/100</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas-muted">
        <div
          className="h-full rounded-full bg-forest"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
