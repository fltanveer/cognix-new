import Link from "next/link";
import type { CaseStudy } from "@/content/site";
import { ScanToModel } from "./ScanToModel";
import { CaseVisual } from "./CaseVisual";

/** Case card: industry, service and one metric, per the audit's case-study card rule. */
export function CaseCard({ c, priority, size = "lg" }: { c: CaseStudy; priority?: boolean; size?: "lg" | "md" }) {
  return (
    <Link href={`/work/${c.slug}`} data-cursor="View project" className="group block focus-visible:outline-offset-8">
      <div className={`media-frame relative ${size === "lg" ? "aspect-[16/11]" : "aspect-[4/3]"}`}>
        {c.visual ? (
          <div className="absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.02]">
            <CaseVisual visual={c.visual} variant={size === "lg" ? "card" : "card-md"} alt={c.coverAlt} />
          </div>
        ) : c.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.cover}
            alt={c.coverAlt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid p-6 pb-24 md:p-8 md:pb-24">
            <ScanToModel className="flex h-full flex-col" />
          </div>
        )}
        {c.metric && (
          <div className="absolute bottom-3 left-3 rounded-[10px] border border-[var(--line)] bg-[var(--canvas)] px-3 py-2">
            <div className="text-[22px] font-medium leading-none tracking-[-0.02em] tnum">{c.metric.value}</div>
            <div className="mt-1 text-[12.5px] text-[var(--ink-2)]">{c.metric.label}</div>
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px] text-[var(--ink-3)]">
        <span>{c.industry}</span>
        <span className="h-1 w-1 rounded-full bg-[var(--ink-3)]" />
        <span>{c.service}</span>
        <span className="h-1 w-1 rounded-full bg-[var(--ink-3)]" />
        <span>{c.status}</span>
      </div>
      <h3 className="mt-2 text-[22px] leading-tight tracking-[-0.02em] md:text-[26px]">
        <span className="link-u">{c.headline}</span>
      </h3>
    </Link>
  );
}
