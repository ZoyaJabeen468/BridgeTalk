import type { ConversationPack } from "@/types";
import {
  conversationPackSchema,
  type ConversationFormInput,
} from "@/lib/validation/conversation";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts/system";
import { getMockPack } from "@/lib/ai/mock-pack";

export type GenerationSource = "gemini" | "openai" | "demo";

export interface GenerationResult {
  pack: ConversationPack;
  source: GenerationSource;
  model?: string;
  warning?: string;
}

function uniqueDefined(values: (string | undefined | null)[]): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value?.trim()))));
}

/** Gemini models tried in order. Configured model (if any) is tried first. */
function geminiModelFallbackChain(): string[] {
  return uniqueDefined([
    process.env.GEMINI_MODEL,
    "gemini-flash-latest",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
  ]);
}

/**
 * Normalizes older / alternate field names some model responses use
 * (e.g. an earlier prompt version asked for "parentPerspective") into
 * the current `theirPerspective` schema field, before validation.
 */
function normalizePackShape(raw: unknown): unknown {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const obj: Record<string, unknown> = { ...(raw as Record<string, unknown>) };

  if (obj.theirPerspective === undefined) {
    const legacy =
      obj.parentPerspective ?? obj.parentsPerspective ?? obj.otherPerspective;
    if (legacy !== undefined) {
      obj.theirPerspective = legacy;
    }
  }
  delete obj.parentPerspective;
  delete obj.parentsPerspective;
  delete obj.otherPerspective;

  if (typeof obj.theirPerspective === "string") {
    obj.theirPerspective = obj.theirPerspective
      .split(/\n|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return obj;
}

/**
 * Validates and normalizes a raw AI (or demo) response into a
 * `ConversationPack`. Throws if the shape can't be salvaged.
 */
export function parsePack(raw: unknown): ConversationPack {
  const normalized = normalizePackShape(raw);
  const result = conversationPackSchema.safeParse(normalized);
  if (!result.success) {
    throw new Error(`Conversation pack failed validation: ${result.error.message}`);
  }
  return result.data;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = (fenced ? fenced[1] : trimmed).trim();
  const start = jsonText.indexOf("{");
  const end = jsonText.lastIndexOf("}");
  const candidate = start >= 0 && end > start ? jsonText.slice(start, end + 1) : jsonText;
  return JSON.parse(candidate);
}

/** True when text is mostly Latin letters (Roman Urdu) instead of Arabic script. */
export function looksLikeRomanUrdu(text: string): boolean {
  const arabic = (text.match(/[\u0600-\u06FF]/g) ?? []).length;
  const latin = (text.match(/[A-Za-z]/g) ?? []).length;
  if (latin < 12) return false;
  return arabic < Math.max(8, latin * 0.25);
}

async function convertRomanUrduToScript(
  romanText: string,
  geminiKey: string,
  model: string
): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${geminiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Convert this Roman Urdu into proper Urdu script (Arabic/Nastaliq letters only).
Keep the same meaning and spoken tone.
Return ONLY the Urdu script text. No Latin letters. No quotes. No explanation.

Roman Urdu:
${romanText}`,
            },
          ],
        },
      ],
      generationConfig: { temperature: 0.2 },
    }),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text || looksLikeRomanUrdu(text)) return null;
  return text.replace(/^["'«»]+|["'«»]+$/g, "").trim();
}

/**
 * Ensures urduExplanation uses Arabic script. If the model returned
 * Roman Urdu, convert it once via Gemini when a key is available.
 */
async function ensureUrduScript(
  pack: ConversationPack,
  geminiKey?: string,
  preferredModel?: string
): Promise<ConversationPack> {
  if (!looksLikeRomanUrdu(pack.urduExplanation)) return pack;
  if (!geminiKey) return pack;

  const models = uniqueDefined([preferredModel, ...geminiModelFallbackChain()]);
  for (const model of models) {
    try {
      const converted = await convertRomanUrduToScript(
        pack.urduExplanation,
        geminiKey,
        model
      );
      if (converted) {
        return { ...pack, urduExplanation: converted };
      }
    } catch {
      // try next model
    }
  }

  return pack;
}

async function callGemini(
  model: string,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<unknown> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Gemini "${model}" responded ${res.status}: ${errorText.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    promptFeedback?: { blockReason?: string };
  };

  if (data.promptFeedback?.blockReason) {
    throw new Error(`Gemini "${model}" blocked the prompt: ${data.promptFeedback.blockReason}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("");
  if (!text) {
    throw new Error(`Gemini "${model}" returned no content`);
  }

  return extractJson(text);
}

async function callOpenAI(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<unknown> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`OpenAI "${model}" responded ${res.status}: ${errorText.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error(`OpenAI "${model}" returned no content`);
  }

  return extractJson(text);
}

/**
 * Generates a conversation pack, trying Gemini models in order, then
 * OpenAI (if configured), and finally falling back to a deterministic
 * demo pack so the product always returns something useful.
 */
export async function generateConversationPack(
  input: ConversationFormInput
): Promise<GenerationResult> {
  const systemPrompt = SYSTEM_PROMPT;
  const userPrompt = buildUserPrompt(input);
  const errors: string[] = [];

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    for (const model of geminiModelFallbackChain()) {
      try {
        const raw = await callGemini(model, geminiKey, systemPrompt, userPrompt);
        const pack = await ensureUrduScript(parsePack(raw), geminiKey, model);
        return { pack, source: "gemini", model };
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }
    }
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
    try {
      const raw = await callOpenAI(openaiKey, model, systemPrompt, userPrompt);
      const pack = await ensureUrduScript(parsePack(raw), geminiKey, undefined);
      return { pack, source: "openai", model };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (errors.length) {
    console.warn(
      `[bridgetalk] AI generation unavailable, using demo pack instead:\n${errors.join("\n")}`
    );
  }

  return {
    pack: getMockPack(input),
    source: "demo",
    warning: errors.length
      ? "AI providers were unavailable, so a demo pack was used."
      : "No AI provider configured, so a demo pack was used.",
  };
}
