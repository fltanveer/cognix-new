"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP, ScrollTrigger } from "@/lib/gsap";
import "./rewire-iso.css";

/**
 * The problem section ("Your team re-types the same data into four tools"): an isometric patch bay (anatomy iso kit, generated at
 * build time into rewire-figure.ts) shown in its connected state: every tool module wired back to one
 * lit bus. Status lights stay on and a signal runs along the bus while the section is on screen.
 */
const symptoms = [
  "The same record is typed into two or more systems.",
  "Work stalls until someone remembers to send a follow-up.",
  "Reports are assembled by hand from exports every week.",
];

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
        <div className="max-w-[540px]">
          <h2 id="rewire-title" className="t-d2">
            Your team <span className="whitespace-nowrap">re-types</span> the same data into four tools.
          </h2>
          <div className="mt-6 space-y-4 text-[var(--ink-2)]">
            <p>
              A request lands in the inbox. Someone copies it into a spreadsheet, enters it again in the CRM, then chases an approval in
              chat. Nobody on your team is slow. The tools don’t talk to each other, so your people carry the data between them.
            </p>
            <p>
              That is an infrastructure problem, not an effort problem. Hiring more people makes it bigger. Connecting the tools makes it go
              away, one workflow at a time.
            </p>
          </div>
          <ul className="mt-8 border-t border-[var(--line)]" aria-label="Signs this is happening">
            {symptoms.map((t) => (
              <li key={t} className="flex gap-3 border-b border-[var(--line)] py-3.5 text-[var(--ink)]">
                <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-text)]" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* No card: the rack sits straight on the page and fades into it at the edges. */}
        <figure className="relative lg:-mr-[calc(var(--gutter)+2vw)]">
          <div className="text-[13px] text-[var(--ink-3)] lg:pr-[calc(var(--gutter)+2vw)]">Fig 1 · Your tools, connected</div>
          {art}
          <figcaption className="mt-1 text-[13px] text-[var(--ink-3)] lg:pr-[calc(var(--gutter)+2vw)]">
            One connected flow instead of six tools and a person in the middle.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
