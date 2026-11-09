import type { Metadata } from "next";
import Link from "next/link";
import { tiers } from "@/content/site";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { BookButton } from "@/components/booking/Booking";
import { Icon } from "@/components/ui/Icon";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";
import { CaseCard } from "@/components/work/CaseCard";
import { getCase } from "@/content/site";

export const metadata: Metadata = {
  title: "Pricing: Workflow Assessment, AI Pilots & Implementation",
  description: "Practical AI, scoped and priced up front. Free Workflow Review, $4,500 fixed Workflow Assessment, AI pilots from $12,000, implementation from $35,000.",
  alternates: { canonical: "/pricing" },
};

const faqs = [
  { q: "Why start with a paid assessment?", a: "Because most AI projects fail on scoping, not engineering. Two weeks of assessment gives you a process map, a proof of concept on your data and a fixed pilot budget, so you can say no with evidence." },
  { q: "What is not included in the pilot price?", a: "Third-party licenses and model usage costs, which we estimate up front and you pay directly. Anything outside the agreed workflow is quoted separately before work starts." },
  { q: "Can we skip the assessment?", a: "If you already have a clear spec and clean data, yes. We'll ask a few questions on the Workflow Review call to check." },
  { q: "Do you offer ongoing support?", a: "Yes, as a monthly retainer sized to the systems we've built. We quote it at the end of the pilot, when we both know what needs looking after." },
];

export default function PricingPage() {
  return (
    <>
      <PageHero art="pricing"
        title="Practical AI, scoped and priced up front."
        lead="Four stops. You see evidence at each one before you commit to the next."
        crumbs={[{ label: "Home", href: "/" }, { label: "Pricing", href: "/pricing" }]}
        wide
      />
      <section className="pb-[var(--section)]">
        <div className="container-x">
          <Reveal variant="rise" stagger={0.1} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`relative flex flex-col rounded-[var(--r-card)] border p-6 shadow-[inset_0_1px_0_var(--hi)] ${t.recommended ? "border-[var(--accent)] bg-[var(--surface-2)]" : "border-[var(--line)] bg-[var(--surface)]"}`}
              >
                {t.recommended && <span className="absolute -top-3 left-6 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[12.5px] text-[var(--accent-ink)]">Where most clients start</span>}
                <h2 className="text-[19px] tracking-[-0.015em]">{t.name}</h2>
                <div className="mt-5 whitespace-nowrap text-[clamp(30px,2.5vw,38px)] font-medium leading-none tracking-[-0.035em] tnum">{t.price}</div>
                <div className="mt-2 font-mono text-[12.5px] text-[var(--ink-3)]">{t.unit}</div>
                <p className="mt-5 text-[15px] text-[var(--ink-2)]">{t.who}</p>
                <ul className="mt-6 flex-1 space-y-3 border-t border-[var(--line)] pt-6">
                  {t.items.map((it) => (
                    <li key={it} className="flex gap-3 text-[15px]">
                      <Icon name="check" size={18} className="mt-0.5 shrink-0 text-[var(--ink-3)]" />
                      {it}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  {t.href === "booking" ? (
                    <BookButton className="btn btn-ghost btn-sm w-full justify-center" source="pricing-review">
                      {t.cta}
                    </BookButton>
                  ) : (
                    <Link href={t.href} className={`btn btn-sm w-full justify-center ${t.recommended ? "btn-primary" : "btn-ghost"}`}>
                      {t.cta}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </Reveal>
          <p className="mt-6 text-[14px] text-[var(--ink-3)]">Prices in USD, excluding third-party licenses and model usage, which we estimate before you sign.</p>
        </div>
      </section>

      <section className="section border-y border-[var(--line)] bg-[var(--surface)]" aria-labelledby="pricing-proof">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 id="pricing-proof" className="t-d2 max-w-[14ch]">
              What a pilot looks like
            </h2>
            <p className="mt-5 max-w-[40ch] text-[var(--ink-2)]">Auto Inspect: one inspection workflow, from guided capture to annotated report, built and measured.</p>
          </div>
          <Reveal variant="clip">
            <CaseCard c={getCase("auto-inspect")!} />
          </Reveal>
        </div>
      </section>

      <Faq items={faqs} title="Pricing questions" />
      <CtaBand title="Not sure which stop you’re at?" source="pricing-closing" />
    </>
  );
}
