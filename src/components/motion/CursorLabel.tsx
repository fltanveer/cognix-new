"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/gsap";

/**
 * A label that follows the pointer over elements with [data-cursor="Label"].
 * Fine pointers only; purely decorative (the underlying link keeps its own accessible name).
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const pathname = usePathname();
  const hideRef = useRef<() => void>(() => {});

  // A new page never starts with a label from the previous one.
  useEffect(() => hideRef.current(), [pathname]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let active: Element | null = null;
    let px = -1;
    let py = -1;

    const show = (hit: Element | null) => {
      if (hit === active) return;
      active = hit;
      if (hit) {
        setLabel(hit.getAttribute("data-cursor") || "");
        gsap.to(el, { scale: 1, opacity: 1, duration: 0.35, ease: "expo.out", overwrite: "auto" });
      } else {
        gsap.to(el, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.in", overwrite: "auto" });
      }
    };
    const hide = () => show(null);
    hideRef.current = hide;

    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      xTo(px);
      yTo(py);
      show((e.target as Element).closest?.("[data-cursor]") ?? null);
    };
    // The page scrolls under a still pointer: re-check what is under it, or the label floats over nothing.
    const recheck = () => {
      if (px < 0) return;
      show(document.elementFromPoint(px, py)?.closest("[data-cursor]") ?? null);
    };
    const leave = (e: PointerEvent) => !e.relatedTarget && hide();

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", recheck, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("pointerdown", hide);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", recheck);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("pointerdown", hide);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", hide);
      hideRef.current = () => {};
    };
  }, []);

  return (
    <div ref={ref} className="cursor-label" aria-hidden="true">
      {label}
    </div>
  );
}
