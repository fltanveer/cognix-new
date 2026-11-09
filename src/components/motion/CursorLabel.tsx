"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/gsap";

/**
 * A label that follows the pointer over elements with [data-cursor="Label"].
 * Fine pointers only; purely decorative (the underlying link keeps its own accessible name).
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let active: Element | null = null;

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const hit = (e.target as Element).closest?.("[data-cursor]");
      if (hit !== active) {
        active = hit;
        if (hit) {
          setLabel(hit.getAttribute("data-cursor") || "");
          gsap.to(el, { scale: 1, opacity: 1, duration: 0.35, ease: "expo.out" });
        } else {
          gsap.to(el, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
        }
      }
    };
    const hide = () => {
      active = null;
      gsap.to(el, { scale: 0, opacity: 0, duration: 0.2 });
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-label" aria-hidden="true">
      {label}
    </div>
  );
}
