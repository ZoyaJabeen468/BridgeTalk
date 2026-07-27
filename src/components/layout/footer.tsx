import Link from "next/link";
import { siteConfig } from "@/constants/site";
import { footerLinks } from "@/constants/navigation";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/brand/logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-canvas-muted/40 print:hidden">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              {siteConfig.positioning}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {siteConfig.productSignals.map((signal) => (
                <span
                  key={signal}
                  className="rounded-full border border-border bg-white px-2.5 py-1 text-xs text-ink-muted"
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-subtle">
              Product
            </p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-subtle">
              Guidance
            </p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.guidance.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-subtle">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="text-xs text-ink-subtle">
            A communication coach, not a persuasion tool. Data stays in your
            browser.
          </p>
        </div>
      </Container>
    </footer>
  );
}
