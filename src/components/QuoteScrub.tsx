"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** A testimonial whose words light up as you read down the page (scrubbed, reversible). */
export function QuoteScrub({ text, name, title }: { text: string; name: string; title: string }) {
  const root = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        root.current!.querySelectorAll("[data-w]"),
        { opacity: 0.16 },
        { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 55%", scrub: true } }
      );
    },
    { scope: root }
  );

  return (
    <figure ref={root as React.RefObject<HTMLElement>} className="container-x section">
      <blockquote className="max-w-[26ch] text-[clamp(28px,3.6vw,50px)] leading-[1.15] tracking-[-0.03em]">
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">
          “
          {words.map((w, i) => (
            <span key={i} data-w="">
              {w}{" "}
            </span>
          ))}
          ”
        </span>
      </blockquote>
      <figcaption className="mt-8 text-[16px]">
        {name} <span className="text-[var(--ink-3)]">· {title}</span>
      </figcaption>
    </figure>
  );
}
