import type { SkillDrill, SkillDimension, SkillLesson } from "@/types/skills";

export const skillDimensions: {
  id: SkillDimension;
  label: string;
  blurb: string;
}[] = [
  {
    id: "clarity",
    label: "Clarity",
    blurb: "Say what you mean in short, plain words.",
  },
  {
    id: "respect",
    label: "Respect",
    blurb: "Keep dignity on both sides, even when you disagree.",
  },
  {
    id: "listening",
    label: "Listening",
    blurb: "Show you heard their worry before you explain yours.",
  },
  {
    id: "calm",
    label: "Calm under pressure",
    blurb: "Slow down when the room gets tense.",
  },
];

export const skillLessons: SkillLesson[] = [
  {
    id: "start-soft",
    title: "Start soft",
    minutes: 2,
    skill: "respect",
    summary:
      "Open with care, not with your full case. The first 20 seconds set the temperature.",
    whyItMatters:
      "A hard topic delivered cold often sounds like an attack, even when your intent is honest.",
    tryThis: [
      "Ask for a few minutes, then name why their view matters to you.",
      "Share one sentence of context before your request.",
      "Keep your voice slower than usual.",
    ],
    avoid: "Starting with “You never understand” or dumping the whole plan at once.",
  },
  {
    id: "name-worry-first",
    title: "Name their worry first",
    minutes: 2,
    skill: "listening",
    summary:
      "Say the fear you think they carry, then share your side. People relax when they feel seen.",
    whyItMatters:
      "If you skip their worry, they spend the talk defending it instead of hearing you.",
    tryThis: [
      "“I know stability matters a lot to you.”",
      "“You might worry this looks rushed.”",
      "Then add: “Here’s what I’ve thought about…”",
    ],
    avoid: "Dismissing their worry as old-fashioned or overprotective.",
  },
  {
    id: "ask-before-defending",
    title: "Ask before defending",
    minutes: 2,
    skill: "listening",
    summary:
      "One sincere question buys trust. Defense too early makes both of you dig in.",
    whyItMatters:
      "Questions turn a clash into a conversation. Defense turns it into a debate.",
    tryThis: [
      "“What worries you most about this?”",
      "“What would help you feel safer with this plan?”",
      "Repeat their answer in your own words before you reply.",
    ],
    avoid: "Answering every doubt with a longer speech.",
  },
  {
    id: "pause-when-voices-rise",
    title: "Pause when voices rise",
    minutes: 2,
    skill: "calm",
    summary:
      "When volume goes up, clarity goes down. A short pause protects the relationship.",
    whyItMatters:
      "Words said in heat are hard to take back, especially at home.",
    tryThis: [
      "“I want to keep talking, but let’s slow down for a minute.”",
      "Take a sip of water. Soften your shoulders.",
      "If needed: “Can we continue after Maghrib / after dinner?”",
    ],
    avoid: "Matching their volume or walking out without a return time.",
  },
  {
    id: "end-with-next-step",
    title: "End with a next step",
    minutes: 2,
    skill: "clarity",
    summary:
      "Even if you don’t agree today, leave with one clear next step and a time to revisit.",
    whyItMatters:
      "Open endings create silent tension. A next step keeps hope and structure.",
    tryThis: [
      "“Let’s revisit this on Sunday after I’ve written the plan.”",
      "“I’ll share numbers this week, then we talk again.”",
      "Thank them for listening, even if the answer was no for now.",
    ],
    avoid: "Leaving in anger with no plan to talk again.",
  },
];

export const skillDrills: SkillDrill[] = [
  {
    id: "soften-harsh-lines",
    title: "Rewrite harsh lines",
    skill: "respect",
    prompt:
      "Rewrite each line so it stays honest but lowers tension. Keep it short enough to say out loud.",
    harshLines: [
      "You just don’t get how the world works now.",
      "I’m doing this whether you like it or not.",
      "Everyone else’s parents are more open-minded.",
    ],
    hint: "Lead with respect, name a shared goal, then state your need.",
  },
  {
    id: "name-the-worry",
    title: "Name the worry",
    skill: "listening",
    prompt:
      "For each worry, write one line that shows you heard it before you explain your plan.",
    harshLines: [
      "They’re scared this path has no stable income.",
      "They worry relatives will judge the family.",
      "They think you’ll regret changing direction later.",
    ],
    hint: "Start with “I know you’re worried about…” then stop. Don’t argue yet.",
  },
  {
    id: "pause-lines",
    title: "Pause lines for heated moments",
    skill: "calm",
    prompt:
      "Write a calm line you could use if voices rise. Practice saying it slowly.",
    harshLines: [
      "The other person raises their voice.",
      "Someone brings up an old mistake.",
      "You feel yourself getting defensive.",
    ],
    hint: "Ask for a pause and a return time. Don’t close the door forever.",
  },
];

export interface DailyPractice {
  dayKey: string;
  title: string;
  skill: SkillDimension;
  prompt: string;
  line: string;
  hint: string;
  useToday: string;
}

/** One short practice per calendar day. Same day = same prompt for everyone. */
export function getDailyPractice(date = new Date()): DailyPractice {
  const dayKey = getLocalDayKey(date);
  const pool: Omit<DailyPractice, "dayKey">[] = [
    {
      title: "Soften one harsh line",
      skill: "respect",
      prompt: "Rewrite this in words you could say without raising the temperature.",
      line: "You never listen when I try to explain my future.",
      hint: "Start with care, then state your need in one short sentence.",
      useToday: "Use a softer opener in one real talk today, even a small one.",
    },
    {
      title: "Name the worry first",
      skill: "listening",
      prompt: "Write one line that shows you heard this worry before you explain yourself.",
      line: "They’re afraid this choice has no stable income.",
      hint: "Begin with “I know you’re worried about…” and pause.",
      useToday: "In one conversation, name their worry before your point.",
    },
    {
      title: "Ask before defending",
      skill: "listening",
      prompt: "Turn this defensive urge into one sincere question.",
      line: "I already thought about this. Why can’t you just trust me?",
      hint: "Ask what would help them feel safer with your plan.",
      useToday: "Ask one real question before you explain your side.",
    },
    {
      title: "Pause line for heat",
      skill: "calm",
      prompt: "Write a calm line you can say if voices rise.",
      line: "The other person raises their voice and brings up an old mistake.",
      hint: "Ask for a short pause and a time to continue.",
      useToday: "If tension rises today, use your pause line once.",
    },
    {
      title: "End with a next step",
      skill: "clarity",
      prompt: "Write a closing line that leaves one clear next step.",
      line: "We disagree and both feel stuck. The talk ends with silence.",
      hint: "Suggest one small follow-up and a day to revisit.",
      useToday: "Close one talk with a next step, even if you don’t agree yet.",
    },
    {
      title: "Start soft",
      skill: "respect",
      prompt: "Rewrite this cold opening into a soft start.",
      line: "I need to tell you something and I already decided.",
      hint: "Ask for a few minutes and say their advice matters.",
      useToday: "Start one important message softer than usual.",
    },
    {
      title: "Keep it short",
      skill: "clarity",
      prompt: "Cut this explanation to two calm sentences.",
      line: "I’ve researched everything for months, compared options, talked to friends, and I know more about this field than anyone at home so you should just support me.",
      hint: "One feeling + one plan. Save details for questions.",
      useToday: "In one talk, stop after two clear sentences and listen.",
    },
  ];

  const index = dayNumber(date) % pool.length;
  const item = pool[index] ?? pool[0];
  return { dayKey, ...item };
}

export function getLocalDayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000
  );
}

/** Rotates by ISO week so the habit feels fresh without a backend. */
export function getWeeklyHabit(date = new Date()): {
  weekKey: string;
  prompt: string;
} {
  const weekKey = getIsoWeekKey(date);
  const habits = [
    "This week, reflect one sentence before you reply in a hard talk.",
    "This week, name their worry out loud before you share your plan.",
    "This week, start one important talk with a soft opener.",
    "This week, ask one sincere question before you defend yourself.",
    "This week, end one talk with a clear next step and a time.",
  ];
  const index = Number(weekKey.replace("-W", "")) % habits.length;
  return { weekKey, prompt: habits[index] ?? habits[0] };
}

export function getIsoWeekKey(date: Date): string {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export const defaultSkillScores: Record<SkillDimension, number> = {
  clarity: 55,
  respect: 60,
  listening: 50,
  calm: 52,
};
