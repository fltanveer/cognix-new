import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cases, getCase } from "@/content/site";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/Parallax";
import { Scramble } from "@/components/motion/Scramble";
import { CtaBand } from "@/components/CtaBand";
import { InspectRun } from "@/components/work/InspectRun";
import { ScanToModel } from "@/components/work/ScanToModel";
import { CaseVisual } from "@/components/work/CaseVisual";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCase((await params).slug);
  if (!c) return {};
  return {
    title: `${c.title} case study`,
    description: c.metaDescription,
    alternates: { canonical: `/case-studies/${c.slug}` },
    openGraph: c.cover ? { images: [c.cover] } : undefined,
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCase((await params).slug);
  if (!c) notFound();
  const idx = cases.findIndex((x) => x.slug === c.slug);
  const next = cases[(idx + 1) % cases.length];

  const glance = [
    { k: "Client", v: c.client },
    { k: "Industry", v: c.industry },
    { k: "Service", v: c.service },
    { k: "Status", v: c.status },
    ...(c.timeline ? [{ k: "Timeline", v: c.timeline }] : []),
  ];

  // One type size for the whole results row, set by its longest value, so every label sits on one line.
  const longest = Math.max(0, ...c.results.map((r) => r.value.length));
  const valueSize =
    longest > 9
      ? "text-[40px] leading-[1.08] md:text-[clamp(28px,2.6vw,40px)]" // stacked full width on phones, three across from md
      : longest > 6
        ? "text-[44px] leading-[1.02] md:text-[clamp(34px,3.4vw,52px)]"
        : "text-[48px] leading-none md:text-[clamp(40px,4.6vw,64px)]";

  return (
    <article>
      <header className="relative pb-14 pt-36 md:pt-44">
        <div className="container-x">
          <Reveal as="nav" variant="fade" aria-label="Breadcrumb" className="mb-8 text-[14px] text-[var(--ink-3)]">
            <Link href="/case-studies" className="link-u hover:text-[var(--ink)]">
              ← Case studies
            </Link>
          </Reveal>
          {c.sample && (
            <p className="mb-5 inline-block rounded-full border border-[var(--line-strong)] px-3 py-1 text-[13px] text-[var(--ink-2)]">Product design sample, no client results claimed</p>
          )}
          <SplitHeading as="h1" trigger="load" delay={0.1} text={c.headline} className="t-d1 max-w-[20ch]" />
          <Reveal as="dl" variant="rise" stagger={0.06} delay={0.4} className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[var(--line)] pt-6 md:grid-cols-5">
            {glance.map((g) => (
              <div key={g.k}>
                <dt className="text-[13px] text-[var(--ink-3)]">{g.k}</dt>
                <dd className="mt-1 text-[15.5px]">{g.v}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </header>

      <div className="container-x">
        {c.visual ? (
          <Reveal variant="clip" className="media-frame aspect-[4/3] [@media(min-width:800px)]:aspect-[2/1]">
            <CaseVisual visual={c.visual} variant="hero" alt={c.coverAlt} />
          </Reveal>
        ) : c.cover ? (
          <Reveal variant="clip">
            <ParallaxImage src={c.cover} alt={c.coverAlt} className="aspect-[16/8]" priority amount={14} />
          </Reveal>
        ) : (
          <Reveal variant="clip" className="card aspect-[16/8] p-8 md:p-14">
            <ScanToModel className="flex h-full flex-col" />
          </Reveal>
        )}
      </div>

      {c.results.length > 0 && (
        <section className="section" aria-labelledby="results-title">
          <div className="container-x">
            <h2 id="results-title" className="text-[15px] text-[var(--ink-3)]">
              Results
            </h2>
            <ul className="mt-6 grid gap-px overflow-hidden rounded-[var(--r-card)] border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
              {c.results.map((r, i) => (
                <li key={r.label} className="bg-[var(--canvas)] p-7 md:p-9">
                  <Scramble
                    text={r.value}
                    delay={i * 0.15}
                    className={`block font-medium tracking-[-0.04em] text-balance ${valueSize}`}
                  />
                  <p className="mt-4 max-w-[28ch] text-[var(--ink-2)]">{r.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="on-paper section" aria-labelledby="challenge-title">
        <div className="container-x grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 id="challenge-title" className="t-d2">
              The challenge
            </h2>
          </div>
          <div>
            <Reveal variant="rise">
              <p className="text-[clamp(20px,1.8vw,24px)] leading-[1.5] tracking-[-0.01em]">{c.challenge}</p>
              <p className="mt-6 text-[17px] leading-[1.7] text-[var(--graphite-2)]">{c.summary}</p>
            </Reveal>

            <h2 className="t-d3 mt-20">What we did</h2>
            <ol className="mt-8 border-t border-[var(--paper-line)]">
              {c.phases.map((p, i) => (
                <Reveal as="li" key={p.phase} variant="rise" className="grid gap-3 border-b border-[var(--paper-line)] py-7 md:grid-cols-[180px_1fr] md:gap-8">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[12px] text-[var(--graphite-2)]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[20px] tracking-[-0.02em]">{p.phase}</span>
                  </div>
                  <p className="leading-[1.7] text-[var(--graphite-2)]">{p.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {c.slug === "auto-inspect" && (
        <section className="section" aria-labelledby="run-title">
          <div className="container-x">
            <h2 id="run-title" className="t-d2 max-w-[18ch]">
              The recorded run
            </h2>
            <Reveal variant="scale" className="mt-10">
              <InspectRun />
            </Reveal>
          </div>
        </section>
      )}

      {c.gallery.length > 0 && (
        <section className="section" aria-label="Project visuals">
          <div className="container-x grid gap-6 md:grid-cols-2">
            {c.gallery.map((g, i) => (
              <Reveal key={g.src} variant={i % 2 ? "clip-x" : "clip"} className={g.wide ? "md:col-span-2" : ""}>
                <ParallaxImage src={g.src} alt={g.alt} className={g.wide ? "aspect-[16/8]" : "aspect-[4/5]"} amount={10} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <nav aria-label="Next case study" className="border-t border-[var(--line)]">
        <Link href={`/case-studies/${next.slug}`} data-cursor="Next case" className="group container-x flex items-center justify-between gap-8 py-14 md:py-20">
          <span>
            <span className="block text-[14px] text-[var(--ink-3)]">Next case study</span>
            <span className="t-d2 mt-2 block transition-colors group-hover:text-[var(--ink-2)]">{next.title}</span>
          </span>
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-[var(--line-strong)] text-[24px] transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-ink)]">
            →
          </span>
        </Link>
      </nav>

      <CtaBand title="Have a similar process?" body="Book a Workflow Review. We map it with you and tell you honestly what would change." source={`case-${c.slug}`} />
    </article>
  );
}
