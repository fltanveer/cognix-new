import Link from "next/link";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { HeroArt } from "@/components/HeroArt";

export function PageHero({
  title,
  lead,
  crumbs,
  children,
  wide,
  art,
}: {
  title: string;
  lead?: string;
  crumbs?: { label: string; href: string }[];
  children?: React.ReactNode;
  wide?: boolean;
  /** Key of an isometric hero figure (see hero-figures.ts); shown beside the copy. */
  art?: string;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-44">
      <div className="pointer-events-none absolute inset-0 blueprint opacity-60" aria-hidden="true" />
      <div className={`container-x relative ${art ? "grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-4" : ""}`}>
        <div className="min-w-0">
          {crumbs && (
            <Reveal as="nav" variant="fade" aria-label="Breadcrumb" className="mb-8 text-[14px] text-[var(--ink-3)]">
              <ol className="flex flex-wrap items-center gap-2">
                {crumbs.map((c, i) => (
                  <li key={c.href} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden="true">/</span>}
                    <Link href={c.href} className="link-u hover:text-[var(--ink)]">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </Reveal>
          )}
          <SplitHeading as="h1" trigger="load" delay={0.1} text={title} className={`t-d1 ${wide ? "max-w-[22ch]" : "max-w-[16ch]"}`} />
          {lead && (
            <Reveal variant="rise" delay={0.35} className="mt-8 max-w-[58ch]">
              <p className="t-lead text-[var(--ink-2)]">{lead}</p>
            </Reveal>
          )}
          {children && (
            <Reveal variant="rise" delay={0.5} className="mt-10">
              {children}
            </Reveal>
          )}
        </div>
        {art && (
          <Reveal variant="fade" delay={0.3} className="relative mx-auto -mb-6 -mt-16 w-full max-w-[520px] lg:-mr-[calc(var(--gutter)+3vw)] lg:-my-10 lg:max-w-none">
            <HeroArt name={art} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
