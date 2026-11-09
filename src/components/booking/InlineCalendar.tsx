"use client";

import { useEffect, useRef, useState } from "react";
import { calendlySrc } from "./Booking";
import { site } from "@/content/site";

/** Calendar embedded in-page; loads when scrolled near. */
export function InlineCalendar() {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: "400px" });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} id="book" className="card relative h-[720px] scroll-mt-28 overflow-hidden">
      {!ready && (
        <div className="absolute inset-0 grid place-items-center text-[15px] text-[var(--ink-3)]">
          <span className="flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" /> Loading calendar ·{" "}
            <a href={site.booking.url} className="link-u" target="_blank" rel="noopener">
              open in new tab
            </a>
          </span>
        </div>
      )}
      {load && <iframe title="Book a Workflow Review" src={calendlySrc()} onLoad={() => setReady(true)} className="relative h-full w-full" style={{ opacity: ready ? 1 : 0, transition: "opacity .4s" }} />}
    </div>
  );
}
