"use client";

import { useRef } from "react";
import { method } from "@/content/site";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { METHOD_ICONS } from "./method-icons";
import "./rewire-iso.css";
import "./method-icons.css";

/** Four-phase method. A scrubbed rail fills as you read; the phase in focus lights up, icon included. */
export function Method({ title = "Transformation shouldn’t feel like guesswork." }: { title?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const steps = q("[data-step]");
      if (prefersReducedMotion()) {
        steps.forEach((s) => s.classList.add("is-on"));
        return;
      }
      gsap.fromTo(q("[data-fill]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: q("[data-list]")[0], start: "top 60%", end: "bottom 60%", scrub: true } });
      steps.forEach((s) => {
        ScrollTrigger.create({ trigger: s, start: "top 62%", end: "bottom 62%", toggleClass: { targets: s, className: "is-on" } });
        gsap.from(s.querySelectorAll("[data-chip]"), { y: 14, autoAlpha: 0, stagger: 0.06, duration: 0.6, scrollTrigger: { trigger: s, start: "top 70%", once: true } });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="how-we-work" className="section" aria-labelledby="method-title">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="method-title" className="t-d2 max-w-[13ch]">
            {title}
          </h2>
          <p className="mt-5 max-w-[42ch] text-[var(--ink-2)]">
            Assess, Architect, Implement, Optimize. Each phase ends with something you can hold, so you decide the next step with evidence.
          </p>
        </div>

        <div data-list="" className="relative pl-8 md:pl-12">
          <div className="absolute bottom-2 left-[5px] top-2 w-px bg-[var(--line-strong)]" aria-hidden="true">
            <div data-fill="" className="h-full w-px origin-top bg-[var(--ink)]" />
          </div>
          <ol className="space-y-16 md:space-y-24">
            {method.map((m, i) => (
              <li key={m.phase} data-step="" className="group relative [&.is-on_.dot]:bg-[var(--accent)] [&.is-on_.dot]:shadow-[0_0_0_6px_var(--accent-soft)] [&.is-on_.phase]:text-[var(--ink)]">
                <span className="dot absolute -left-8 top-[0.55em] h-[11px] w-[11px] rounded-full border border-[var(--ink-2)] bg-[var(--canvas)] transition-[background-color,box-shadow] duration-500 md:-left-12" aria-hidden="true" />
                <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(150px,200px)] md:items-start md:gap-8">
                  <div
                    className="rw-iso mi -mb-10 w-[150px] md:order-2 md:mb-0 md:w-full md:-mt-6"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: METHOD_ICONS[m.phase.toLowerCase()] ?? "" }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-[12px] text-[var(--ink-3)]">Phase {i + 1}</span>
                    </div>
                    <h3 className="phase t-d2 mt-2 text-[var(--ink-3)] transition-colors duration-500">{m.phase}</h3>
                    <p className="mt-4 max-w-[48ch] text-[var(--ink-2)]">{m.what}</p>
                    <p className="mt-4 max-w-[52ch] text-[15px]">
                      <span className="text-[var(--ink-3)]">You get: </span>
                      {m.youGet}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="This prevents">
                      {m.prevents.map((p) => (
                        <li key={p} data-chip="" className="rounded-full border border-[var(--line)] px-3 py-1 text-[13px] text-[var(--ink-2)]">
                          Prevents: {p.toLowerCase()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
