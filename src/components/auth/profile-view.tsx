"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Flame,
  LoaderCircle,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { loadSkillsProfile } from "@/lib/skills-storage";
import { cn } from "@/lib/utils";
import type { ConversationTone } from "@/types";

const tones: { value: ConversationTone; label: string; blurb: string }[] = [
  { value: "calm", label: "Calm", blurb: "Soft start, less tension" },
  { value: "practical", label: "Practical", blurb: "Plans and next steps" },
  { value: "warm", label: "Warm", blurb: "Caring and reassuring" },
];

export function ProfileView() {
  const router = useRouter();
  const { user, ready, signOut, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [tone, setTone] = useState<ConversationTone>("calm");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lessonCount, setLessonCount] = useState(0);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login?next=/profile");
      return;
    }
    setName(user.name);
    setBio(user.bio ?? "");
    setTone(user.preferredTone ?? "calm");

    const skills = loadSkillsProfile();
    setStreak(skills.dailyStreak);
    setLessonCount(skills.completedLessonIds.length);
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoaderCircle className="h-6 w-6 animate-spin text-forest" />
      </div>
    );
  }

  function onSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    const result = updateProfile({
      name,
      bio,
      preferredTone: tone,
    });
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage("Profile updated.");
  }

  function onSignOut() {
    signOut();
    router.push("/");
  }

  const initials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title={`Hello, ${user.name.split(" ")[0]}.`}
        description="Your BridgeTalk space on this device. Preferences, skills progress, and account."
      />

      <Container className="py-10 sm:py-14">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <Card className="overflow-hidden shadow-subtle">
              <div className="bg-gradient-to-br from-forest-800 via-forest-700 to-forest-900 px-6 py-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-lg font-semibold ring-1 ring-white/25">
                    {initials || "BT"}
                  </div>
                  <div>
                    <p className="font-display text-xl font-semibold tracking-tight">
                      {user.name}
                    </p>
                    <p className="mt-0.5 text-sm text-white/70">{user.email}</p>
                  </div>
                </div>
              </div>
              <CardContent className="grid grid-cols-2 gap-3 p-5">
                <div className="rounded-sm border border-border bg-canvas-muted/40 px-3 py-3">
                  <p className="inline-flex items-center gap-1 text-xs text-ink-subtle">
                    <Flame className="h-3.5 w-3.5 text-forest" />
                    Streak
                  </p>
                  <p className="mt-1 text-lg font-semibold text-ink">
                    {streak} day{streak === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="rounded-sm border border-border bg-canvas-muted/40 px-3 py-3">
                  <p className="inline-flex items-center gap-1 text-xs text-ink-subtle">
                    <Sparkles className="h-3.5 w-3.5 text-forest" />
                    Lessons
                  </p>
                  <p className="mt-1 text-lg font-semibold text-ink">
                    {lessonCount} done
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-subtle">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="secondary" className="w-full justify-between">
                  <Link href="/skills">
                    Continue Skills
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-between">
                  <Link href="/generate">
                    Prepare a conversation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-danger hover:bg-danger/5 hover:text-danger"
                  onClick={onSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Account details
              </CardTitle>
              <p className="text-sm text-ink-muted">
                Stored only in this browser for now.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSave} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="profile-name">Name</Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-11 rounded-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    value={user.email}
                    disabled
                    className="h-11 rounded-sm bg-canvas-muted"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-bio">About you</Label>
                  <Textarea
                    id="profile-bio"
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    placeholder="Optional. What kinds of talks are you preparing for?"
                    className="rounded-sm"
                  />
                </div>

                <div>
                  <Label>Preferred tone</Label>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {tones.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setTone(item.value)}
                        className={cn(
                          "rounded-sm border px-3 py-3 text-left transition-colors",
                          tone === item.value
                            ? "border-forest bg-forest-50"
                            : "border-border bg-surface hover:bg-canvas-muted"
                        )}
                      >
                        <p className="text-sm font-medium text-ink">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {item.blurb}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {error ? (
                  <p className="text-sm text-danger" role="alert">
                    {error}
                  </p>
                ) : null}
                {message ? (
                  <p className="text-sm text-forest">{message}</p>
                ) : null}

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </>
  );
}
