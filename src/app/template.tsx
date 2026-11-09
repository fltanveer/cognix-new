"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

let firstPaint = true;

/** Route-enter curtain. Skipped on the first paint so the hero intro owns the opening moment. */
export default function Template({ children }: { children: React.ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const c = curtain.current;
    if (!c) return;
    if (firstPaint || prefersReducedMotion()) {
      firstPaint = false;
      c.style.display = "none";
      return;
    }
    const tl = gsap.timeline();
    tl.set(c, { display: "block", yPercent: 0 })
      .to(c, { yPercent: -100, duration: 0.85, ease: "expo.inOut" })
      .from(page.current, { y: 60, duration: 1.1, ease: "expo.out" }, "<0.25")
      .set(c, { display: "none" });
  });

  return (
    <>
      <div
        ref={curtain}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70] bg-[var(--surface)]"
        style={{ display: "none" }}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--accent)]" />
      </div>
      <div ref={page}>{children}</div>
    </>
  );
}
