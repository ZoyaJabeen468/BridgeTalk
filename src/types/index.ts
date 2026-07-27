export type SituationType =
  | "freelancing"
  | "startup"
  | "degree_change"
  | "gap_year"
  | "studying_abroad"
  | "moving_city"
  | "career_switch"
  | "work_from_home"
  | "personal_timeline"
  | "other";

export type ConversationAudience =
  | "parents"
  | "sibling"
  | "relative"
  | "partner"
  | "mentor"
  | "other";

export type ListenerStyle =
  | "traditional"
  | "supportive"
  | "strict"
  | "unsure"
  | "open_minded";

export type ParentPersonality = ListenerStyle;

export type ConversationTone = "calm" | "practical" | "warm";

export interface ConversationFormData {
  audience: ConversationAudience;
  situation: SituationType;
  decisionSummary: string;
  concerns: string;
  listenerStyle?: ListenerStyle;
  culturalContext?: string;
  tone?: ConversationTone;
}

export interface ConversationPack {
  calmOpener: string;
  englishExplanation: string;
  urduExplanation: string;
  theirPerspective: string[];
  faqAnswers: { question: string; answer: string }[];
  practicalPlan: string;
  riskyPhrases: {
    phrase: string;
    whyItEscalates: string;
    betterAlternative: string;
  }[];
  prepTips?: string[];
  scores?: {
    respect: number;
    clarity: number;
    practicality: number;
    conflictRisk: "low" | "medium" | "high";
  };
}
