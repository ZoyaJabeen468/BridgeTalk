import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/layout/container";
import { ProductSteps } from "@/components/layout/product-steps";
import { ConversationForm } from "@/components/generate/conversation-form";
import { RequireAuth } from "@/components/auth/require-auth";

export const metadata: Metadata = {
  title: "Prepare a conversation",
  description:
    "Share your situation and receive a calm, bilingual conversation pack tailored to who you're talking to.",
};

const STEPS = [
  { label: "Share details" },
  { label: "We prepare it" },
  { label: "Have the talk" },
];

export default function GeneratePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <RequireAuth>
        <PageHeader
          eyebrow="Prepare a conversation"
          title="Tell us what you need to say."
          description="Answer a few honest questions. We'll turn them into a calm opener, a bilingual explanation, and language that lowers conflict."
        />
        <Container className="py-10 sm:py-14">
          <ProductSteps
            steps={STEPS}
            currentStep={0}
            className="mx-auto mb-10 max-w-xl"
          />
          <div className="mx-auto max-w-3xl">
            <Suspense fallback={<FormSkeleton />}>
              <ConversationForm />
            </Suspense>
          </div>
        </Container>
      </RequireAuth>
    </Suspense>
  );
}

function PageSkeleton() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-6 w-6 animate-pulse rounded-full bg-canvas-muted" />
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-surface p-8">
      <div className="h-4 w-40 rounded bg-canvas-muted" />
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="h-11 rounded-lg bg-canvas-muted" />
        <div className="h-11 rounded-lg bg-canvas-muted" />
      </div>
      <div className="mt-6 h-24 rounded-lg bg-canvas-muted" />
      <div className="mt-6 h-20 rounded-lg bg-canvas-muted" />
    </div>
  );
}
