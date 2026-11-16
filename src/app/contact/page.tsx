import type { Metadata } from "next";
import { CalendarDays, Mail, MapPin, Phone, PenLine } from "lucide-react";
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

const steps = [
  "You pick a time. You get a confirmation and a reminder.",
  "On the call we map one workflow and what it costs you.",
  "You leave knowing what to fix first, and whether we’re the right team for it.",
];

function PathHead({ icon, kicker, title, meta, id }: { icon: React.ReactNode; kicker: string; title: string; meta: string; id: string }) {
  return (
    <div className="mb-5">
      <div>
        <p className="flex items-center gap-2 text-[13.5px] text-[var(--ink-3)] [&_svg]:size-4 [&_svg]:text-[var(--accent)]">
          {icon}
          {kicker}
        </p>
        <h2 id={id} className="t-d3 mt-2">
          {title}
        </h2>
      </div>
      <p className="mt-1.5 text-[13.5px] text-[var(--ink-3)]">{meta}</p>
    </div>
  );
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ intent?: string }> }) {
  const { intent } = await searchParams;
  const label = intent && intents[intent];

  return (
    <>
      <PageHero art="contact"
        title="Book a Workflow Review"
        lead={`${site.booking.minutes} minutes, no slides, no pitch. We map one workflow with you and tell you honestly whether AI is the right fix. Rather write? The form sits right next to the calendar, and we reply within one business day.`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]}
      />

      <section className="pb-[var(--section)]" aria-label="Book a call or send a message">
        <div className="container-x">
          {/* Two equal paths. On desktop the headers and the cards share rows (subgrid), so both cards start on one line. */}
          <div className="grid gap-y-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-0">
            <Reveal variant="scale" className="flex flex-col lg:row-span-2 lg:grid lg:grid-rows-subgrid">
              <PathHead
                id="book-title"
                icon={<CalendarDays aria-hidden="true" />}
                kicker="Talk it through"
                title={`Book a ${site.booking.minutes}-minute call`}
                meta="Free · Video call · Pick any open slot"
              />
              <InlineCalendar className="h-[820px]" />
            </Reveal>

            <div className="contact-or lg:row-span-2" aria-hidden="true">
              <span>or</span>
            </div>

            <Reveal variant="rise" className="flex flex-col lg:row-span-2 lg:grid lg:grid-rows-subgrid">
              <PathHead
                id="form-title"
                icon={<PenLine aria-hidden="true" />}
                kicker="Rather write?"
                title="Send us a note"
                meta={label ? `About: ${label}` : "Reply within one business day"}
              />
              <div className="flex flex-col gap-6">
                <LeadForm intent={intent || "general"} />
                <address className="mt-auto grid gap-x-6 gap-y-2.5 text-[14.5px] not-italic text-[var(--ink-2)] sm:grid-cols-2 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-[var(--ink-3)]">
                  <a className="flex items-center gap-2.5 hover:text-[var(--ink)]" href={`mailto:${site.email}`}>
                    <Mail aria-hidden="true" />
                    <span className="link-u">{site.email}</span>
                  </a>
                  <a className="flex items-center gap-2.5 hover:text-[var(--ink)]" href={site.phoneHref}>
                    <Phone aria-hidden="true" />
                    <span className="link-u">{site.phone}</span>
                  </a>
                  <span className="flex items-start gap-2.5 sm:col-span-2">
                    <MapPin aria-hidden="true" className="mt-[3px]" />
                    <span>
                      {site.address.street}, {site.address.city}, {site.address.region} {site.address.zip} ·{" "}
                      <a className="link-u hover:text-[var(--ink)]" href={site.social.linkedin} target="_blank" rel="noopener">
                        LinkedIn
                      </a>
                    </span>
                  </span>
                </address>
              </div>
            </Reveal>
          </div>

          <Reveal as="div" variant="rise" stagger={0.08} className="mt-16 border-t border-[var(--line)] pt-8 md:mt-20">
            <h2 className="text-[14px] font-normal tracking-normal text-[var(--ink-3)]">What happens on the call</h2>
            <ol className="mt-5 grid gap-6 md:grid-cols-3 md:gap-10">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-[15.5px] leading-relaxed">
                  <span className="font-mono text-[12px] leading-7 text-[var(--ink-3)]">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>
    </>
  );
}
