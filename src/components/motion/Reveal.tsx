"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP, prefersReducedMotion, release } from "@/lib/gsap";

type Variant = "rise" | "fade" | "clip" | "clip-x" | "scale" | "slide-left";

type Props = {
  as?: ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  /** Animate direct children in sequence instead of the wrapper. */
  stagger?: number;
  delay?: number;
  start?: string;
} & Record<string, unknown>;

const from: Record<Variant, gsap.TweenVars> = {
  rise: { y: 36, autoAlpha: 0 },
  fade: { autoAlpha: 0 },
  clip: { clipPath: "inset(18% 8% 18% 8% round 22px)", scale: 1.08, autoAlpha: 0.4 },
  "clip-x": { clipPath: "inset(0% 100% 0% 0%)" },
  scale: { scale: 0.92, autoAlpha: 0 },
  "slide-left": { x: 60, autoAlpha: 0 },
};
const to: Record<Variant, gsap.TweenVars> = {
  rise: { y: 0, autoAlpha: 1 },
  fade: { autoAlpha: 1 },
  clip: { clipPath: "inset(0% 0% 0% 0% round 22px)", scale: 1, autoAlpha: 1 },
  "clip-x": { clipPath: "inset(0% 0% 0% 0%)" },
  scale: { scale: 1, autoAlpha: 1 },
  "slide-left": { x: 0, autoAlpha: 1 },
};

/** Scroll-triggered entrance with several distinct variants so sections don't all fade up the same way. */
export function Reveal({ as: Tag = "div", children, className, variant = "rise", stagger, delay = 0, start = "top 86%", ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        release(el);
        return;
      }
      const targets = stagger ? Array.from(el.children) : el;
      gsap.set(targets, from[variant]);
      release(el);
      gsap.to(targets, {
        ...to[variant],
        duration: variant.startsWith("clip") ? 1.3 : 1,
        ease: variant.startsWith("clip") ? "expo.inOut" : "power3.out",
        stagger: stagger ?? 0,
        delay,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref }
  );

  return (
    // slide-left starts 60px to the right; clip it so phones never get a wider layout viewport.
    <Tag ref={ref} className={variant === "slide-left" ? `${className ?? ""} overflow-x-clip` : className} data-pending="" {...rest}>
      {children}
    </Tag>
  );
}
