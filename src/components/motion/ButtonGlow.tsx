"use client";

import { useEffect } from "react";
import { isFinePointer, prefersReducedMotion } from "@/lib/gsap";

/**
 * Lets the primary button's glow follow the pointer across it. One delegated listener for the
 * whole site: it only writes --gx on the button under a fine pointer, and lets the CSS ease it.
 * On leave the glow drifts back to centre. Touch and reduced motion keep the static glow.
 */
export function ButtonGlow() {
  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    let last: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      const btn = (e.target as Element | null)?.closest?.<HTMLElement>(".btn-primary") ?? null;
      if (last && last !== btn) last.style.removeProperty("--gx");
      last = btn;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const x = Math.min(92, Math.max(8, ((e.clientX - r.left) / r.width) * 100));
      btn.style.setProperty("--gx", `${x.toFixed(1)}%`);
    };
    const onLeave = () => {
      last?.style.removeProperty("--gx");
      last = null;
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return null;
}
