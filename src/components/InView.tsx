"use client";

import { useEffect, useRef } from "react";

/** Sets data-onscreen on its first child while it is visible, so CSS loops only run on screen. */
export function InView({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    const el = host?.firstElementChild;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.toggleAttribute("data-onscreen", e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
