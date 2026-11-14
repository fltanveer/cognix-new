"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/**
 * Lenis is the single smooth-scroll engine. It drives ScrollTrigger through the GSAP ticker.
 * Under reduced motion Lenis is never created and native scrolling is used.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  // Keep every trigger and pin measured against the real layout, with or without Lenis.
  useEffect(() => {
    // Phone address bars resize the viewport while scrolling; re-measuring then makes pins jump.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    // ScrollTrigger only re-measures on window resize. Content that grows later (lazy images,
    // accordions, filters, late fonts) would leave triggers and pins below it at stale offsets.
    let measured = document.documentElement.scrollHeight;
    let timer = 0;
    const onRefresh = () => void (measured = document.documentElement.scrollHeight);
    ScrollTrigger.addEventListener("refresh", onRefresh);
    const ro = new ResizeObserver(() => {
      if (Math.abs(document.documentElement.scrollHeight - measured) < 2) return; // includes our own pin spacers
      window.clearTimeout(timer);
      timer = window.setTimeout(refresh, 180);
    });
    ro.observe(document.body);

    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      window.removeEventListener("load", refresh);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    // Anchor links go through Lenis.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!;
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      instance.scrollTo(target as HTMLElement, { offset: -80 });
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Back/forward keeps the browser's restored position; only fresh navigations start at the top.
  const lastPath = useRef(pathname);
  const popped = useRef(false);
  useEffect(() => {
    const onPop = () => void (popped.current = true);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (lastPath.current === pathname) return; // first paint, or Lenis just became available
    lastPath.current = pathname;
    const restore = popped.current;
    popped.current = false;
    if (!restore && !window.location.hash) {
      lenis?.scrollTo(0, { immediate: true, force: true });
      if (!lenis) window.scrollTo(0, 0);
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
