import {
  defaultSkillScores,
  getLocalDayKey,
  skillDrills,
  skillLessons,
} from "@/constants/skills";
import type {
  SkillDimension,
  SkillsProfile,
  TalkReflection,
} from "@/types/skills";

const SKILLS_KEY = "bridgetalk:skills";

function safeLocal(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const probe = "__bridgetalk_skills_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function emptyProfile(): SkillsProfile {
  return {
    completedLessonIds: [],
    completedDrillIds: [],
    reflections: [],
    scores: { ...defaultSkillScores },
    weeklyHabitCompletedFor: null,
    lastDailyCompletedOn: null,
    dailyStreak: 0,
    streakGraceUsedOn: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadSkillsProfile(): SkillsProfile {
  const storage = safeLocal();
  if (!storage) return emptyProfile();
  try {
    const raw = storage.getItem(SKILLS_KEY);
    if (!raw) return emptyProfile();
    const parsed = JSON.parse(raw) as Partial<SkillsProfile>;
    return {
      ...emptyProfile(),
      ...parsed,
      scores: { ...defaultSkillScores, ...parsed.scores },
      reflections: Array.isArray(parsed.reflections) ? parsed.reflections : [],
      completedLessonIds: Array.isArray(parsed.completedLessonIds)
        ? parsed.completedLessonIds
        : [],
      completedDrillIds: Array.isArray(parsed.completedDrillIds)
        ? parsed.completedDrillIds
        : [],
      dailyStreak:
        typeof parsed.dailyStreak === "number" ? parsed.dailyStreak : 0,
      lastDailyCompletedOn: parsed.lastDailyCompletedOn ?? null,
      streakGraceUsedOn: parsed.streakGraceUsedOn ?? null,
      lastDailyRatings: parsed.lastDailyRatings,
    };
  } catch {
    return emptyProfile();
  }
}

function saveSkillsProfile(profile: SkillsProfile): void {
  const storage = safeLocal();
  if (!storage) return;
  storage.setItem(
    SKILLS_KEY,
    JSON.stringify({ ...profile, updatedAt: new Date().toISOString() })
  );
}

function bumpScore(
  scores: Record<SkillDimension, number>,
  skill: SkillDimension,
  amount: number
): Record<SkillDimension, number> {
  const next = { ...scores };
  next[skill] = Math.min(100, Math.max(0, (next[skill] ?? 50) + amount));
  return next;
}

function shiftDayKey(dayKey: string, deltaDays: number): string {
  const [year, month, day] = dayKey.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  date.setDate(date.getDate() + deltaDays);
  return getLocalDayKey(date);
}

/**
 * Marks today's practice done.
 * Streak continues if yesterday was done, or if one grace day covers a miss.
 */
export function completeDailyPractice(
  dayKey: string,
  skill: SkillDimension,
  ratings?: { calm: boolean; clear: boolean; respectful: boolean },
  qualityBonus = 0
): SkillsProfile {
  const profile = loadSkillsProfile();
  if (profile.lastDailyCompletedOn === dayKey) return profile;

  const yesterday = shiftDayKey(dayKey, -1);
  const twoDaysAgo = shiftDayKey(dayKey, -2);
  let streak = 1;
  let streakGraceUsedOn = profile.streakGraceUsedOn;

  if (profile.lastDailyCompletedOn === yesterday) {
    streak = profile.dailyStreak + 1;
  } else if (
    profile.lastDailyCompletedOn === twoDaysAgo &&
    profile.streakGraceUsedOn !== twoDaysAgo
  ) {
    // One-day grace: miss yesterday, still keep the streak once
    streak = profile.dailyStreak + 1;
    streakGraceUsedOn = twoDaysAgo;
  }

  const ratingBonus =
    ratings && ratings.calm && ratings.clear && ratings.respectful ? 2 : 0;

  const next: SkillsProfile = {
    ...profile,
    lastDailyCompletedOn: dayKey,
    dailyStreak: streak,
    streakGraceUsedOn,
    lastDailyRatings: ratings,
    scores: bumpScore(profile.scores, skill, 3 + ratingBonus + qualityBonus),
  };
  saveSkillsProfile(next);
  return next;
}

export function markLessonComplete(lessonId: string): SkillsProfile {
  const profile = loadSkillsProfile();
  if (profile.completedLessonIds.includes(lessonId)) return profile;

  const lesson = skillLessons.find((item) => item.id === lessonId);
  const next: SkillsProfile = {
    ...profile,
    completedLessonIds: [...profile.completedLessonIds, lessonId],
    scores: lesson
      ? bumpScore(profile.scores, lesson.skill, 4)
      : profile.scores,
  };
  saveSkillsProfile(next);
  return next;
}

export function markDrillComplete(drillId: string): SkillsProfile {
  const profile = loadSkillsProfile();
  if (profile.completedDrillIds.includes(drillId)) return profile;

  const drill = skillDrills.find((item) => item.id === drillId);
  const next: SkillsProfile = {
    ...profile,
    completedDrillIds: [...profile.completedDrillIds, drillId],
    scores: drill ? bumpScore(profile.scores, drill.skill, 5) : profile.scores,
  };
  saveSkillsProfile(next);
  return next;
}

export function saveReflection(
  input: Omit<TalkReflection, "id" | "createdAt">
): SkillsProfile {
  const profile = loadSkillsProfile();
  const reflection: TalkReflection = {
    ...input,
    id: `ref_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  let scores = bumpScore(profile.scores, "listening", 3);
  scores = bumpScore(scores, "calm", input.calmRating >= 4 ? 4 : 2);
  if (input.wentWell.trim().length > 12) {
    scores = bumpScore(scores, "clarity", 2);
  }
  if (input.nextTime.trim().length > 12) {
    scores = bumpScore(scores, "respect", 2);
  }

  const next: SkillsProfile = {
    ...profile,
    reflections: [reflection, ...profile.reflections].slice(0, 20),
    scores,
  };
  saveSkillsProfile(next);
  return next;
}

export function completeWeeklyHabit(weekKey: string): SkillsProfile {
  const profile = loadSkillsProfile();
  if (profile.weeklyHabitCompletedFor === weekKey) return profile;

  const next: SkillsProfile = {
    ...profile,
    weeklyHabitCompletedFor: weekKey,
    scores: bumpScore(profile.scores, "calm", 3),
  };
  saveSkillsProfile(next);
  return next;
}

/**
 * Soft pattern hints from private activity. No server, no judgment scoreboard.
 */
export function getPatternHints(profile: SkillsProfile): string[] {
  const hints: string[] = [];
  const { scores, completedLessonIds, reflections } = profile;

  if (profile.dailyStreak >= 3) {
    hints.push(
      `Nice consistency: a ${profile.dailyStreak}-day practice streak. Keep the daily strip short and steady.`
    );
  } else if (!profile.lastDailyCompletedOn) {
    hints.push(
      "Open Skills once a day, finish Today’s practice, and build a private streak."
    );
  }

  if (scores.listening + 8 < scores.clarity) {
    hints.push(
      "Your openers and explanations look stronger than your listening lines. Practice naming their worry first."
    );
  }
  if (scores.calm < 55 && reflections.some((item) => item.calmRating <= 2)) {
    hints.push(
      "Recent talks felt heated. Keep a pause line ready before the next hard conversation."
    );
  }
  if (
    !completedLessonIds.includes("ask-before-defending") &&
    scores.listening < 58
  ) {
    hints.push(
      "You may jump to defending. Try one sincere question before you explain your side."
    );
  }
  if (reflections.length >= 2) {
    const latest = reflections[0];
    if (latest?.nextTime.trim()) {
      hints.push(
        `Last time you wanted to try: “${truncate(latest.nextTime, 72)}”`
      );
    }
  }
  if (hints.length === 0) {
    hints.push(
      "Keep preparing talks and reflecting after them. Patterns will show up here privately."
    );
  }
  return hints.slice(0, 3);
}

function truncate(value: string, max: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}
