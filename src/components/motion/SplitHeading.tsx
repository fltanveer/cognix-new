"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP, prefersReducedMotion, release } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  text: string;
  className?: string;
  /** "scroll" reveals when the heading enters the viewport; "load" plays on mount. */
  trigger?: "scroll" | "load";
  delay?: number;
  stagger?: number;
  id?: string;
};

/**
 * Word-by-word heading reveal. The accessible name is the unsplit text in an sr-only span;
 * the split words are aria-hidden. Without JS the words render visible in place.
 */
export function SplitHeading({ as: Tag = "h2", text, className, trigger = "scroll", delay = 0, stagger = 0.055, id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = el.querySelectorAll(".split-word");
      if (prefersReducedMotion()) {
        release(el);
        return;
      }
      gsap.set(targets, { yPercent: 110, rotate: 2.5 });
      release(el);
      gsap.to(targets, {
        yPercent: 0,
        rotate: 0,
        duration: 1.05,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} data-pending="" id={id}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} className="split-line">
            <span className="split-word">{w}</span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
