export type SkillDimension =
  | "clarity"
  | "respect"
  | "listening"
  | "calm";

export type SkillsTab = "learn" | "practice" | "reflect";

export interface SkillLesson {
  id: string;
  title: string;
  minutes: number;
  skill: SkillDimension;
  summary: string;
  whyItMatters: string;
  tryThis: string[];
  avoid: string;
}

export interface SkillDrill {
  id: string;
  title: string;
  skill: SkillDimension;
  prompt: string;
  harshLines: string[];
  hint: string;
}

export interface TalkReflection {
  id: string;
  createdAt: string;
  wentWell: string;
  escalated: string;
  nextTime: string;
  calmRating: 1 | 2 | 3 | 4 | 5;
}

export interface SkillsProfile {
  completedLessonIds: string[];
  completedDrillIds: string[];
  reflections: TalkReflection[];
  /** Soft 0–100 scores, private to this browser */
  scores: Record<SkillDimension, number>;
  weeklyHabitCompletedFor: string | null;
  /** Local calendar day key: YYYY-MM-DD */
  lastDailyCompletedOn: string | null;
  dailyStreak: number;
  /** Day key when a 1-day miss was forgiven for the streak */
  streakGraceUsedOn: string | null;
  /** Last self-check ratings from daily practice */
  lastDailyRatings?: {
    calm: boolean;
    clear: boolean;
    respectful: boolean;
  };
  updatedAt: string;
}
