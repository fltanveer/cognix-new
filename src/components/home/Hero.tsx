"use client";

import Link from "next/link";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Magnetic } from "@/components/motion/Magnetic";
import { BookButton } from "@/components/booking/Booking";
import { gsap, useGSAP, prefersReducedMotion, release } from "@/lib/gsap";
import { site } from "@/content/site";
import { ToolOrbit } from "@/components/home/ToolOrbit";

// Three.js loads after first paint so the headline and CTA aren't blocked by the shader.
const SignalField = dynamic(() => import("@/components/hero/SignalField").then((m) => m.SignalField), { ssr: false });

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const seq = q("[data-intro]");
      if (prefersReducedMotion()) {
        seq.forEach(release);
        return;
      }
      gsap.set(seq, { y: 26, autoAlpha: 0 });
      seq.forEach(release);
      const tl = gsap.timeline({ delay: 0.75 });
      tl.to(seq, { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out", stagger: 0.09 });
      tl.fromTo(q("[data-proof-line]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, "-=0.9");

      gsap.to(q("[data-orbit]"), {
        yPercent: -14,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });

      // Content drifts up and dims as the field takes over on scroll.
      gsap.to(q("[data-hero-copy]"), {
        yPercent: -18,
        autoAlpha: 0.25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-32 md:pb-14" aria-labelledby="hero-title">
      <SignalField triggerRef={root} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--canvas)] to-transparent" aria-hidden="true" />

      {/* Right side: the tools you run today, orbiting the system that connects them. */}
      <div data-orbit="" className="hero-orbit absolute left-full top-[58%] -ml-[34rem] -mt-[30rem]">
        <ToolOrbit />
      </div>

      <div data-hero-copy="" className="container-x relative">
        <p data-intro="" data-pending="" className="mb-6 flex items-center gap-2.5 text-[15px] text-[var(--ink-2)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
          AI & digital systems studio · Cambridge, MA
        </p>

        <SplitHeading as="h1" id="hero-title" trigger="load" delay={0.25} stagger={0.06} text="Your team shouldn't be the integration layer." className="t-hero max-w-[12.5ch] hero-fit" />

        <div className="lg:max-w-[60%]">

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end lg:grid-cols-1 lg:gap-8">
          <p data-intro="" data-pending="" className="t-lead max-w-[46ch] text-[var(--ink-2)]">
            We connect the tools you already run and automate the busywork for growing companies in Boston and New York. It starts with a
            two-week Workflow Assessment, and AI goes in only where the numbers work.
          </p>
          <div data-intro="" data-pending="" className="md:justify-self-end lg:justify-self-start">
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <BookButton source="hero" />
              </Magnetic>
              <Link href="/case-studies" className="btn btn-ghost">
                See case studies
              </Link>
            </div>
            <p className="mt-3 text-[14px] text-[var(--ink-3)]">
              {site.booking.minutes} minutes. We map one workflow and tell you honestly if AI is the fix.
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <div data-proof-line="" className="h-px origin-left bg-[var(--line-strong)]" />
          <div data-intro="" data-pending="" className="mt-5 grid gap-x-10 gap-y-3 md:grid-cols-[auto_1fr]">
          <span className="text-[13.5px] text-[var(--ink-3)]" id="recent-work">Recent work</span>
          <ul className="grid gap-x-10 gap-y-3 text-[14.5px] text-[var(--ink-2)] md:grid-cols-3" aria-labelledby="recent-work">
            <li>
              <Link href="/case-studies/auto-inspect" className="link-u hover:text-[var(--ink)]">
                AI vehicle inspection, annotated report in 1 min 47 s
              </Link>
            </li>
            <li>
              <Link href="/case-studies/pknail" className="link-u hover:text-[var(--ink)]">
                Scan-to-Revit engine, Revit 2026 add-in live
              </Link>
            </li>
            <li>
              <Link href="/case-studies/dr-kibria-seo" className="link-u hover:text-[var(--ink)]">
                150%+ organic growth for a consultant surgeon in 4 months
              </Link>
            </li>
          </ul>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
