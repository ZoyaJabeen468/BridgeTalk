import type { ConversationPack } from "@/types";
import type { SkillDimension, SkillsProfile } from "@/types/skills";
import {
  getDailyPractice,
  getLocalDayKey,
  skillDimensions,
  skillLessons,
  type DailyPractice,
} from "@/constants/skills";
import type { StoredPackBundle } from "@/lib/pack-storage";

const HARSH_MARKERS = [
  "never",
  "always",
  "stupid",
  "hate",
  "don't care",
  "whether you like",
  "you just don't",
  "shut up",
];

const SOFT_MARKERS = [
  "i know",
  "i hear",
  "i understand",
  "can we",
  "would it help",
  "thank",
  "worried",
  "your advice",
  "together",
  "next step",
];

/**
 * Prefer a risky line from the user's last pack when available.
 * Falls back to the rotating daily pool.
 */
export function resolveDailyPractice(
  packBundle: StoredPackBundle | null,
  date = new Date()
): DailyPractice & { fromPack: boolean } {
  const base = getDailyPractice(date);
  const risky = packBundle?.pack.riskyPhrases?.[0];

  if (!risky?.phrase?.trim()) {
    return { ...base, fromPack: false };
  }

  return {
    dayKey: base.dayKey,
    title: "Rewrite a line from your pack",
    skill: "respect",
    prompt:
      "This came from your last conversation pack. Soften it without losing honesty.",
    line: risky.phrase.trim(),
    hint:
      risky.betterAlternative?.trim() ||
      "Lead with respect, then say what you need in one short sentence.",
    useToday: "Use your rewritten line if that talk comes up today.",
    fromPack: true,
  };
}

export function getPackPracticeLines(
  pack: ConversationPack | null | undefined
): { phrase: string; better?: string }[] {
  if (!pack?.riskyPhrases?.length) return [];
  return pack.riskyPhrases
    .filter((item) => item.phrase?.trim())
    .slice(0, 3)
    .map((item) => ({
      phrase: item.phrase.trim(),
      better: item.betterAlternative?.trim(),
    }));
}

export function evaluateRewrite(answer: string): {
  ok: boolean;
  tips: string[];
  softScore: number;
} {
  const text = answer.trim().toLowerCase();
  const tips: string[] = [];
  let softScore = 50;

  if (text.length < 12) {
    tips.push("Add a full sentence you could say out loud.");
    return { ok: false, tips, softScore: 20 };
  }

  if (text.length > 220) {
    tips.push("Shorten it. Two calm sentences are enough.");
    softScore -= 10;
  } else {
    softScore += 8;
  }

  const harshHit = HARSH_MARKERS.find((marker) => text.includes(marker));
  if (harshHit) {
    tips.push(`Try removing tense wording like “${harshHit}”.`);
    softScore -= 15;
  } else {
    softScore += 10;
  }

  const softHits = SOFT_MARKERS.filter((marker) => text.includes(marker)).length;
  if (softHits === 0) {
    tips.push("Add one soft cue: “I know…”, “Can we…”, or “I hear you…”.");
    softScore -= 5;
  } else {
    softScore += Math.min(15, softHits * 6);
  }

  softScore = Math.min(100, Math.max(0, softScore));
  const ok = softScore >= 45 && !harshHit && text.length >= 12;
  if (ok && tips.length === 0) {
    tips.push("Sounds workable. Check Calm, Clear, and Respectful below.");
  }
  return { ok, tips: tips.slice(0, 2), softScore };
}

export function getRecommendedLesson(profile: SkillsProfile): {
  lessonId: string;
  reason: string;
} {
  const weakest = ([...skillDimensions] as const)
    .map((dim) => ({ id: dim.id, value: profile.scores[dim.id] ?? 50 }))
    .sort((a, b) => a.value - b.value)[0];

  const bySkill = skillLessons.find(
    (lesson) =>
      lesson.skill === weakest?.id &&
      !profile.completedLessonIds.includes(lesson.id)
  );
  if (bySkill && weakest) {
    return {
      lessonId: bySkill.id,
      reason: `Your ${skillDimensions.find((d) => d.id === weakest.id)?.label ?? "weakest"} score could use a short lesson.`,
    };
  }

  const nextLesson = skillLessons.find(
    (lesson) => !profile.completedLessonIds.includes(lesson.id)
  );
  if (nextLesson) {
    return {
      lessonId: nextLesson.id,
      reason: "A short lesson you haven’t practiced yet.",
    };
  }

  return {
    lessonId: skillLessons[0]?.id ?? "start-soft",
    reason: "Revisit a core habit before your next hard talk.",
  };
}

export function getWeekPracticeCount(
  profile: SkillsProfile,
  date = new Date()
): { done: number; target: number; label: string } {
  const today = getLocalDayKey(date);
  let done = 0;
  if (profile.lastDailyCompletedOn) {
    // Approximate: streak capped to days into current week + today
    const day = date.getDay() || 7; // Mon=1..Sun=7 if we shift
    const daysIntoWeek = day === 0 ? 7 : day; // simplistic Sun=7
    done = Math.min(profile.dailyStreak, daysIntoWeek);
    if (profile.lastDailyCompletedOn === today && done === 0) done = 1;
  }
  return {
    done,
    target: 5,
    label: `${done}/5 practice days this stretch`,
  };
}

export function buildDailyReminder(practice: DailyPractice): string {
  return `BridgeTalk · Today’s practice\n${practice.title}\n\nLine to soften:\n"${practice.line}"\n\n${practice.useToday}`;
}

export function weakestSkill(profile: SkillsProfile): SkillDimension {
  return (
    ([...skillDimensions] as { id: SkillDimension }[])
      .map((dim) => ({ id: dim.id, value: profile.scores[dim.id] ?? 50 }))
      .sort((a, b) => a.value - b.value)[0]?.id ?? "listening"
  );
}
