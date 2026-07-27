"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { RotateCcw, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/layout/container";
import { ProductSteps } from "@/components/layout/product-steps";
import { Button } from "@/components/ui/button";
import { ConversationPackView } from "@/components/result/conversation-pack-view";
import { RequireAuth } from "@/components/auth/require-auth";
import { loadPack, type StoredPackBundle } from "@/lib/pack-storage";

const STEPS = [
  { label: "Share details" },
  { label: "We prepare it" },
  { label: "Have the talk" },
];

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-6 w-6 animate-pulse rounded-full bg-canvas-muted" />
        </div>
      }
    >
      <RequireAuth>
        <ResultContent />
      </RequireAuth>
    </Suspense>
  );
}

function ResultContent() {
  const [bundle, setBundle] = useState<StoredPackBundle | null | undefined>(
    undefined
  );

  useEffect(() => {
    setBundle(loadPack());
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Your conversation pack"
        title="You're ready to talk."
        description="Read it over, adapt the wording to your own voice, and choose a calm moment."
      />
      <Container className="py-10 sm:py-14">
        <ProductSteps
          steps={STEPS}
          currentStep={2}
          className="mx-auto mb-10 max-w-xl"
        />

        {bundle === undefined ? (
          <div className="mx-auto max-w-3xl animate-pulse rounded-2xl border border-border bg-surface p-8">
            <div className="h-4 w-48 rounded bg-canvas-muted" />
            <div className="mt-6 h-24 rounded-lg bg-canvas-muted" />
            <div className="mt-4 h-24 rounded-lg bg-canvas-muted" />
          </div>
        ) : bundle === null ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-border bg-surface p-10 text-center">
            <p className="text-sm font-medium text-forest">Nothing here yet</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
              We couldn&apos;t find a conversation pack.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Packs live only in this browser and aren&apos;t saved anywhere.
              Prepare a new one to see it here.
            </p>
            <Button asChild className="mt-6">
              <Link href="/generate">
                <Wand2 className="h-4 w-4" />
                Prepare a conversation
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-8">
            <ConversationPackView
              pack={bundle.pack}
              input={bundle.input}
              source={bundle.meta.source}
            />
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="secondary">
                <Link href="/generate">
                  <RotateCcw className="h-4 w-4" />
                  Prepare another conversation
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/skills?tab=reflect">After the talk, reflect</Link>
              </Button>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
