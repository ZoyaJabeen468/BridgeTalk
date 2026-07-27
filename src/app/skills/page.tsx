import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/layout/container";
import { SkillsWorkspace } from "@/components/skills/skills-workspace";
import { RequireAuth } from "@/components/auth/require-auth";

export const metadata: Metadata = {
  title: "Communication skills",
  description:
    "Short lessons, practice drills, and private reflections to get better at hard conversations over time.",
};

export default function SkillsPage() {
  return (
    <Suspense fallback={<SkillsSkeleton />}>
      <RequireAuth>
        <PageHeader
          eyebrow="Skills"
          title="Get better at every hard talk."
          description="Prepare a conversation when you need one. Use Skills to build calmer habits between talks. Private to your browser."
        />
        <Container className="py-10 sm:py-14">
          <div className="mx-auto max-w-4xl">
            <SkillsWorkspace />
          </div>
        </Container>
      </RequireAuth>
    </Suspense>
  );
}

function SkillsSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-4 px-4 py-28">
      <div className="h-28 rounded-2xl bg-canvas-muted" />
      <div className="h-12 rounded-md bg-canvas-muted" />
      <div className="h-64 rounded-2xl bg-canvas-muted" />
    </div>
  );
}
