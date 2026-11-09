"use client";

import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/content/site";
import { sampleTestimonials, showSampleTestimonials } from "@/content/sample-testimonials";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Icon } from "@/components/ui/Icon";

type Quote = { text: string; who: string; where: string; service: string; sample?: boolean };

const real: Quote[] = testimonials.map((t) => ({
  text: t.text,
  who: t.name,
  where: t.title,
  service: t.service,
}));
const samples: Quote[] = showSampleTestimonials
  ? sampleTestimonials.map((t) => ({ text: t.text, who: t.role, where: t.org, service: t.service, sample: true }))
  : [];

/** Spread real quotes across rows first so every row carries at least one, then fill with samples. */
function buildRows(): { items: Quote[]; unique: number }[] {
  const all = [...real, ...samples];
  const rowCount = all.length >= 6 ? 2 : 1;
  const rows: Quote[][] = Array.from({ length: rowCount }, () => []);
  real.forEach((q, i) => rows[i % rowCount].push(q));
  samples.forEach((q, i) => rows[i % rowCount].push(q));
  // each half of a looping track must be wider than the viewport
  return rows.map((r) => {
    const out = [...r];
    while (out.length < 6) out.push(...r);
    return { items: out, unique: r.length };
  });
}

const rows = buildRows();
const speeds = [70, 86, 62];

function Card({ q }: { q: Quote }) {
  return (
    <figure className="card relative flex w-[21rem] flex-none flex-col p-6 md:w-[24rem] md:p-7">
      {q.sample && (
        <span className="absolute right-4 top-4 rounded-[var(--r-chip)] border border-dashed border-[var(--line-strong)] px-2 py-0.5 text-[12px] text-[var(--ink-3)]">
          Sample
        </span>
      )}
      <span aria-hidden="true" className="text-[40px] leading-[0.6] text-[var(--accent)]">
        “
      </span>
      <blockquote className="mt-4 text-[16.5px] leading-[1.55] text-[var(--ink)]">{q.text}</blockquote>
      <figcaption className="mt-auto flex items-end justify-between gap-4 pt-6">
        <span>
          <span className="block text-[15px] text-[var(--ink)]">{q.who}</span>
          <span className="block text-[14px] text-[var(--ink-3)]">{q.where}</span>
        </span>
        <span className="shrink-0 rounded-[var(--r-chip)] bg-[var(--surface-2)] px-2.5 py-1 text-[12.5px] text-[var(--ink-2)]">{q.service}</span>
      </figcaption>
    </figure>
  );
}

/**
 * Testimonials as slow, counter-moving rows. Pauses on hover, keyboard focus, offscreen, and via the visible
 * Pause button (WCAG 2.2.2). Reduced motion: rows become static, swipeable lists.
 */
export function TestimonialRows() {
  const root = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-off", !e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root} className={`t-rows section overflow-hidden ${paused ? "is-paused" : ""}`} aria-labelledby="testimonials-title">
      <div className="container-x mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <SplitHeading id="testimonials-title" text="What clients say once the work ships." className="t-d2 max-w-[16ch]" />
          <p className="t-lead mt-5 max-w-[48ch] text-[var(--ink-2)]">Founders, operators and practice managers we have built for.</p>
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="t-toggle btn btn-ghost btn-sm"
        >
          <Icon name={paused ? "play" : "pause"} size={18} />
          {paused ? "Play" : "Pause"}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {rows.map((row, ri) => (
          <div key={ri} className="t-row">
            <div className={`t-track ${ri % 2 ? "reverse" : ""}`} style={{ "--dur": `${speeds[ri % speeds.length]}s` } as React.CSSProperties}>
              <ul className="flex flex-none gap-6 pr-6">
                {row.items.map((q, i) => (
                  <li key={i} className="flex" aria-hidden={i >= row.unique || undefined}>
                    <Card q={q} />
                  </li>
                ))}
              </ul>
              {/* duplicate half for a seamless loop; hidden from assistive tech */}
              <ul className="t-dup flex flex-none gap-6 pr-6" aria-hidden="true">
                {row.items.map((q, i) => (
                  <li key={i} className="flex">
                    <Card q={q} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
