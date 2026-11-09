"use client";

import { useId, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

function Item({ q, a, onPaper }: { q: string; a: string; onPaper?: boolean }) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const icon = useRef<HTMLSpanElement>(null);
  const id = useId();

  const toggle = () => {
    const next = !open;
    setOpen(next);
    const el = panel.current!;
    if (prefersReducedMotion()) {
      el.style.height = next ? "auto" : "0px";
      return;
    }
    gsap.to(el, { height: next ? "auto" : 0, duration: 0.55, ease: "expo.out" });
    gsap.to(icon.current, { rotate: next ? 45 : 0, duration: 0.4, ease: "expo.out" });
  };

  const line = onPaper ? "border-[var(--paper-line)]" : "border-[var(--line-strong)]";
  return (
    <li className={`border-t ${line}`}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={toggle} className="flex w-full items-start justify-between gap-6 py-6 text-left text-[19px] tracking-[-0.015em] md:text-[21px]">
          {q}
          <span ref={icon} className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border ${line}`} aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
        </button>
      </h3>
      <div ref={panel} id={id} role="region" className="faq-panel overflow-hidden">
        <p className={`max-w-[62ch] pb-7 ${onPaper ? "text-[var(--graphite-2)]" : "text-[var(--ink-2)]"}`}>{a}</p>
      </div>
    </li>
  );
}

export function Faq({ items, title = "Questions operators ask us", onPaper }: { items: { q: string; a: string }[]; title?: string; onPaper?: boolean }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 id="faq-title" className="t-d2 max-w-[12ch]">
          {title}
        </h2>
        <ul className={`border-b ${onPaper ? "border-[var(--paper-line)]" : "border-[var(--line-strong)]"}`}>
          {items.map((i) => (
            <Item key={i.q} {...i} onPaper={onPaper} />
          ))}
        </ul>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  );
}
