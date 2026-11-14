import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Team } from "@/components/Team";
import { Method } from "@/components/home/Method";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { CtaBand } from "@/components/CtaBand";
import { Faq } from "@/components/Faq";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: "About Cognixlab | AI, Software, UX & SEO Studio in Cambridge, MA" },
  description: "Cognixlab is a Cambridge, MA studio that modernizes operations with AI and connected systems for growing companies in Boston and New York.",
  alternates: { canonical: "/about" },
};

const stances = [
  { t: "We say no to quick hacks.", d: "If you want a chatbot bolted onto a broken process, we’re the wrong team. We fix the process first." },
  { t: "Evidence before budget.", d: "Every engagement starts small and ends each phase with something you can test, so you never commit blind." },
  { t: "AI only where it earns its place.", d: "Sometimes the right answer is an integration or a rule. We’ll tell you, even when it means a smaller project." },
  { t: "You own what we build.", d: "Your code, your accounts, your data. We document and hand over so you’re never locked in." },
];

const faqs = [
  { q: "Is Cognixlab a design agency or a tech company?", a: "Both. We blend design thinking, engineering, AI and growth strategy, so you get complete systems rather than isolated deliverables." },
  { q: "Where are you based, and do you work globally?", a: `We’re headquartered at ${site.address.street}, ${site.address.city}, ${site.address.region}, and focus on Boston and New York. We also work remotely with clients elsewhere.` },
  { q: "How do I get started?", a: "Book a Workflow Review. It’s free, it takes one call, and you leave with an honest view of what to fix first." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero art="about"
        title="A studio for operators who are tired of duct tape."
        lead="Cognixlab helps startups and established companies modernize how they run, through AI-powered software, connected systems, product design and growth strategy. Practical, measurable, and honest about what AI can and can’t do."
        crumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]}
        wide
      />

      <section className="section pt-0" aria-labelledby="stance-title">
        <div className="container-x">
          <SplitHeading id="stance-title" text="What we will and won’t do" className="t-d2" />
          <Reveal as="ul" variant="rise" stagger={0.08} className="mt-12 grid gap-px overflow-hidden rounded-[var(--r-card)] border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
            {stances.map((s) => (
              <li key={s.t} className="bg-[var(--canvas)] p-7 md:p-10">
                <h3 className="text-[24px] tracking-[-0.025em]">{s.t}</h3>
                <p className="mt-3 max-w-[44ch] text-[var(--ink-2)]">{s.d}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <Team title="Who you’ll meet" />
      <Method title="How we work, every time." />

      <section className="section border-y border-[var(--line)] bg-[var(--surface)]" aria-labelledby="local-title">
        <div className="container-x grid gap-10 md:grid-cols-2">
          <h2 id="local-title" className="t-d2 max-w-[14ch]">
            Based in Cambridge, Massachusetts
          </h2>
          <div className="space-y-4 text-[var(--ink-2)]">
            <p>
              {site.legalName} is registered in Massachusetts. Our office is at {site.address.street}, {site.address.city}, {site.address.region}{" "}
              {site.address.zip}.
            </p>
            <p>
              <Link href="/work" className="link-u text-[var(--ink)]">
                See our work →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Faq items={faqs} />
      <CtaBand source="about" secondary={{ label: "See our work", href: "/work" }} />
    </>
  );
}
