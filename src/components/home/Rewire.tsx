"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP, ScrollTrigger } from "@/lib/gsap";
import "./rewire-iso.css";

/**
 * "Something in your operations isn't working": an isometric patch bay (anatomy iso kit, generated at
 * build time into rewire-figure.ts) shown in its connected state: every tool module wired back to one
 * lit bus. Status lights stay on and a signal runs along the bus while the section is on screen.
 */
export function Rewire({ art }: { art: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!.querySelector<HTMLElement>(".rw-iso")!;
      // Always wired: status lights on, bus live. Only the signal loop depends on visibility.
      el.setAttribute("data-rw", "after");
      el.setAttribute("data-live", "");
      el.querySelectorAll(".rw-led").forEach((l) => l.setAttribute("data-on", ""));
      const vis = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => el.toggleAttribute("data-onscreen", self.isActive),
      });
      return () => vis.kill();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden" aria-labelledby="rewire-title">
      <div className="container-x grid items-center gap-10 py-[var(--section)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-6">
        <div className="max-w-[520px]">
          <h2 id="rewire-title" className="t-d2">
            Something in your operations isn’t working.
          </h2>
          <div className="mt-6 space-y-4 text-[var(--ink-2)]">
            <p>
              If your team still relies on manual work, disconnected tools and complicated workflows, the problem isn’t effort. It’s
              infrastructure.
            </p>
            <p>
              Most growing companies reach a point where their technology can’t keep up with how the business actually operates. We assess
              your operations, redesign the workflows that leak time, and connect the tools your team depends on.
            </p>
          </div>
          <p className="mt-8 border-l border-[var(--accent)] pl-4 text-[19px] leading-snug text-[var(--ink)]">
            The result: a business that runs faster, cleaner, and with far less friction.
          </p>
        </div>

        {/* No card: the rack sits straight on the page and fades into it at the edges. */}
        <figure className="relative lg:-mr-[calc(var(--gutter)+2vw)]">
          <div className="flex flex-col gap-1.5 text-[13px] sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:pr-[calc(var(--gutter)+2vw)]">
            <span className="shrink-0 text-[var(--ink-3)]">Fig 1 · Your tools, connected</span>
            <span className="flex items-center gap-2 whitespace-nowrap font-mono text-[12px] text-[var(--ink)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" /> 0 hand-offs · one connected bus
            </span>
          </div>
          {art}
          <figcaption className="mt-1 text-[13px] text-[var(--ink-3)] lg:pr-[calc(var(--gutter)+2vw)]">
            Illustrative. Inbox, spreadsheets, team chat, forms, ledger and CRM, wired to one connected bus.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
