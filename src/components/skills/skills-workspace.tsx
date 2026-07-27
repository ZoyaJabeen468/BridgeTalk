"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Check,
  Copy,
  Flame,
  Sparkles,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getWeeklyHabit,
  skillDimensions,
  skillDrills,
  skillLessons,
} from "@/constants/skills";
import type { SkillsProfile, SkillsTab } from "@/types/skills";
import {
  completeDailyPractice,
  completeWeeklyHabit,
  getPatternHints,
  loadSkillsProfile,
  markDrillComplete,
  markLessonComplete,
  saveReflection,
} from "@/lib/skills-storage";
import {
  buildDailyReminder,
  evaluateRewrite,
  getPackPracticeLines,
  getRecommendedLesson,
  resolveDailyPractice,
} from "@/lib/skills-logic";
import { loadPack, type StoredPackBundle } from "@/lib/pack-storage";
import { getAudienceLabel, getSituationLabel } from "@/constants/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const TABS: { id: SkillsTab; label: string }[] = [
  { id: "learn", label: "Learn" },
  { id: "practice", label: "Practice" },
  { id: "reflect", label: "Reflect" },
];

export function SkillsWorkspace() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as SkillsTab | null) ?? "learn";
  const [tab, setTab] = useState<SkillsTab>(
    TABS.some((item) => item.id === initialTab) ? initialTab : "learn"
  );
  const [profile, setProfile] = useState<SkillsProfile | null>(null);
  const [packBundle, setPackBundle] = useState<StoredPackBundle | null>(null);

  useEffect(() => {
    setProfile(loadSkillsProfile());
    setPackBundle(loadPack());
  }, []);

  useEffect(() => {
    const fromUrl = searchParams.get("tab") as SkillsTab | null;
    if (fromUrl && TABS.some((item) => item.id === fromUrl)) {
      setTab(fromUrl);
    }
  }, [searchParams]);

  const refresh = useCallback(() => {
    setProfile(loadSkillsProfile());
    setPackBundle(loadPack());
  }, []);

  if (!profile) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-28 rounded-2xl bg-canvas-muted" />
        <div className="h-64 rounded-2xl bg-canvas-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DailyPracticeCard
        profile={profile}
        packBundle={packBundle}
        onComplete={refresh}
      />

      <SkillsOverview
        profile={profile}
        packBundle={packBundle}
        onHabitDone={refresh}
        onOpenLesson={(lessonId) => {
          setTab("learn");
          window.setTimeout(() => {
            document
              .getElementById(`lesson-${lessonId}`)
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 80);
        }}
      />

      <div
        className="flex gap-1 rounded-md border border-border bg-canvas-muted/50 p-1"
        role="tablist"
        aria-label="Skills sections"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "flex-1 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors",
              tab === item.id
                ? "bg-surface text-ink shadow-subtle"
                : "text-ink-muted hover:text-ink"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "learn" ? (
        <LearnPanel profile={profile} onComplete={refresh} />
      ) : null}
      {tab === "practice" ? (
        <PracticePanel
          profile={profile}
          packBundle={packBundle}
          onComplete={refresh}
        />
      ) : null}
      {tab === "reflect" ? (
        <ReflectPanel
          profile={profile}
          packBundle={packBundle}
          onSaved={refresh}
        />
      ) : null}
    </div>
  );
}

function DailyPracticeCard({
  profile,
  packBundle,
  onComplete,
}: {
  profile: SkillsProfile;
  packBundle: StoredPackBundle | null;
  onComplete: () => void;
}) {
  const daily = useMemo(
    () => resolveDailyPractice(packBundle),
    [packBundle]
  );
  const [answer, setAnswer] = useState("");
  const [ratings, setRatings] = useState({
    calm: false,
    clear: false,
    respectful: false,
  });
  const [copied, setCopied] = useState(false);

  const done = profile.lastDailyCompletedOn === daily.dayKey;
  const review = useMemo(() => evaluateRewrite(answer), [answer]);
  const allRated = ratings.calm && ratings.clear && ratings.respectful;
  const canFinish = !done && review.ok && allRated;

  const streakLabel =
    profile.dailyStreak > 0
      ? `${profile.dailyStreak}-day streak`
      : "Start a streak today";

  return (
    <Card className="overflow-hidden border-forest/20 bg-forest-50/40 shadow-subtle">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-forest">
            Today’s practice · under 2 minutes
            {daily.fromPack ? " · from your pack" : null}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-forest">
            <Flame className="h-3.5 w-3.5" />
            {done || profile.dailyStreak > 0 ? streakLabel : "No streak yet"}
          </p>
        </div>
        <CardTitle className="font-display text-2xl leading-snug">
          {daily.title}
        </CardTitle>
        <p className="text-sm text-ink-muted">{daily.prompt}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="rounded-sm border border-border bg-surface px-3.5 py-3 text-sm text-ink">
          {daily.line}
        </p>
        <p className="text-sm text-forest">{daily.hint}</p>

        {done ? (
          <div className="space-y-2">
            <p className="inline-flex items-center gap-1.5 text-sm font-medium text-forest">
              <Check className="h-4 w-4" />
              Today’s practice done
              {profile.dailyStreak > 0
                ? ` · ${profile.dailyStreak}-day streak`
                : null}
            </p>
            <p className="text-sm text-ink-muted">{daily.useToday}</p>
            <p className="text-xs text-ink-subtle">
              Missed one day? One grace day keeps your streak.
            </p>
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor="daily-answer">Your version</Label>
              <Textarea
                id="daily-answer"
                className="mt-1.5 bg-surface"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Write a calmer line you could say out loud…"
              />
              {answer.trim().length >= 4 ? (
                <ul className="mt-2 space-y-1">
                  {review.tips.map((tip) => (
                    <li key={tip} className="text-xs text-ink-muted">
                      {tip}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div>
              <p className="text-sm font-medium text-ink">Self-check</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  [
                    ["calm", "Calm"],
                    ["clear", "Clear"],
                    ["respectful", "Respectful"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setRatings((prev) => ({ ...prev, [key]: !prev[key] }))
                    }
                    className={cn(
                      "rounded-sm border px-3 py-1.5 text-sm transition-colors",
                      ratings[key]
                        ? "border-forest bg-forest text-white"
                        : "border-border bg-surface text-ink-muted hover:text-ink"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-ink-subtle">
                Mark all three before finishing.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        buildDailyReminder(daily)
                      );
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 1800);
                    } catch {
                      // ignore
                    }
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? "Copied" : "Copy reminder"}
                </Button>
                <p className="self-center text-xs text-ink-subtle">
                  {daily.useToday}
                </p>
              </div>
              <Button
                disabled={!canFinish}
                onClick={() => {
                  const bonus = review.softScore >= 70 ? 1 : 0;
                  completeDailyPractice(
                    daily.dayKey,
                    daily.skill,
                    ratings,
                    bonus
                  );
                  onComplete();
                }}
              >
                Mark today done
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function SkillsOverview({
  profile,
  packBundle,
  onHabitDone,
  onOpenLesson,
}: {
  profile: SkillsProfile;
  packBundle: StoredPackBundle | null;
  onHabitDone: () => void;
  onOpenLesson: (lessonId: string) => void;
}) {
  const habit = useMemo(() => getWeeklyHabit(), []);
  const patterns = useMemo(() => getPatternHints(profile), [profile]);
  const recommended = useMemo(
    () => getRecommendedLesson(profile),
    [profile]
  );
  const habitDone = profile.weeklyHabitCompletedFor === habit.weekKey;
  const recommendedLesson = skillLessons.find(
    (item) => item.id === recommended.lessonId
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle className="font-display text-xl">
            Your private skill scores
          </CardTitle>
          <p className="text-sm text-ink-muted">
            Soft tracking in this browser only. Not shared. Not a grade.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {skillDimensions.map((dim) => {
            const value = profile.scores[dim.id];
            return (
              <div key={dim.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{dim.label}</p>
                  <p className="text-sm tabular-nums text-forest">{value}</p>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-warm-100">
                  <div
                    className="h-full rounded-full bg-forest transition-[width] duration-500"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-ink-subtle">{dim.blurb}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {recommendedLesson ? (
          <Card className="shadow-subtle">
            <CardHeader className="pb-3">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-forest">
                <BookOpen className="h-3.5 w-3.5" />
                Suggested next
              </p>
              <CardTitle className="font-display text-lg leading-snug">
                {recommendedLesson.title}
              </CardTitle>
              <p className="text-sm text-ink-muted">{recommended.reason}</p>
            </CardHeader>
            <CardContent>
              <Button size="sm" variant="secondary" onClick={() => onOpenLesson(recommendedLesson.id)}>
                Open lesson
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <Card className="shadow-subtle">
          <CardHeader className="pb-3">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-forest">
              This week
            </p>
            <CardTitle className="font-display text-lg leading-snug">
              {habit.prompt}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {habitDone ? (
              <p className="inline-flex items-center gap-1.5 text-sm text-forest">
                <Check className="h-4 w-4" />
                Marked for this week
              </p>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  completeWeeklyHabit(habit.weekKey);
                  onHabitDone();
                }}
              >
                I practiced this
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="pb-3">
            <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-forest">
              <Sparkles className="h-3.5 w-3.5" />
              Patterns
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2.5">
              {patterns.map((hint) => (
                <li
                  key={hint}
                  className="text-sm leading-relaxed text-ink-muted"
                >
                  {hint}
                </li>
              ))}
            </ul>
            {!packBundle ? (
              <Button asChild size="sm" variant="outline" className="w-full">
                <Link href="/generate">
                  <Wand2 className="h-3.5 w-3.5" />
                  Prepare a pack to personalize practice
                </Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LearnPanel({
  profile,
  onComplete,
}: {
  profile: SkillsProfile;
  onComplete: () => void;
}) {
  const recommended = getRecommendedLesson(profile);
  const [openId, setOpenId] = useState<string | null>(
    recommended.lessonId || skillLessons[0]?.id || null
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-muted">
        Five short lessons. About two minutes each. Built for hard talks at home.
      </p>
      {skillLessons.map((lesson) => {
        const done = profile.completedLessonIds.includes(lesson.id);
        const open = openId === lesson.id;
        const suggested = lesson.id === recommended.lessonId && !done;
        return (
          <Card
            key={lesson.id}
            id={`lesson-${lesson.id}`}
            className={cn(
              "shadow-subtle overflow-hidden scroll-mt-28",
              suggested && "ring-1 ring-forest/30"
            )}
          >
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 p-5 text-left"
              onClick={() => setOpenId(open ? null : lesson.id)}
              aria-expanded={open}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-ink-subtle">
                  {lesson.minutes} min · {skillLabel(lesson.skill)}
                  {suggested ? " · suggested" : null}
                </p>
                <h3 className="font-display mt-1 text-lg font-semibold text-ink">
                  {lesson.title}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">{lesson.summary}</p>
              </div>
              {done ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-forest-50 px-2 py-1 text-xs font-medium text-forest">
                  <Check className="h-3.5 w-3.5" />
                  Done
                </span>
              ) : null}
            </button>
            {open ? (
              <div className="border-t border-border px-5 pb-5 pt-4">
                <p className="text-sm leading-relaxed text-ink">
                  <span className="font-medium">Why it matters. </span>
                  {lesson.whyItMatters}
                </p>
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.1em] text-ink-subtle">
                  Try this
                </p>
                <ul className="mt-2 space-y-1.5">
                  {lesson.tryThis.map((item) => (
                    <li key={item} className="text-sm text-ink-muted">
                      · {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-ink-muted">
                  <span className="font-medium text-ink">Avoid: </span>
                  {lesson.avoid}
                </p>
                {!done ? (
                  <Button
                    className="mt-5"
                    size="sm"
                    onClick={() => {
                      markLessonComplete(lesson.id);
                      onComplete();
                    }}
                  >
                    Mark as practiced
                  </Button>
                ) : null}
              </div>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}

function PracticePanel({
  profile,
  packBundle,
  onComplete,
}: {
  profile: SkillsProfile;
  packBundle: StoredPackBundle | null;
  onComplete: () => void;
}) {
  const packLines = useMemo(
    () => getPackPracticeLines(packBundle?.pack),
    [packBundle]
  );
  const [mode, setMode] = useState<"pack" | "library">(
    packLines.length ? "pack" : "library"
  );
  const [activeId, setActiveId] = useState(skillDrills[0]?.id ?? "");
  const drill = skillDrills.find((item) => item.id === activeId) ?? skillDrills[0];
  const [answers, setAnswers] = useState<string[]>([]);
  const [packAnswers, setPackAnswers] = useState<string[]>([]);
  const [packDone, setPackDone] = useState(false);

  useEffect(() => {
    if (!drill) return;
    setAnswers(drill.harshLines.map(() => ""));
  }, [drill]);

  useEffect(() => {
    setPackAnswers(packLines.map(() => ""));
    setPackDone(false);
  }, [packLines]);

  if (!drill) return null;

  const done = profile.completedDrillIds.includes(drill.id);
  const canComplete =
    !done && answers.every((line) => line.trim().length >= 8);
  const canFinishPack =
    !packDone &&
    packLines.length > 0 &&
    packAnswers.every((line) => line.trim().length >= 8);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("pack")}
          className={cn(
            "rounded-sm border px-3 py-1.5 text-sm transition-colors",
            mode === "pack"
              ? "border-forest bg-forest-50 text-forest"
              : "border-border bg-surface text-ink-muted"
          )}
        >
          From your pack
        </button>
        <button
          type="button"
          onClick={() => setMode("library")}
          className={cn(
            "rounded-sm border px-3 py-1.5 text-sm transition-colors",
            mode === "library"
              ? "border-forest bg-forest-50 text-forest"
              : "border-border bg-surface text-ink-muted"
          )}
        >
          Library drills
        </button>
      </div>

      {mode === "pack" ? (
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Practice your real lines
            </CardTitle>
            <p className="text-sm text-ink-muted">
              Soften risky phrases from your latest conversation pack.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {packLines.length === 0 ? (
              <div className="rounded-sm border border-dashed border-border bg-canvas-muted/30 p-5 text-center">
                <p className="text-sm text-ink-muted">
                  No pack lines yet. Prepare a conversation first, then practice
                  here.
                </p>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/generate">Prepare a conversation</Link>
                </Button>
              </div>
            ) : (
              <>
                {packLines.map((item, index) => (
                  <div key={item.phrase}>
                    <Label className="text-ink-muted">Risky line {index + 1}</Label>
                    <p className="mt-1 rounded-sm border border-border bg-canvas-muted/40 px-3 py-2 text-sm text-ink">
                      {item.phrase}
                    </p>
                    {item.better ? (
                      <p className="mt-1 text-xs text-forest">
                        Pack suggestion: {item.better}
                      </p>
                    ) : null}
                    <Textarea
                      className="mt-2"
                      placeholder="Your calmer version…"
                      value={packAnswers[index] ?? ""}
                      onChange={(event) => {
                        const next = [...packAnswers];
                        next[index] = event.target.value;
                        setPackAnswers(next);
                      }}
                      disabled={packDone}
                    />
                  </div>
                ))}
                {packDone ? (
                  <p className="inline-flex items-center gap-1.5 text-sm text-forest">
                    <Check className="h-4 w-4" />
                    Pack practice saved to your respect score.
                  </p>
                ) : (
                  <Button
                    disabled={!canFinishPack}
                    onClick={() => {
                      markDrillComplete("soften-harsh-lines");
                      setPackDone(true);
                      onComplete();
                    }}
                  >
                    Finish pack practice
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-ink-muted">
            Sixty-second drills. Rewrite tense lines into words you could actually say.
          </p>
          <div className="flex flex-wrap gap-2">
            {skillDrills.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "rounded-sm border px-3 py-1.5 text-sm transition-colors",
                  item.id === drill.id
                    ? "border-forest bg-forest-50 text-forest"
                    : "border-border bg-surface text-ink-muted hover:text-ink"
                )}
              >
                {item.title}
              </button>
            ))}
          </div>

          <Card className="shadow-subtle">
            <CardHeader>
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-ink-subtle">
                Practice this skill · {skillLabel(drill.skill)}
              </p>
              <CardTitle className="font-display text-xl">{drill.title}</CardTitle>
              <p className="text-sm text-ink-muted">{drill.prompt}</p>
              <p className="text-sm text-forest">{drill.hint}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {drill.harshLines.map((line, index) => (
                <div key={line}>
                  <Label className="text-ink-muted">Line {index + 1}</Label>
                  <p className="mt-1 rounded-sm border border-border bg-canvas-muted/40 px-3 py-2 text-sm text-ink">
                    {line}
                  </p>
                  <Textarea
                    className="mt-2"
                    placeholder="Your calmer version…"
                    value={answers[index] ?? ""}
                    onChange={(event) => {
                      const next = [...answers];
                      next[index] = event.target.value;
                      setAnswers(next);
                    }}
                    disabled={done}
                  />
                </div>
              ))}

              {done ? (
                <p className="inline-flex items-center gap-1.5 text-sm text-forest">
                  <Check className="h-4 w-4" />
                  Drill completed. Your private scores updated a little.
                </p>
              ) : (
                <Button
                  disabled={!canComplete}
                  onClick={() => {
                    markDrillComplete(drill.id);
                    onComplete();
                  }}
                >
                  Finish 60-second practice
                </Button>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function ReflectPanel({
  profile,
  packBundle,
  onSaved,
}: {
  profile: SkillsProfile;
  packBundle: StoredPackBundle | null;
  onSaved: () => void;
}) {
  const [wentWell, setWentWell] = useState("");
  const [escalated, setEscalated] = useState("");
  const [nextTime, setNextTime] = useState("");
  const [calmRating, setCalmRating] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [savedFlash, setSavedFlash] = useState(false);

  const contextLine = packBundle
    ? `${getAudienceLabel(packBundle.input.audience)} · ${getSituationLabel(packBundle.input.situation)}`
    : null;

  function handleSave() {
    if (!wentWell.trim() && !escalated.trim() && !nextTime.trim()) return;
    saveReflection({
      wentWell: wentWell.trim(),
      escalated: escalated.trim(),
      nextTime: nextTime.trim(),
      calmRating,
    });
    setWentWell("");
    setEscalated("");
    setNextTime("");
    setCalmRating(3);
    setSavedFlash(true);
    onSaved();
    window.setTimeout(() => setSavedFlash(false), 2200);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle className="font-display text-xl">How did the talk go?</CardTitle>
          <p className="text-sm text-ink-muted">
            A short reflection teaches more than another perfect script. Private to
            this browser.
          </p>
          {contextLine ? (
            <p className="rounded-sm border border-border bg-canvas-muted/40 px-3 py-2 text-xs text-ink-muted">
              Last pack context: {contextLine}
            </p>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="went-well">What went well</Label>
            <Textarea
              id="went-well"
              className="mt-1.5"
              value={wentWell}
              onChange={(event) => setWentWell(event.target.value)}
              placeholder="They listened when I named their worry first…"
            />
          </div>
          <div>
            <Label htmlFor="escalated">What escalated</Label>
            <Textarea
              id="escalated"
              className="mt-1.5"
              value={escalated}
              onChange={(event) => setEscalated(event.target.value)}
              placeholder="I got defensive when relatives were mentioned…"
            />
          </div>
          <div>
            <Label htmlFor="next-time">One thing to try next time</Label>
            <Textarea
              id="next-time"
              className="mt-1.5"
              value={nextTime}
              onChange={(event) => setNextTime(event.target.value)}
              placeholder="Ask one question before I explain my plan…"
            />
          </div>
          <div>
            <Label>How calm did you stay? ({calmRating}/5)</Label>
            <div className="mt-2 flex gap-2">
              {([1, 2, 3, 4, 5] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCalmRating(value)}
                  className={cn(
                    "h-9 w-9 rounded-sm border text-sm font-medium transition-colors",
                    calmRating === value
                      ? "border-forest bg-forest text-white"
                      : "border-border bg-surface text-ink-muted hover:text-ink"
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleSave}>Save reflection</Button>
          {savedFlash ? (
            <p className="text-sm text-forest">
              Saved. Your skill scores updated a little.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle className="text-lg">Recent reflections</CardTitle>
        </CardHeader>
        <CardContent>
          {profile.reflections.length === 0 ? (
            <p className="text-sm text-ink-muted">
              After your next hard talk, come back here. Patterns get clearer over
              time.
            </p>
          ) : (
            <ul className="space-y-4">
              {profile.reflections.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className="rounded-md border border-border bg-canvas-muted/30 p-3.5"
                >
                  <p className="text-xs text-ink-subtle">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    · Calm {item.calmRating}/5
                  </p>
                  {item.nextTime ? (
                    <p className="mt-2 text-sm text-ink">
                      <span className="text-ink-muted">Next time: </span>
                      {item.nextTime}
                    </p>
                  ) : null}
                  {item.wentWell ? (
                    <p className="mt-1 text-sm text-ink-muted">{item.wentWell}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function skillLabel(skill: string): string {
  return skillDimensions.find((item) => item.id === skill)?.label ?? skill;
}
