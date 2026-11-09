"use client";

import { useMemo, useRef, useState } from "react";
import { cases } from "@/content/site";
import { CaseCard } from "./CaseCard";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const services = ["All", "AI & Software", "SEO & Growth", "Product & UX"] as const;

/** Filterable case grid. Cards reflow with a FLIP-style fade/rise when the filter changes. */
export function CaseFilter() {
  const [svc, setSvc] = useState<(typeof services)[number]>("All");
  const grid = useRef<HTMLDivElement>(null);
  const real = useMemo(() => cases.filter((c) => !c.sample && (svc === "All" || c.service === svc)), [svc]);
  const samples = useMemo(() => cases.filter((c) => c.sample && (svc === "All" || c.service === svc)), [svc]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(grid.current!.querySelectorAll("[data-c]"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "expo.out", stagger: 0.07 });
      ScrollTrigger.refresh();
    },
    { dependencies: [svc], scope: grid }
  );

  return (
    <section className="pb-[var(--section)]">
      <div className="container-x">
        <div role="group" aria-label="Filter by service" className="flex flex-wrap gap-2">
          {services.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={svc === s}
              onClick={() => setSvc(s)}
              className={`rounded-full border px-4 py-2 text-[14.5px] transition-colors ${
                svc === s ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--canvas)]" : "border-[var(--line-strong)] text-[var(--ink-2)] hover:text-[var(--ink)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div ref={grid}>
          <div className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
            {real.map((c, i) => {
              // The first card leads full width in "All"; if that leaves an odd number of half-width cards,
              // the last one spans too, so the grid never ends on an empty cell.
              const lead = svc === "All" ? 1 : 0;
              const wide = (lead && i === 0) || (i === real.length - 1 && (real.length - lead) % 2 === 1);
              return (
              <div key={c.slug} data-c="" className={wide ? "md:col-span-2" : ""}>
                <CaseCard c={c} priority={i === 0} />
              </div>
              );
            })}
          </div>
          {samples.length > 0 && (
            <div className="mt-24">
              <h2 className="t-d3">Product & UX design samples</h2>
              <p className="mt-3 max-w-[56ch] text-[var(--ink-2)]">Concept work that shows how we design. No client results are claimed for these.</p>
              <div className="mt-10 grid gap-8 md:grid-cols-2">
                {samples.map((c) => (
                  <div key={c.slug} data-c="">
                    <CaseCard c={c} size="md" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
