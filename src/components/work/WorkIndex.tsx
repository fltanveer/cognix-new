import Link from "next/link";
import Image from "next/image";
import { cases, type CaseStudy } from "@/content/site";
import { CaseCard } from "./CaseCard";
import { Reveal } from "@/components/motion/Reveal";
import "./collection.css";

/**
 * The Work index, grouped by what each entry actually is, so nobody mistakes a design collection for a
 * measured case study: products we built, growth results, product design, collections of separate client
 * designs, and labelled concept samples.
 */
const pick = (slugs: string[]) => slugs.map((s) => cases.find((c) => c.slug === s)).filter(Boolean) as CaseStudy[];

const GROUPS = [
  {
    id: "built",
    title: "Products we built",
    intro: "AI and software in production, with what changed and how we measured it.",
    items: pick(["auto-inspect", "pknail"]),
  },
  {
    id: "growth",
    title: "Growth results",
    intro: "Search and social work for clinics and specialists, with the numbers it moved.",
    items: pick(["dr-kibria-seo", "phc-aesthetic"]),
  },
  {
    id: "design",
    title: "Product design",
    intro: "Apps, dashboards and digital presence designed for clients. Each page explains the brief and the design, not business results.",
    items: pick(["drive", "revexia", "flowcite", "dome", "tms", "ldma", "studylity", "jvs-management"]),
  },
  {
    id: "collections",
    title: "Collections",
    intro: "Many separate designs, each for a different client. Open one to browse the pages side by side.",
    items: pick(["landing-pages", "live-sites"]),
  },
  {
    id: "samples",
    title: "Design samples",
    intro: "Concept work that shows how we design. No client results are claimed for these.",
    items: cases.filter((c) => c.sample),
  },
];

/** A collection as a fanned stack of its pages: spreads out on hover, opens to the gallery. */
function CollectionCard({ c }: { c: CaseStudy }) {
  const items = c.collection!.items;
  const fan = items.slice(0, 5);
  const names = items.map((i) => i.name);
  const isSites = c.collection!.kind === "sites";
  return (
    <Link href={`/work/${c.slug}`} data-cursor="Open collection" className="cg-card group block">
      <div className="cg-fan" aria-hidden="true">
        {fan.map((it, i) => (
          <span key={it.name} className="cg-fan-page" style={{ ["--i" as string]: i - (fan.length - 1) / 2, zIndex: 10 - Math.abs(i - (fan.length - 1) / 2) * 2 }}>
            <Image src={it.src} alt="" width={1280} height={it.h} sizes="220px" />
          </span>
        ))}
        <span className="cg-count">
          <b>{items.length}</b> {isSites ? "live sites" : "designs"}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px] text-[var(--ink-3)]">
        <span>Collection</span>
        <span className="h-1 w-1 rounded-full bg-[var(--ink-3)]" />
        <span>{isSites ? "Designed and built in code" : "Separate client designs"}</span>
      </div>
      <h3 className="mt-2 text-[22px] leading-tight tracking-[-0.02em] md:text-[26px]">
        <span className="link-u">{c.title}</span>
      </h3>
      <p className="mt-2 max-w-[52ch] text-[15px] text-[var(--ink-2)]">
        {names.slice(0, 5).join(", ")}
        {names.length > 5 ? ` and ${names.length - 5} more` : ""}.
      </p>
    </Link>
  );
}

export function WorkIndex() {
  return (
    <section className="pb-[var(--section)]">
      <div className="container-x">
        <nav aria-label="Jump to" className="flex flex-wrap gap-2">
          {GROUPS.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="rounded-full border border-[var(--line-strong)] px-4 py-2 text-[14.5px] text-[var(--ink-2)] transition-colors hover:border-[var(--ink-2)] hover:text-[var(--ink)]">
              {g.title} <span className="ml-1 text-[var(--ink-3)]">{g.items.length}</span>
            </a>
          ))}
        </nav>

        {GROUPS.map((g, gi) => (
          <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className={`scroll-mt-28 ${gi === 0 ? "mt-14" : "mt-28"}`}>
            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-[var(--line-strong)] pt-6">
              <div>
                <h2 id={`${g.id}-title`} className="t-d3">
                  {g.title}
                </h2>
                <p className="mt-2 max-w-[60ch] text-[var(--ink-2)]">{g.intro}</p>
              </div>
              <span className="font-mono text-[13px] text-[var(--ink-3)]">{String(g.items.length).padStart(2, "0")}</span>
            </div>
            <Reveal variant="rise" stagger={0.08} className={`mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2 ${g.id === "design" ? "lg:grid-cols-3" : ""}`}>
              {g.items.map((c) =>
                c.collection ? (
                  <div key={c.slug}>
                    <CollectionCard c={c} />
                  </div>
                ) : (
                  <div key={c.slug}>
                    <CaseCard c={c} size={g.id === "design" || g.id === "samples" ? "md" : "lg"} />
                  </div>
                )
              )}
            </Reveal>
          </section>
        ))}
      </div>
    </section>
  );
}
