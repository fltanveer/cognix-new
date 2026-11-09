import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { industries, getCase } from "@/content/site";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { CaseCard } from "@/components/work/CaseCard";
import { CtaBand } from "@/components/CtaBand";
import { BookButton } from "@/components/booking/Booking";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) return {};
  return { title: `${ind.name}: AI, automation & growth`, description: `${ind.short} ${ind.intro}`.slice(0, 155), alternates: { canonical: `/industries/${ind.slug}` } };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) notFound();
  const proof = ind.proofSlugs.map(getCase).filter(Boolean);

  return (
    <>
      <PageHero art={`industry-${ind.slug}`} title={ind.name} lead={ind.intro} crumbs={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }, { label: ind.name, href: `/industries/${ind.slug}` }]}>
        <BookButton source={`industry-${ind.slug}`} />
      </PageHero>
      <section className="section pt-0" aria-labelledby="probs">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 id="probs" className="t-d3">
            Problems we usually see
          </h2>
          <Reveal as="ol" variant="rise" stagger={0.1} className="space-y-0 border-t border-[var(--line-strong)]">
            {ind.problems.map((p) => (
              <li key={p} className="border-b border-[var(--line-strong)] py-6 text-[clamp(20px,2vw,26px)] tracking-[-0.02em]">
                {p}
              </li>
            ))}
          </Reveal>
        </div>
      </section>
      <section className="section border-t border-[var(--line)]" aria-labelledby="proof">
        <div className="container-x">
          <h2 id="proof" className="t-d2">
            Relevant work
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {proof.map((c) => (
              <Reveal key={c!.slug} variant="clip">
                <CaseCard c={c!} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand source={`industry-${ind.slug}-closing`} />
    </>
  );
}
