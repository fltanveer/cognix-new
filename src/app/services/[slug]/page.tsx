import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, getService, getCase } from "@/content/site";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { CaseCard } from "@/components/work/CaseCard";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";
import { BookButton } from "@/components/booking/Booking";
import { Icon } from "@/components/ui/Icon";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return { title: { absolute: s.metaTitle }, description: s.metaDescription, alternates: { canonical: `/services/${s.slug}` } };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const proof = getCase(s.proofSlug)!;
  const others = services.filter((o) => o.slug !== s.slug);

  return (
    <>
      <PageHero art={`service-${s.slug}`} title={s.name} lead={s.problem} crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: s.name, href: `/services/${s.slug}` }]}>
        <div className="flex flex-wrap items-center gap-4">
          <BookButton source={`service-${s.slug}`}>{s.cta}</BookButton>
          <span className="font-mono text-[13px] text-[var(--ink-2)]">{s.priceSignal}</span>
        </div>
      </PageHero>

      <section className="section pt-0" aria-labelledby="pain-title">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 id="pain-title" className="t-d3 max-w-[16ch]">
            Sound familiar?
          </h2>
          <Reveal as="ul" variant="rise" stagger={0.08} className="grid gap-px overflow-hidden rounded-[var(--r-card)] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
            {s.pain.map((p) => (
              <li key={p} className="bg-[var(--surface)] p-6 text-[17px] leading-snug">
                {p}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section border-y border-[var(--line)] bg-[var(--surface)]" aria-labelledby="deliv-title">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SplitHeading id="deliv-title" text="What you get" className="t-d2" />
            <Reveal as="ul" variant="rise" stagger={0.06} className="mt-10 space-y-4">
              {s.deliverables.map((d) => (
                <li key={d} className="flex gap-4 border-b border-[var(--line)] pb-4">
                  <Icon name="check" size={22} className="mt-0.5 shrink-0 text-[var(--ink-2)]" />
                  <span>{d}</span>
                </li>
              ))}
            </Reveal>
          </div>
          <div>
            <SplitHeading text="How it runs" className="t-d2" />
            <Reveal as="ol" variant="slide-left" stagger={0.1} className="mt-10 space-y-6">
              {s.timeline.map((t) => (
                <li key={t.step} className="card p-6">
                  <div className="font-mono text-[12.5px] text-[var(--ink-3)]">{t.step}</div>
                  <div className="mt-2 text-[18px] leading-snug">{t.detail}</div>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="proof-title">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 id="proof-title" className="t-d2 max-w-[14ch]">
              Proof
            </h2>
            <p className="mt-5 max-w-[42ch] text-[var(--ink-2)]">{s.proofLine}</p>
          </div>
          <Reveal variant="clip">
            <CaseCard c={proof} />
          </Reveal>
        </div>
      </section>

      <Faq items={s.faqs} title={`${s.name}: questions`} />

      <section className="pb-8" aria-label="Other services">
        <div className="container-x">
          <div className="text-[14px] text-[var(--ink-3)]">Other services</div>
          <ul className="mt-4 flex flex-wrap gap-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/services/${o.slug}`} className="btn btn-ghost btn-sm">
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={`Ready to ${s.cta.toLowerCase()}?`} source={`service-${s.slug}-closing`} />
    </>
  );
}
