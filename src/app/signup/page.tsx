import { Suspense } from "react";
import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a BridgeTalk profile on this device.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-canvas" />}>
      <SignupForm />
    </Suspense>
  );
}
