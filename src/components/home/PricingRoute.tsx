"use client";

import Link from "next/link";
import { useRef } from "react";
import { tiers } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion, release } from "@/lib/gsap";

/** Engagement ladder as a route: each step is a stop on one line that draws as you scroll. */
export function PricingRoute() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const stops = q("[data-stop]");
      if (prefersReducedMotion()) return stops.forEach(release);
      gsap.set(stops, { y: 30, autoAlpha: 0 });
      stops.forEach(release);
      const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-route]")[0], start: "top 75%", once: true } });
      tl.fromTo(q("[data-line]"), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.inOut" })
        .to(stops, { y: 0, autoAlpha: 1, duration: 0.8, ease: "expo.out", stagger: 0.14 }, 0.3)
        .fromTo(q("[data-node]"), { scale: 0 }, { scale: 1, duration: 0.5, ease: "expo.out", stagger: 0.14 }, 0.3);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="section border-y border-[var(--line)] bg-[var(--surface)]" aria-labelledby="price-title">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="price-title" className="t-d2 max-w-[16ch]">
              Priced up front. You decide at every stop.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[var(--ink-2)]">
              Start small, see evidence, then commit. Nobody signs up for a six-month transformation on day one.
            </p>
          </div>
          <Link href="/pricing" className="btn btn-ghost btn-sm">
            Full pricing and deliverables
          </Link>
        </div>

        <div data-route="" className="relative mt-16">
          <div data-line="" className="absolute left-0 right-0 top-[5px] hidden h-px origin-left bg-[var(--line-strong)] md:block" aria-hidden="true" />
          <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
            {tiers.map((t) => (
              <li key={t.name} data-stop="" data-pending="" className="relative">
                <span
                  data-node=""
                  className={`mb-6 hidden h-[11px] w-[11px] rounded-full md:block ${t.recommended ? "bg-[var(--accent)] shadow-[0_0_0_6px_var(--accent-soft)]" : "border border-[var(--ink-2)] bg-[var(--surface)]"}`}
                  aria-hidden="true"
                />
                <div className="text-[15px] text-[var(--ink-2)]">{t.name}</div>
                <div className="mt-2 text-[34px] font-medium leading-none tracking-[-0.03em] tnum">{t.price}</div>
                <div className="mt-2 font-mono text-[12px] text-[var(--ink-3)]">{t.unit}</div>
                <p className="mt-4 max-w-[30ch] text-[15px] text-[var(--ink-2)]">{t.who}</p>
                {t.recommended && <p className="mt-3 text-[13px] text-[var(--ink)]">Where most clients start</p>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
