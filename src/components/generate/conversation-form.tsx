"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Sparkles, TriangleAlert, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GenerationProgress } from "@/components/generate/generation-progress";
import {
  audiences,
  personalities,
  sampleFormValues,
  situations,
  tones,
} from "@/constants/form";
import {
  conversationFormSchema,
  type ConversationFormInput,
} from "@/lib/validation/conversation";
import { savePack } from "@/lib/pack-storage";
import { cn } from "@/lib/utils";

const EMPTY_FORM: ConversationFormInput = {
  audience: "parents",
  situation: "freelancing",
  decisionSummary: "",
  concerns: "",
  listenerStyle: undefined,
  culturalContext: "",
  tone: "calm",
};

type FieldErrors = Partial<Record<keyof ConversationFormInput, string>>;

export function ConversationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState<ConversationFormInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get("sample") === "1") {
      setForm(sampleFormValues);
      return;
    }

    const audienceParam = searchParams.get("audience");
    const matched = audiences.find((item) => item.value === audienceParam);
    if (matched) {
      setForm((prev) => ({ ...prev, audience: matched.value }));
    }
  }, [searchParams]);

  function updateField<K extends keyof ConversationFormInput>(
    key: K,
    value: ConversationFormInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleTrySample() {
    setForm(sampleFormValues);
    setErrors({});
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = conversationFormSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ConversationFormInput;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      savePack(data.pack, parsed.data, {
        source: data.source,
        model: data.model,
      });
      router.push("/result");
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "We couldn't prepare your conversation pack. Please try again."
      );
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className={cn("p-6 sm:p-8", isSubmitting && "min-h-[420px]")}>
        {isSubmitting ? (
          <GenerationProgress />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-7" noValidate>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium text-forest">
                  <Sparkles className="h-4 w-4" />
                  Tell us about the conversation
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  A few honest details help us prepare something that actually fits.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleTrySample}
              >
                <Wand2 className="h-3.5 w-3.5" />
                Try a sample
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="audience">Who will you talk to?</Label>
                <Select
                  value={form.audience}
                  onValueChange={(value) =>
                    updateField("audience", value as ConversationFormInput["audience"])
                  }
                >
                  <SelectTrigger id="audience">
                    <SelectValue placeholder="Choose someone" />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.audience} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="situation">What's the topic?</Label>
                <Select
                  value={form.situation}
                  onValueChange={(value) =>
                    updateField("situation", value as ConversationFormInput["situation"])
                  }
                >
                  <SelectTrigger id="situation">
                    <SelectValue placeholder="Choose a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {situations.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.situation} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="decisionSummary">What do you want to explain?</Label>
              <Textarea
                id="decisionSummary"
                placeholder="e.g. I want to freelance in AI agents while finishing my degree, with a monthly savings target and a six-month review together."
                value={form.decisionSummary}
                onChange={(event) => updateField("decisionSummary", event.target.value)}
                rows={4}
              />
              <FieldError message={errors.decisionSummary} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="concerns">What might they worry about?</Label>
              <Textarea
                id="concerns"
                placeholder="e.g. Income stability, what relatives will say, finishing university on time"
                value={form.concerns}
                onChange={(event) => updateField("concerns", event.target.value)}
                rows={3}
              />
              <FieldError message={errors.concerns} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="listenerStyle">How do they usually respond?</Label>
                <Select
                  value={form.listenerStyle}
                  onValueChange={(value) =>
                    updateField(
                      "listenerStyle",
                      value as ConversationFormInput["listenerStyle"]
                    )
                  }
                >
                  <SelectTrigger id="listenerStyle">
                    <SelectValue placeholder="Not sure yet" />
                  </SelectTrigger>
                  <SelectContent>
                    {personalities.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.listenerStyle} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone for the conversation</Label>
                <Select
                  value={form.tone ?? "calm"}
                  onValueChange={(value) =>
                    updateField("tone", value as ConversationFormInput["tone"])
                  }
                >
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Choose a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label} — {item.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.tone} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="culturalContext">
                Family / cultural context <span className="text-ink-subtle">(optional)</span>
              </Label>
              <Input
                id="culturalContext"
                placeholder="e.g. Joint family, first child choosing a non-traditional path"
                value={form.culturalContext ?? ""}
                onChange={(event) => updateField("culturalContext", event.target.value)}
              />
              <FieldError message={errors.culturalContext} />
            </div>

            {formError ? (
              <div className="flex items-start gap-2 rounded-lg border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{formError}</p>
              </div>
            ) : null}

            <div className="flex flex-col-reverse items-stretch gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-ink-subtle">
                Nothing is saved on a server. Your pack stays in this browser.
              </p>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                Prepare my conversation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-danger">{message}</p>;
}
