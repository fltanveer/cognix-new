"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Thin reading-progress rule under the header for long-form articles. */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.querySelector(".prose-c"), start: "top 30%", end: "bottom bottom", scrub: 0.3 } });
  });
  return <div ref={bar} aria-hidden="true" className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left scale-x-0 bg-[var(--ink)]" />;
}
