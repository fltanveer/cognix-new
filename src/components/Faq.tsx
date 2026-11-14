"use client";

import { useId, useRef, useState } from "react";
import { BookButton } from "@/components/booking/Booking";
import { site } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import "./faq.css";

type QA = { q: string; a: string };

/**
 * FAQ as a question index and an answer card. Desktop: pick a question on the left, its answer swaps
 * into the card on the right (sticky while you scan). Phones: the answer opens under its question.
 * Every answer stays in the DOM and in the FAQPage schema. One or two questions skip the picker.
 */
export function Faq({ items, title = "Questions operators ask us" }: { items: QA[]; title?: string }) {
  const [active, setActive] = useState(0);
  const card = useRef<HTMLDivElement>(null);
  const uid = useId();
  const n = (i: number) => String(i + 1).padStart(2, "0");

  // the answer card's content rises in each time the question changes
  useGSAP(
    () => {
      if (prefersReducedMotion() || !card.current) return;
      gsap.fromTo(card.current.querySelectorAll("[data-swap]"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "expo.out", stagger: 0.05 });
    },
    { dependencies: [active], scope: card }
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  const simple = items.length < 3;

  return (
    <section className="section tone-light" aria-labelledby={`${uid}-title`}>
      <div className="container-x">
        <div className="faq-head">
          <div>
            <p className="faq-eyebrow">
              <span /> FAQ · {items.length} {items.length === 1 ? "question" : "questions"}
            </p>
            <h2 id={`${uid}-title`} className="t-d2 mt-4 max-w-[16ch]">
              {title}
            </h2>
          </div>
          <p className="max-w-[40ch] text-[var(--ink-2)]">
            Straight answers to what people ask before the first call. Not covered here?{" "}
            <a href={`mailto:${site.email}`} className="link-u text-[var(--ink)]">
              Email us
            </a>{" "}
            and we reply within one business day.
          </p>
        </div>

        {simple ? (
          <ul className="faq-simple">
            {items.map((it, i) => (
              <li key={it.q} className="faq-simple-item">
                <span className="faq-num">{n(i)}</span>
                <div>
                  <h3 className="text-[20px] tracking-[-0.015em] md:text-[22px]">{it.q}</h3>
                  <p className="mt-3 max-w-[62ch] text-[var(--ink-2)]">{it.a}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="faq-grid">
            <ol className="faq-list">
              {items.map((it, i) => {
                const on = i === active;
                return (
                  <li key={it.q} className={`faq-item ${on ? "is-on" : ""}`}>
                    <h3>
                      <button
                        type="button"
                        id={`${uid}-q${i}`}
                        aria-expanded={on}
                        aria-controls={`${uid}-a${i}`}
                        onClick={() => setActive(i)}
                        className="faq-q"
                      >
                        <span className="faq-num">{n(i)}</span>
                        <span className="faq-q-text">{it.q}</span>
                        <span className="faq-arrow" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 14 14">
                            <path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </button>
                    </h3>
                    {/* phones: the answer opens under its question */}
                    <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} className="faq-inline" hidden={!on}>
                      <p>{it.a}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* desktop: the answer card. Its text mirrors the open answer above, so it's hidden from screen readers. */}
            <div className="faq-card-wrap">
              <div ref={card} className="faq-card">
                <div className="faq-card-top" data-swap="" aria-hidden="true">
                  <span className="faq-badge">{n(active)}</span>
                  <span className="text-[13px] text-[var(--ink-3)]">
                    {n(active)} / {n(items.length - 1)}
                  </span>
                </div>
                <p className="faq-card-q" data-swap="" aria-hidden="true">
                  {items[active].q}
                </p>
                <p className="faq-card-a" data-swap="" aria-hidden="true">
                  {items[active].a}
                </p>
                <div className="faq-card-foot">
                  <span className="text-[14px] text-[var(--ink-2)]">Still unsure? We’ll answer it on a call.</span>
                  <BookButton className="btn btn-primary btn-sm" source="faq" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  );
}
