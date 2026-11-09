"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { industries } from "@/content/site";
import { ScanToModel } from "@/components/work/ScanToModel";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const media: Record<string, { src?: string; alt: string }> = {
  "insurance-inspections": { src: "/img/work/auto-inspect-field.webp", alt: "Inspector photographing a vehicle for Auto Inspect" },
  "architecture-construction": { alt: "PKNail scan-to-model diagram" },
  "healthcare-practices": { src: "/img/work/kibria-search.webp", alt: "Search results for a consultant surgeon on page one" },
};

/** Industry list with a sticky media frame that wipes to the industry in focus (hover, focus or scroll). */
export function Industries() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const prev = useRef(0);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-ind]");
      const triggers = rows.map((r, i) =>
        ScrollTrigger.create({ trigger: r, start: "top 55%", end: "bottom 55%", onToggle: (s) => s.isActive && setActive(i) })
      );
      return () => triggers.forEach((t) => t.kill());
    },
    { scope: root }
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = root.current?.querySelector(`[data-media="${active}"]`);
      if (el && prev.current !== active) gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut", onComplete: () => void (prev.current = active) });
    },
    { dependencies: [active], scope: root }
  );

  return (
    <section ref={root} className="section" aria-labelledby="ind-title">
      <div className="container-x">
        <h2 id="ind-title" className="t-d2 max-w-[18ch]">
          Who we help. Three industries where we have the proof.
        </h2>
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <ul>
            {industries.map((ind, i) => (
              <li key={ind.slug} data-ind="" className="border-t border-[var(--line-strong)] last:border-b">
                <Link
                  href={`/industries/${ind.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group block py-8 md:py-10"
                >
                  <span className={`block text-[28px] leading-tight tracking-[-0.03em] transition-colors duration-300 md:text-[36px] ${active === i ? "text-[var(--ink)]" : "text-[var(--ink-3)]"}`}>
                    {ind.name}
                  </span>
                  <span className="mt-3 block max-w-[46ch] text-[var(--ink-2)]">{ind.short}</span>
                  <span className="mt-4 inline-block text-[14px] text-[var(--ink)]">
                    <span className="link-u">See how we help</span> →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden lg:block">
            <div className="sticky top-28 aspect-[4/5] w-full">
              {industries.map((ind, i) => {
                const m = media[ind.slug];
                return (
                  <div
                    key={ind.slug}
                    data-media={i}
                    className="media-frame absolute inset-0 border border-[var(--line)]"
                    style={{ zIndex: active === i ? 2 : 1, visibility: active === i || prev.current === i ? "visible" : "hidden" }}
                    aria-hidden={active !== i}
                  >
                    {m.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.src} alt={m.alt} loading="lazy" />
                    ) : (
                      <div className="absolute inset-0 p-10">
                        <ScanToModel className="flex h-full flex-col" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
