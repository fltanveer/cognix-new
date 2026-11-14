"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/** Infinite marquee whose speed and direction respond to scroll velocity. Pauses offscreen. */
export function Marquee({ items, className, speed = 40, dots = true }: { items: React.ReactNode[]; className?: string; speed?: number; dots?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const t = track.current;
      if (!t || prefersReducedMotion()) return;
      const half = t.scrollWidth / 2;
      const loop = gsap.to(t, { x: -half, duration: half / speed, ease: "none", repeat: -1 });
      let dir = 1;
      let target = 1;
      let current = 1;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        onUpdate: (self) => {
          const v = self.getVelocity();
          if (v !== 0) dir = v > 0 ? 1 : -1;
          target = dir * (1 + Math.min(Math.abs(v) / 300, 4));
        },
      });
      const tick = () => {
        target += (dir - target) * 0.04;
        current += (target - current) * 0.1;
        loop.timeScale(current);
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: root }
  );

  const row = (key: string, hidden?: boolean) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <span key={i} className="flex shrink-0 items-center">
          {it}
          {dots && <span className="mx-8 inline-block h-[5px] w-[5px] rounded-full bg-[var(--ink-3)] md:mx-12" />}
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} className={`overflow-hidden ${className ?? ""}`}>
      <div ref={track} className="marquee">
        {row("a")}
        {row("b", true)}
      </div>
    </div>
  );
}
