import type { ConversationPack } from "@/types";
import type { ConversationFormInput } from "@/lib/validation/conversation";
import {
  getAudienceLabel,
  getSituationLabel,
  getToneLabel,
} from "@/constants/form";

const PACK_KEY = "bridgetalk:pack";

export type PackSource = "gemini" | "openai" | "demo";

export interface StoredPackMeta {
  source?: PackSource;
  model?: string;
  createdAt: string;
}

export interface StoredPackBundle {
  pack: ConversationPack;
  input: ConversationFormInput;
  meta: StoredPackMeta;
}

function safeStorage(kind: "session" | "local"): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const storage = kind === "session" ? window.sessionStorage : window.localStorage;
    const probeKey = "__bridgetalk_probe__";
    storage.setItem(probeKey, "1");
    storage.removeItem(probeKey);
    return storage;
  } catch {
    return undefined;
  }
}

/**
 * Saves the generated pack to both session and local storage, so the
 * result page can read it after navigation, and a reload doesn't lose it.
 */
export function savePack(
  pack: ConversationPack,
  input: ConversationFormInput,
  meta?: Partial<StoredPackMeta>
): void {
  const bundle: StoredPackBundle = {
    pack,
    input,
    meta: { createdAt: new Date().toISOString(), ...meta },
  };
  const payload = JSON.stringify(bundle);
  safeStorage("session")?.setItem(PACK_KEY, payload);
  safeStorage("local")?.setItem(PACK_KEY, payload);
}

export function loadPack(): StoredPackBundle | null {
  const raw = safeStorage("session")?.getItem(PACK_KEY) ?? safeStorage("local")?.getItem(PACK_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredPackBundle;
  } catch {
    return null;
  }
}

export function clearPack(): void {
  safeStorage("session")?.removeItem(PACK_KEY);
  safeStorage("local")?.removeItem(PACK_KEY);
}

/** Plain-text export of a pack, suitable for copying or downloading. */
export function formatPackAsText(
  pack: ConversationPack,
  input?: ConversationFormInput
): string {
  const lines: string[] = ["BridgeTalk — Conversation Pack"];

  if (input) {
    lines.push(`Talking to: ${getAudienceLabel(input.audience)}`);
    lines.push(`Topic: ${getSituationLabel(input.situation)}`);
    lines.push(`Tone: ${getToneLabel(input.tone)}`);
  }

  lines.push("", "CALM OPENER", pack.calmOpener);
  lines.push("", "ENGLISH EXPLANATION", pack.englishExplanation);
  lines.push("", "URDU DRAFT", pack.urduExplanation);

  lines.push("", "WHAT THEY MAY WORRY ABOUT");
  pack.theirPerspective.forEach((item) => lines.push(`- ${item}`));

  lines.push("", "LIKELY QUESTIONS & ANSWERS");
  pack.faqAnswers.forEach((qa) => {
    lines.push(`Q: ${qa.question}`, `A: ${qa.answer}`, "");
  });

  lines.push("PRACTICAL PLAN", pack.practicalPlan);

  lines.push("", "PHRASES TO AVOID");
  pack.riskyPhrases.forEach((item) => {
    lines.push(
      `Avoid: "${item.phrase}"`,
      `Why: ${item.whyItEscalates}`,
      `Say instead: "${item.betterAlternative}"`,
      ""
    );
  });

  if (pack.prepTips?.length) {
    lines.push("PREP TIPS");
    pack.prepTips.forEach((tip) => lines.push(`- ${tip}`));
    lines.push("");
  }

  if (pack.scores) {
    lines.push(
      "SCORES",
      `Respect: ${pack.scores.respect}/100`,
      `Clarity: ${pack.scores.clarity}/100`,
      `Practicality: ${pack.scores.practicality}/100`,
      `Conflict risk: ${pack.scores.conflictRisk}`
    );
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** Short, shareable summary for sending over WhatsApp / chat apps. */
export function formatWhatsAppSummary(pack: ConversationPack): string {
  const worries = pack.theirPerspective
    .slice(0, 3)
    .map((item) => `• ${item}`)
    .join("\n");

  return [
    "Here's how I'm planning to start the conversation:",
    "",
    `"${pack.calmOpener}"`,
    "",
    "What they might be worried about:",
    worries,
    "",
    "— Prepared with BridgeTalk",
  ].join("\n");
}
