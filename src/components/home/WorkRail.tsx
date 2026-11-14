"use client";

import Link from "next/link";
import { useRef } from "react";
import { cases } from "@/content/site";
import { CaseCard } from "@/components/work/CaseCard";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { gsap, useGSAP } from "@/lib/gsap";

/** Flagship case studies on a horizontal rail pinned to vertical scroll (desktop). Stacks on mobile. */
export function WorkRail() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const flagships = cases.filter((c) => c.flagship);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const dist = () => t.scrollWidth - t.clientWidth;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.7, invalidateOnRefresh: true },
        });
        tl.to(t, { x: () => -dist(), ease: "none" }, 0).fromTo(bar.current, { scaleX: 0.08 }, { scaleX: 1, ease: "none" }, 0);
        // Cards skew slightly with scroll velocity for a sense of mass.
        t.querySelectorAll("[data-card]").forEach((card, i) => {
          tl.fromTo(card, { y: i % 2 ? 40 : 0 }, { y: i % 2 ? -20 : 30, ease: "none" }, 0);
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden lg:flex lg:h-[100svh] lg:flex-col lg:justify-center" aria-labelledby="work-title">
      <div className="container-x py-[var(--section)] lg:py-0">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitHeading id="work-title" text="Proof, with numbers attached." className="t-d1 max-w-[14ch]" />
          <div className="flex items-center gap-6">
            <div className="hidden h-px w-40 bg-[var(--line)] lg:block">
              <div ref={bar} className="h-px origin-left bg-[var(--ink)]" />
            </div>
            <Link href="/work" className="btn btn-ghost btn-sm">
              All work
            </Link>
          </div>
        </div>

        <div ref={track} className="mt-12 grid gap-14 lg:mt-16 lg:flex lg:gap-10 lg:pr-[20vw]">
          {flagships.map((c, i) => (
            <div key={c.slug} data-card="" className="rail-card lg:shrink-0">
              <CaseCard c={c} priority={i === 0} />
            </div>
          ))}
          <div data-card="" className="hidden lg:flex lg:w-[26vw] lg:shrink-0 lg:flex-col lg:justify-center">
            <p className="text-[var(--ink-2)]">Also: social visibility for a dermatology clinic, positioning for an agile consultancy, and product design samples.</p>
            <Link href="/work" className="link-u mt-4 self-start text-[var(--ink)]">
              Browse all work →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
