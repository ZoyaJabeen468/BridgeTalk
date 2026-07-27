import { z } from "zod";

export const conversationFormSchema = z.object({
  audience: z.enum([
    "parents",
    "sibling",
    "relative",
    "partner",
    "mentor",
    "other",
  ]),
  situation: z.enum([
    "freelancing",
    "startup",
    "degree_change",
    "gap_year",
    "studying_abroad",
    "moving_city",
    "career_switch",
    "work_from_home",
    "personal_timeline",
    "other",
  ]),
  decisionSummary: z
    .string()
    .trim()
    .min(20, "Add one clear sentence (at least 20 characters).")
    .max(1200, "Keep this under 1200 characters."),
  concerns: z
    .string()
    .trim()
    .min(
      10,
      "Write a short phrase (10+ characters), like “income stability”."
    )
    .max(800, "Keep this under 800 characters."),
  listenerStyle: z
    .enum(["traditional", "supportive", "strict", "unsure", "open_minded"])
    .optional(),
  culturalContext: z
    .string()
    .trim()
    .max(400, "Keep this under 400 characters.")
    .optional(),
  tone: z.enum(["calm", "practical", "warm"]).default("calm"),
});

export type ConversationFormInput = z.infer<typeof conversationFormSchema>;

export const conversationPackSchema = z.object({
  calmOpener: z.string().min(1),
  englishExplanation: z.string().min(1),
  urduExplanation: z.string().min(1),
  theirPerspective: z.array(z.string().min(1)).min(3).max(6),
  faqAnswers: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      })
    )
    .min(3)
    .max(5),
  practicalPlan: z.string().min(1),
  riskyPhrases: z
    .array(
      z.object({
        phrase: z.string().min(1),
        whyItEscalates: z.string().min(1),
        betterAlternative: z.string().min(1),
      })
    )
    .min(2)
    .max(4),
  prepTips: z.array(z.string().min(1)).min(3).max(5).optional(),
  scores: z
    .object({
      respect: z.number().min(0).max(100),
      clarity: z.number().min(0).max(100),
      practicality: z.number().min(0).max(100),
      conflictRisk: z.enum(["low", "medium", "high"]),
    })
    .optional(),
});
