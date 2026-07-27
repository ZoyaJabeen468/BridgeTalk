import { Hero } from "@/components/landing/hero";
import { AudienceShowcase } from "@/components/landing/audience-showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ExamplePreview } from "@/components/landing/example-preview";
import { FinalCta } from "@/components/landing/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AudienceShowcase />
      <HowItWorks />
      <ExamplePreview />
      <FinalCta />
    </>
  );
}
