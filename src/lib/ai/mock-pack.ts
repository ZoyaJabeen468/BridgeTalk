import type { ConversationPack } from "@/types";
import {
  getAudienceLabel,
  getPersonalityLabel,
  getSituationLabel,
  getToneLabel,
} from "@/constants/form";
import type { ConversationFormInput } from "@/lib/validation/conversation";

/**
 * Deterministic, template-based conversation pack used when no AI
 * provider is configured (or when every provider call fails). Keeps the
 * product usable offline / in demos, and satisfies `conversationPackSchema`.
 */
export function getMockPack(input: ConversationFormInput): ConversationPack {
  const audience = getAudienceLabel(input.audience);
  const situation = getSituationLabel(input.situation);
  const personality = getPersonalityLabel(input.listenerStyle);
  const tone = getToneLabel(input.tone).toLowerCase();
  const topic = input.decisionSummary.trim();
  const concerns = input.concerns.trim();

  const calmOpener =
    tone === "practical"
      ? `I want to walk you through a plan I've thought about carefully, and I'd like your honest advice on it.`
      : tone === "warm"
        ? `Thank you for always looking out for me. I want to share something I've been thinking about, because your opinion matters to me.`
        : `Can we talk for a few minutes? I want to share something important, and I care about hearing your thoughts.`;

  const englishExplanation = `${topic} I know this may sound different from what you expected, so I want to explain my thinking clearly. I've looked at ${situation.toLowerCase()} from a few angles, thought about the risks, and I have a plan to manage them. I'm not asking you to agree right away — I just want us to understand each other.`;

  const urduExplanation = `مجھے آپ سے ایک ضروری بات کرنی ہے۔ میں نے اس فیصلے کے بارے میں بہت سوچا ہے اور اس کے فائدے اور نقصان دونوں دیکھے ہیں۔ میں چاہتا/چاہتی ہوں کہ آپ میری بات سمجھیں، اور میں بھی آپ کے خدشات کو سمجھنا چاہتا/چاہتی ہوں۔ یہ فیصلہ اچانک نہیں، بلکہ سوچ سمجھ کر کیا گیا ہے۔`;

  const theirPerspective = buildTheirPerspective(input, concerns);
  const faqAnswers = buildFaqAnswers(input, situation);
  const riskyPhrases = buildRiskyPhrases();

  const practicalPlan = `Here's how I'd like to move forward: 1) Start small and prove it works over the next few months. 2) Keep a clear budget / timeline so we can track progress together. 3) Check in with you regularly — I'd suggest every month at first. 4) If it isn't working after a fair trial, I'll adjust the plan rather than ignore your concerns.`;

  const prepTips = [
    `Choose a calm moment — not right after an argument or when everyone is tired.`,
    `Sit somewhere private and unhurried, without other relatives listening in.`,
    `Listen fully before responding. Repeat back what ${audience.toLowerCase()} said before you reply.`,
    `Keep your voice steady even if the reaction is emotional at first.`,
  ];

  return {
    calmOpener,
    englishExplanation,
    urduExplanation,
    theirPerspective,
    faqAnswers,
    practicalPlan,
    riskyPhrases,
    prepTips,
    scores: {
      respect: 82,
      clarity: 78,
      practicality: 80,
      conflictRisk: personality === "Strict" ? "medium" : "low",
    },
  };
}

function buildTheirPerspective(
  input: ConversationFormInput,
  concerns: string
): string[] {
  const base = [
    `Worried about ${concerns.toLowerCase()}`,
    `Wants to know this decision was thought through, not rushed`,
    `Concerned about how this looks to friends and relatives`,
    `Afraid of losing closeness or control over the decision`,
  ];

  if (input.audience === "partner") {
    base.push(`Wants to know how this affects shared plans and timing`);
  } else if (input.audience === "mentor") {
    base.push(`Wants clear goals and proof you've thought about the trade-offs`);
  } else {
    base.push(`Wants reassurance that you'll still ask for advice going forward`);
  }

  return base.slice(0, 5);
}

function buildFaqAnswers(
  input: ConversationFormInput,
  situation: string
): { question: string; answer: string }[] {
  return [
    {
      question: "Why now?",
      answer: `I've been thinking about ${situation.toLowerCase()} for a while, and I feel ready with a real plan — not on a whim.`,
    },
    {
      question: "What if it doesn't work out?",
      answer: `I've thought about that too. I have a backup plan and a timeline to review progress together.`,
    },
    {
      question: "What will people say?",
      answer: `I understand that matters to you. I'd rather we make a decision that's honest and works for our family than one just for appearances.`,
    },
    {
      question: "Have you thought this through?",
      answer: `Yes — I can walk you through exactly what I've considered, including the risks.`,
    },
  ];
}

function buildRiskyPhrases(): {
  phrase: string;
  whyItEscalates: string;
  betterAlternative: string;
}[] {
  return [
    {
      phrase: "You never understand me.",
      whyItEscalates: "Sounds like blame and shuts down listening on both sides.",
      betterAlternative: "I don't think I've explained this well yet — let me try again.",
    },
    {
      phrase: "It's my life, I'll do what I want.",
      whyItEscalates: "Feels dismissive and removes them from the decision entirely.",
      betterAlternative: "This is my decision, but your opinion still matters to me.",
    },
    {
      phrase: "Everyone else's parents are fine with this.",
      whyItEscalates: "Comparisons feel like an attack and invite defensiveness.",
      betterAlternative: "I know this is different from what you expected of me.",
    },
  ];
}
