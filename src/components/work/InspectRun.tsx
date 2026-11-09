"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { Icon } from "@/components/ui/Icon";

const TOTAL = 107; // 1 min 47 s, from Cognixlab's recorded Auto Inspect run
const views = ["Front", "Rear", "Left side", "Right side"];
const stages = [
  { name: "Guided capture", detail: "4 views" },
  { name: "Quality check", detail: "angle · light · coverage" },
  { name: "Damage detection", detail: "3 findings" },
  { name: "Annotation", detail: "bounding boxes + notes" },
  { name: "Report", detail: "6-page PDF" },
];

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * Auto Inspect run panel. The total time, view count, finding count and report length are real;
 * the playback is compressed to ~6 seconds and stage boundaries are illustrative.
 */
export function InspectRun() {
  const root = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [t, setT] = useState(TOTAL);
  const [stage, setStage] = useState(stages.length);
  const [done, setDone] = useState(true);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const clock = { s: 0 };
      const tl = gsap.timeline({
        paused: true,
        onStart: () => setDone(false),
        onComplete: () => setDone(true),
      });
      tl.set(q("[data-view]"), { autoAlpha: 0.25 })
        .set(q("[data-view-check]"), { scale: 0 })
        .set(q("[data-finding]"), { autoAlpha: 0, x: -8 })
        .set(q("[data-report]"), { autoAlpha: 0, y: 12 })
        .add(() => {
          setStage(0);
          setT(0);
        })
        .to(clock, { s: TOTAL, duration: 6, ease: "power1.inOut", onUpdate: () => setT(clock.s) }, 0)
        .to(q("[data-view]"), { autoAlpha: 1, duration: 0.25, stagger: 0.28 }, 0.1)
        .to(q("[data-view-check]"), { scale: 1, duration: 0.3, ease: "expo.out", stagger: 0.28 }, 0.25)
        .add(() => setStage(1), 1.3)
        .add(() => setStage(2), 2.2)
        .to(q("[data-finding]"), { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.45 }, 2.5)
        .add(() => setStage(3), 4.0)
        .add(() => setStage(4), 5.0)
        .to(q("[data-report]"), { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" }, 5.2)
        .add(() => setStage(5), 6);
      tlRef.current = tl;
      ScrollTrigger.create({ trigger: root.current, start: "top 70%", once: true, onEnter: () => tl.play(0) });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="card overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className={`h-2 w-2 rounded-full ${done ? "bg-[var(--accent)]" : "animate-pulse bg-[var(--ink)]"}`} />
          <span className="text-[15px]">Auto Inspect · recorded run</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[20px] tnum" aria-label={`Elapsed ${fmt(t)}`}>
            {fmt(t)}
          </span>
          <button
            type="button"
            onClick={() => tlRef.current?.play(0)}
            disabled={!done}
            className="rounded-full border border-[var(--line-strong)] px-3 py-1.5 text-[13px] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)] disabled:opacity-40"
          >
            Replay
          </button>
        </div>
      </div>

      <div className="grid gap-px bg-[var(--line)] md:grid-cols-[1.1fr_1fr]">
        <div className="bg-[var(--surface)] p-5">
          <div className="text-[13px] text-[var(--ink-3)]">Views captured</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {views.map((v) => (
              <div key={v} data-view="" className="relative flex aspect-[4/3] flex-col justify-between rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] p-3">
                <Icon name="camera" size={18} className="text-[var(--ink-3)]" />
                <div className="flex items-center justify-between text-[13px]">
                  {v}
                  <span data-view-check="" className="grid h-5 w-5 place-items-center rounded-full bg-[var(--ink)] text-[var(--canvas)]">
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                      <path d="M2 5.2 4 7.2 8 3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 text-[13px] text-[var(--ink-3)]">Findings</div>
          <ul className="mt-2 space-y-1.5">
            {[1, 2, 3].map((n) => (
              <li key={n} data-finding="" className="flex items-center justify-between rounded-[8px] border border-[var(--line)] px-3 py-2 text-[13.5px]">
                <span>Finding {n}</span>
                <span className="font-mono text-[11.5px] text-[var(--ink-3)]">annotated</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[var(--surface)] p-5">
          <div className="text-[13px] text-[var(--ink-3)]">Five-stage pipeline</div>
          <ol className="mt-3 space-y-1">
            {stages.map((s, i) => {
              const state = i < stage ? "done" : i === stage ? "active" : "todo";
              return (
                <li key={s.name} className="flex items-center gap-3 rounded-[8px] px-2 py-2">
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] transition-colors duration-300 ${
                      state === "done" ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--canvas)]" : state === "active" ? "border-[var(--ink)] text-[var(--ink)]" : "border-[var(--line-strong)] text-[var(--ink-3)]"
                    }`}
                  >
                    {state === "done" ? "✓" : i + 1}
                  </span>
                  <span className={`flex-1 text-[14.5px] transition-colors duration-300 ${state === "todo" ? "text-[var(--ink-3)]" : "text-[var(--ink)]"}`}>{s.name}</span>
                  <span className="font-mono text-[11.5px] text-[var(--ink-3)]">{s.detail}</span>
                </li>
              );
            })}
          </ol>
          <div data-report="" className="mt-5 flex items-center gap-3 rounded-[10px] border border-[var(--line-strong)] bg-[var(--surface-2)] p-3">
            <Icon name="doc" size={22} className="text-[var(--ink)]" />
            <div className="flex-1">
              <div className="text-[14px]">inspection-report.pdf</div>
              <div className="font-mono text-[11.5px] text-[var(--ink-3)]">6 pages · time-stamped</div>
            </div>
            <span className="font-mono text-[12px] tnum text-[var(--ink-2)]">01:47</span>
          </div>
        </div>
      </div>
      <p className="border-t border-[var(--line)] px-5 py-3 text-[12.5px] text-[var(--ink-3)]">
        Totals from a recorded run: 4 views, 3 findings, 6-page report in 1 min 47 s. Playback compressed.
      </p>
    </div>
  );
}
