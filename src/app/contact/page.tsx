import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHero } from "@/components/PageHero";
import { InlineCalendar } from "@/components/booking/InlineCalendar";
import { LeadForm } from "@/components/booking/LeadForm";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: { absolute: "Contact Cognixlab | Book a Workflow Review | Boston & NYC" },
  description: "Book a free Workflow Review with Cognixlab or send us a note. We reply within one business day. Based at 301 Binney St, Cambridge, MA.",
  alternates: { canonical: "/contact" },
};

const intents: Record<string, string> = {
  assessment: "Workflow Assessment",
  pilot: "AI Pilot",
  implementation: "Implementation",
  visibility: "Visibility check",
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ intent?: string }> }) {
  const { intent } = await searchParams;
  const label = intent && intents[intent];

  return (
    <>
      <PageHero art="contact"
        title="Book a Workflow Review"
        lead={`${site.booking.minutes} minutes, no slides, no pitch. We map one workflow with you and tell you honestly whether AI is the right fix. Prefer to write? Use the form below and we reply within one business day.`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]}
      />

      <section className="pb-[var(--section)]">
        <div className="container-x grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <Reveal variant="scale">
            <InlineCalendar />
          </Reveal>
          <Reveal as="aside" variant="rise" stagger={0.08} className="space-y-8">
            <div>
              <h2 className="text-[14px] font-normal tracking-normal text-[var(--ink-3)]">What happens next</h2>
              <ol className="mt-4 space-y-4 text-[15.5px]">
                <li className="flex gap-3"><span className="font-mono text-[12px] leading-6 text-[var(--ink-3)]">1</span>You pick a time. You get a confirmation and a reminder.</li>
                <li className="flex gap-3"><span className="font-mono text-[12px] leading-6 text-[var(--ink-3)]">2</span>On the call we map one workflow and its cost.</li>
                <li className="flex gap-3"><span className="font-mono text-[12px] leading-6 text-[var(--ink-3)]">3</span>You leave knowing what to fix first, and whether we’re the right team for it.</li>
              </ol>
            </div>
            <div className="border-t border-[var(--line)] pt-8">
              <h2 className="text-[14px] font-normal tracking-normal text-[var(--ink-3)]">Direct</h2>
              <address className="mt-3 space-y-1.5 not-italic text-[15.5px]">
                <div><a className="link-u" href={`mailto:${site.email}`}>{site.email}</a></div>
                <div><a className="link-u" href={site.phoneHref}>{site.phone}</a></div>
                <div className="text-[var(--ink-2)]">{site.address.street}, {site.address.city}, {site.address.region} {site.address.zip}</div>
                <div><a className="link-u" href={site.social.linkedin} target="_blank" rel="noopener">LinkedIn</a></div>
              </address>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section tone-light" aria-labelledby="form-title">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <h2 id="form-title" className="t-d2 max-w-[12ch]">
              Or send us a message
            </h2>
            {label && <p className="mt-4 text-[var(--ink-2)]">About: {label}</p>}
          </div>
          <LeadForm intent={intent || "general"} />
        </div>
      </section>
    </>
  );
}
