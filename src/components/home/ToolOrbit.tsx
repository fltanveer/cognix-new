"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import type { SolarName } from "@/components/ui/solar";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * The tools a growing company runs today, orbiting the one system that connects them.
 * Generic tool categories (not brand logos) so the graphic never implies an integration we haven't shipped.
 *
 * Structure keeps GSAP and CSS off the same property:
 *   ring wrapper  → GSAP intro (scale/opacity)
 *     ring        → CSS rotate (continuous)
 *       icon slot → GSAP intro (scale/opacity), positioned on the ring
 *         chip    → CSS counter-rotate so the icon stays upright
 */
const rings: { r: number; dur: number; tools: { icon: SolarName; label: string }[] }[] = [
  {
    r: 12,
    dur: 46,
    tools: [
      { icon: "users", label: "CRM" },
      { icon: "sheet", label: "Spreadsheets" },
      { icon: "mail", label: "Email" },
      { icon: "wallet", label: "Invoicing" },
    ],
  },
  {
    r: 20,
    dur: 70,
    tools: [
      { icon: "calendar", label: "Scheduling" },
      { icon: "file", label: "Documents" },
      { icon: "chat", label: "Team chat" },
      { icon: "database", label: "Database" },
      { icon: "chart", label: "Reports" },
      { icon: "phone", label: "Phone and SMS" },
    ],
  },
  {
    r: 28,
    dur: 100,
    tools: [
      { icon: "camera", label: "Field photos" },
      { icon: "cart", label: "Orders" },
      { icon: "inbox", label: "Shared inbox" },
      { icon: "card", label: "Payments" },
      { icon: "server", label: "Legacy system" },
      { icon: "code", label: "APIs" },
      { icon: "doc", label: "Contracts" },
      { icon: "building", label: "Properties" },
    ],
  },
];

export function ToolOrbit({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  // Continuous rotation only runs while the orbit is on screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-paused", !e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ delay: 0.9 });
      tl.fromTo(q("[data-core]"), { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.1, ease: "expo.out" })
        .fromTo(q("[data-ring]"), { scale: 0.55, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.4, ease: "expo.out", stagger: 0.12 }, "-=0.8")
        .fromTo(q("[data-slot]"), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "expo.out", stagger: 0.035 }, "-=1.1");
    },
    { scope: root }
  );

  return (
    <div ref={root} aria-hidden="true" className={`tool-orbit pointer-events-none select-none ${className ?? ""}`}>
      <div className="relative h-[60rem] w-[60rem]">
        {/* soft canvas pool so the orbit reads over the signal field */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--canvas)_44%,transparent_72%)]" />

        {rings.map((ring, ri) => {
          const d = ring.r * 2;
          return (
            <div
              key={ri}
              data-ring=""
              className="absolute left-1/2 top-1/2"
              style={{ width: `${d}rem`, height: `${d}rem`, marginLeft: `-${ring.r}rem`, marginTop: `-${ring.r}rem` }}
            >
              <div
                className="orbit-spin absolute inset-0 rounded-full border border-dashed border-[var(--line-strong)]"
                style={{ animationDuration: `${ring.dur}s`, animationDirection: ri % 2 ? "reverse" : "normal" }}
              >
                {/* a data packet riding the ring */}
                <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] shadow-[0_0_14px_3px_var(--accent-soft)]" />
                <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[var(--accent)] opacity-70" />
                {ring.tools.map((t, ti) => {
                  const a = (ti / ring.tools.length) * Math.PI * 2 + ri * 0.6;
                  const x = (50 + 50 * Math.cos(a)).toFixed(3); // fixed precision: server and client must serialize identically
                  const y = (50 + 50 * Math.sin(a)).toFixed(3);
                  return (
                    <div key={t.label} data-slot="" className="absolute" style={{ left: `${x}%`, top: `${y}%`, marginLeft: -28, marginTop: -28 }}>
                      <div
                        className="orbit-spin grid h-14 w-14 place-items-center rounded-full border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink-2)] shadow-[inset_0_1px_0_var(--hi)]"
                        style={{ animationDuration: `${ring.dur}s`, animationDirection: ri % 2 ? "normal" : "reverse" }}
                        title={t.label}
                      >
                        <Icon name={t.icon} size={24} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* the connecting system */}
        <div data-core="" className="absolute left-1/2 top-1/2 -ml-20 -mt-20 grid h-40 w-40 place-items-center rounded-full border border-[var(--line-strong)] bg-[var(--surface-2)] shadow-[0_0_60px_8px_var(--accent-soft),inset_0_1px_0_var(--hi)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/cognixlab-mark.png" alt="" width={304} height={400} className="h-16 w-auto translate-x-[-6%]" />
        </div>
      </div>
    </div>
  );
}
