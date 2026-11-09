"use client";

import Link from "next/link";
import { useRef } from "react";
import { services } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { gsap, useGSAP, prefersReducedMotion, release } from "@/lib/gsap";

/** Editorial service rows with a pointer-following spotlight and a proof line that opens on hover/focus. */
export function ServicesList() {
  const root = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
      if (prefersReducedMotion()) return rows.forEach(release);
      rows.forEach((row) => {
        gsap.set(row, { autoAlpha: 0 });
        gsap.set(row.querySelector("[data-rule]"), { scaleX: 0 });
        release(row);
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%", once: true } });
        tl.to(row.querySelector("[data-rule]"), { scaleX: 1, duration: 1.1, ease: "expo.inOut" }).to(row, { autoAlpha: 1, duration: 0.6 }, 0.25).from(row.querySelector("[data-name]"), { yPercent: 60, duration: 0.9, ease: "expo.out" }, 0.25);
      });
    },
    { scope: root }
  );

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <ul ref={root}>
      {services.map((s) => (
        <li key={s.slug} data-row="" data-pending="" className="relative">
          <div data-rule="" className="absolute inset-x-0 top-0 h-px origin-left bg-[var(--line-strong)]" />
          <Link
            href={`/services/${s.slug}`}
            onPointerMove={onMove}
            className="group relative grid gap-4 overflow-hidden px-1 py-8 md:grid-cols-[1.1fr_1fr_auto] md:items-start md:gap-10 md:px-4 md:py-10"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: "radial-gradient(420px circle at var(--mx) var(--my), color-mix(in oklch, var(--ink) 7%, transparent), transparent 70%)" }}
            />
            <span className="block overflow-hidden pb-[0.12em] transition-transform duration-500 ease-[var(--ease-out)] md:group-hover:translate-x-2">
              <span data-name="" className="t-d3 block">
                {s.name}
              </span>
            </span>
            <span className="relative">
              <span className="block text-[var(--ink-2)]">{s.short}</span>
              <span className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[var(--ease-out)] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-visible:grid-rows-[1fr]">
                <span className="overflow-hidden">
                  <span className="mt-3 flex gap-2 text-[14.5px] text-[var(--ink)]">
                    <span className="mt-[9px] h-px w-4 shrink-0 bg-[var(--ink-3)]" />
                    {s.proofLine}
                  </span>
                </span>
              </span>
            </span>
            <span className="hidden h-12 w-12 place-items-center rounded-full border border-[var(--line-strong)] transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-ink)] md:grid">
              <Icon name="arrowUpRight" size={20} className="transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </Link>
        </li>
      ))}
      <li className="h-px bg-[var(--line-strong)]" aria-hidden="true" />
    </ul>
  );
}
