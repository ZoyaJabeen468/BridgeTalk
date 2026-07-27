import type {
  ConversationAudience,
  ConversationTone,
  ListenerStyle,
  SituationType,
} from "@/types";
import type { ConversationFormInput } from "@/lib/validation/conversation";

export const audiences: {
  value: ConversationAudience;
  label: string;
  shortLabel: string;
  blurb: string;
  image: string;
}[] = [
  {
    value: "parents",
    label: "Parents",
    shortLabel: "Parents",
    blurb: "Respect + clarity at home",
    image: "/images/audience-parents.jpg",
  },
  {
    value: "sibling",
    label: "Sibling",
    shortLabel: "Sibling",
    blurb: "Practice before the big talk",
    image: "/images/audience-sibling.jpg",
  },
  {
    value: "relative",
    label: "Relative",
    shortLabel: "Relative",
    blurb: "Careful words, less tension",
    image: "/images/audience-relative.jpg",
  },
  {
    value: "partner",
    label: "Partner",
    shortLabel: "Partner",
    blurb: "Honest plans, shared timing",
    image: "/images/audience-partner.jpg",
  },
  {
    value: "mentor",
    label: "Teacher / mentor",
    shortLabel: "Mentor",
    blurb: "Clear goals, practical asks",
    image: "/images/audience-mentor.jpg",
  },
  {
    value: "other",
    label: "Someone else",
    shortLabel: "Other",
    blurb: "Clear words for any important talk",
    image: "/images/audience-parents.jpg",
  },
];

export const situations: { value: SituationType; label: string }[] = [
  { value: "freelancing", label: "Freelancing / remote work" },
  { value: "startup", label: "Startup / business" },
  { value: "degree_change", label: "Different degree / major change" },
  { value: "gap_year", label: "Gap year" },
  { value: "studying_abroad", label: "Studying abroad" },
  { value: "moving_city", label: "Moving to another city" },
  { value: "career_switch", label: "Career switch" },
  { value: "work_from_home", label: "Working from home" },
  { value: "personal_timeline", label: "Personal timeline / delayed marriage" },
  { value: "other", label: "Other" },
];

export const personalities: { value: ListenerStyle; label: string }[] = [
  { value: "traditional", label: "Traditional" },
  { value: "supportive", label: "Supportive" },
  { value: "strict", label: "Strict" },
  { value: "unsure", label: "Unsure" },
  { value: "open_minded", label: "Open-minded" },
];

export const tones: {
  value: ConversationTone;
  label: string;
  description: string;
}[] = [
  { value: "calm", label: "Calm", description: "Soft start, less tension" },
  {
    value: "practical",
    label: "Practical",
    description: "Plans and next steps first",
  },
  { value: "warm", label: "Warm", description: "Caring and reassuring" },
];

export const sampleFormValues: ConversationFormInput = {
  audience: "parents",
  situation: "freelancing",
  decisionSummary:
    "I want to freelance in AI agents while finishing my degree, with a monthly savings target and a six-month review together.",
  concerns:
    "Income stability, what relatives will say, and finishing university on time",
  listenerStyle: "traditional",
  culturalContext: "Joint family, first child choosing a non-traditional path",
  tone: "calm",
};

export function getAudienceLabel(value?: ConversationAudience): string {
  if (!value) return "Someone important";
  return audiences.find((item) => item.value === value)?.label ?? value;
}

export function getSituationLabel(value: SituationType): string {
  return situations.find((item) => item.value === value)?.label ?? value;
}

export function getPersonalityLabel(
  value?: ListenerStyle
): string | undefined {
  if (!value) return undefined;
  return personalities.find((item) => item.value === value)?.label;
}

export function getToneLabel(value?: ConversationTone): string {
  return tones.find((item) => item.value === value)?.label ?? "Calm";
}
