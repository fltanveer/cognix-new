import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/content/posts";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { GuideForm } from "@/components/booking/GuideForm";

export const metadata: Metadata = {
  title: "Insights: AI, Automation, UX & Search for Operators",
  description: "Practical articles from Cognixlab on AI adoption, workflow automation, product design and search visibility for growing companies in Boston and New York.",
  alternates: { canonical: "/insights" },
};

const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function InsightsPage() {
  const [lead, ...rest] = posts;
  return (
    <>
      <PageHero art="insights" title="Insights" lead="Field notes on AI adoption, automation, product design and getting found." crumbs={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }]} />

      <section className="pb-[var(--section)]">
        <div className="container-x">
          <Reveal variant="clip">
            <Link href={`/insights/${lead.slug}`} data-cursor="Read" className="group grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
              <div className="media-frame aspect-[16/10]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lead.cover} alt="" className="transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.04]" />
              </div>
              <div>
                <div className="text-[14px] text-[var(--ink-3)]">
                  {lead.category} · {fmt(lead.date)} · {lead.readMins} min read
                </div>
                <h2 className="t-d3 mt-3">
                  <span className="link-u">{lead.title}</span>
                </h2>
                <p className="mt-4 text-[var(--ink-2)]">{lead.excerpt}</p>
              </div>
            </Link>
          </Reveal>

          <ul className="mt-20 border-t border-[var(--line-strong)]">
            {rest.map((p) => (
              <Reveal as="li" key={p.slug} variant="rise" className="border-b border-[var(--line-strong)]">
                <Link href={`/insights/${p.slug}`} className="group grid gap-4 py-8 md:grid-cols-[200px_1fr_160px] md:items-center md:gap-10">
                  <div className="media-frame aspect-[4/3] w-full md:w-[200px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover} alt="" loading="lazy" className="transition-transform duration-700 group-hover:scale-[1.06]" />
                  </div>
                  <div>
                    <div className="text-[13.5px] text-[var(--ink-3)]">{p.category}</div>
                    <h3 className="mt-1 text-[22px] leading-snug tracking-[-0.02em] md:text-[26px]">
                      <span className="link-u">{p.title}</span>
                    </h3>
                  </div>
                  <div className="text-[14px] text-[var(--ink-3)] md:text-right">
                    {fmt(p.date)}
                    <br />
                    {p.readMins} min read
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section tone-light" aria-labelledby="guide-title">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="guide-title" className="t-d2 max-w-[16ch]">
              The Agentic Enterprise Blueprint
            </h2>
            <p className="mt-5 max-w-[46ch] text-[var(--ink-2)]">
              A 10-page guide to where AI agents fit in your operations, what to fix before you buy tools, and how to tell if your workflows are
              ready. Email only, no call required.
            </p>
          </div>
          <GuideForm />
        </div>
      </section>
    </>
  );
}
