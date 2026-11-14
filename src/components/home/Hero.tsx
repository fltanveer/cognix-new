"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Magnetic } from "@/components/motion/Magnetic";
import { BookButton } from "@/components/booking/Booking";
import { gsap, useGSAP, prefersReducedMotion, release } from "@/lib/gsap";
import { site } from "@/content/site";
import { PhoneInHand } from "@/components/phone/PhoneInHand";

// Three.js loads after first paint so the headline and CTA aren't blocked by the shader.
const SignalField = dynamic(() => import("@/components/hero/SignalField").then((m) => m.SignalField), { ssr: false });

// Published project results only; each card links to its project page.
const recent = [
  { href: "/work/auto-inspect", img: "/img/work/auto-inspect-cover.webp", client: "Auto Inspect", industry: "Insurance", metric: "1 min 47 s", label: "Four vehicle photos to an annotated PDF report" },
  { href: "/work/pknail", img: "/img/work/pknail-cover.webp", client: "PKNail", industry: "AEC", metric: "Revit 2026", label: "Scan-to-Revit engine, add-in live" },
  { href: "/work/dr-kibria-seo", img: "/img/work/kibria-cover.webp", client: "Dr. Kibria", industry: "Healthcare", metric: "150%+", label: "Organic growth for a surgeon in 4 months" },
];

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

      // Phone fades in with CSS (.hero-phone); scroll only owns the wrapper, with explicit start values.
      gsap.fromTo(
        q("[data-reel]"),
        { yPercent: 0, autoAlpha: 1 },
        {
          yPercent: -10,
          autoAlpha: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        }
      );

      // Content drifts up and dims as the field takes over on scroll. Desktop only: on phones the hero is
      // taller than the screen, so the proof cards would be read mid-fade.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to(q("[data-hero-copy]"), {
          yPercent: -18,
          autoAlpha: 0.25,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-8 pt-28 md:pb-10" aria-labelledby="hero-title">
      <SignalField triggerRef={root} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--canvas)] to-transparent" aria-hidden="true" />

      {/* Right side: a hand holding the product, its feed scrolling live; the wrist rises from the hero's bottom edge. */}
      <div data-reel="" className="hero-phone">
        <PhoneInHand />
      </div>

      <div data-hero-copy="" className="container-x relative">
        <p data-intro="" data-pending="" className="mb-6 flex items-center gap-2.5 text-[15px] text-[var(--ink-2)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
          AI & digital systems studio · Cambridge, MA
        </p>

        <SplitHeading as="h1" id="hero-title" trigger="load" delay={0.25} stagger={0.06} text="Your team shouldn't be the integration layer." className="t-hero max-w-[12.5ch] hero-fit" />

        <div className="lg:max-w-[60%]">

        <div className="mt-8 grid gap-10 md:mt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end lg:grid-cols-1 lg:gap-8">
          <p data-intro="" data-pending="" className="t-lead max-w-[46ch] text-[var(--ink-2)]">
            We connect the tools you already run and automate the busywork for growing companies in Boston and New York. It starts with a
            two-week Workflow Assessment, and AI goes in only where the numbers work.
          </p>
          <div data-intro="" data-pending="" className="md:justify-self-end lg:justify-self-start">
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <BookButton source="hero" />
              </Magnetic>
              <Link href="/work" className="btn btn-ghost">
                See our work
              </Link>
            </div>
            <p className="mt-3 text-[14px] text-[var(--ink-3)]">
              {site.booking.minutes} minutes. We map one workflow and tell you honestly if AI is the fix.
            </p>
          </div>
        </div>

        <div className="mt-8 md:mt-10">
          <div data-proof-line="" className="h-px origin-left bg-[var(--line-strong)]" />
          <div data-intro="" data-pending="" className="mt-5">
            <div className="mb-3 flex items-center justify-between gap-4 text-[13.5px]">
              <span className="text-[var(--ink-3)]" id="recent-work">
                Recent work
              </span>
              <Link href="/work" className="link-u text-[var(--ink-2)] hover:text-[var(--ink)]">
                All work →
              </Link>
            </div>
            <ul className="grid gap-3 md:grid-cols-3" aria-labelledby="recent-work">
              {recent.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} data-cursor="View project" className="proof-card group">
                    <Image src={r.img} alt="" fill sizes="(min-width: 768px) 260px, 100vw" className="proof-card-img" />
                    <span className="proof-card-shade" aria-hidden="true" />
                    <span className="relative flex items-center justify-between gap-3 text-[12.5px] text-[var(--ink-2)]">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                        <span className="truncate">
                          {r.client} · {r.industry}
                        </span>
                      </span>
                      <span className="proof-card-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </span>
                    <span className="relative mt-2.5 block text-[24px] font-medium leading-none tracking-[-0.03em] text-[var(--ink)] tnum">
                      {r.metric}
                    </span>
                    <span className="relative mt-2 block text-[13.5px] leading-snug text-[var(--ink-2)]">{r.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
