"use client";

import { useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import "./rewire-iso.css";
import "./inspect-iso.css";

const RUN_S = 107; // the recorded run: 1 min 47 s from upload to the 6-page report
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * The Auto Inspect recorded run, played on an isometric inspection bay (anatomy iso kit).
 * Plays once when it comes into view, with Replay: four captures, three findings,
 * five pipeline stages, six report pages and the sign-off stamp. Playback is compressed;
 * the clock shows the recorded time. Reduced motion shows the finished run.
 */
export function InspectBay({ art }: { art: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const el = root.current!;
      const fig = el.querySelector<HTMLElement>(".ins-iso")!;
      const q = (s: string) => Array.from(fig.querySelectorAll<SVGElement>(s));
      const on = (els: Element[], v = true, attr = "data-on") => els.forEach((e) => (v ? e.setAttribute(attr, "") : e.removeAttribute(attr)));
      const rays = q(".ins-ray"), screens = q(".ins-screen"), finds = q(".ins-find"), stages = q(".ins-stage"), pages = q(".ins-page"), stamp = q(".ins-stamp");
      const byI = (els: SVGElement[], i: number) => els.filter((e) => e.getAttribute("data-i") === String(i));

      if (prefersReducedMotion()) {
        fig.setAttribute("data-ins", "after");
        if (clock.current) clock.current.textContent = fmt(RUN_S);
        setDone(true);
        return;
      }

      const reset = () => {
        fig.setAttribute("data-ins", "run");
        [rays, screens, finds, stages, pages, stamp].forEach((g) => on(g, false));
        on(rays, false, "data-done");
        on(finds, false, "data-box");
        if (clock.current) clock.current.textContent = fmt(0);
        setDone(false);
      };
      reset();

      const t = { s: 0 };
      const run = gsap.timeline({ paused: true, onComplete: () => setDone(true) });
      run.to(t, { s: RUN_S, duration: 8.2, ease: "none", onUpdate: () => clock.current && (clock.current.textContent = fmt(t.s)) }, 0);
      // 1. guided capture: each phone takes its view in turn
      [0, 2, 1, 3].forEach((i, n) => {
        const at = 0.3 + n * 0.55;
        run.call(() => { on(byI(rays, i)); on(byI(screens, i)); }, [], at);
        run.call(() => { on(byI(rays, i), false); on(byI(rays, i), true, "data-done"); }, [], at + 0.45);
      });
      run.call(() => on(byI(stages, 0)), [], 2.6);
      // 2. quality check
      run.call(() => on(byI(stages, 1)), [], 3.1);
      // 3. damage detection: three findings ring up on the car
      finds.forEach((f, i) => run.call(() => on([f]), [], 3.5 + i * 0.35));
      run.call(() => on(byI(stages, 2)), [], 4.5);
      // 4. annotation boxes
      run.call(() => on(finds, true, "data-box"), [], 4.9);
      run.call(() => on(byI(stages, 3)), [], 5.2);
      // 5. report: six pages print into the tray, then the stamp
      pages.forEach((p, i) => run.call(() => on([p]), [], 5.6 + i * 0.32));
      run.call(() => on(byI(stages, 4)), [], 7.6);
      run.call(() => on(stamp), [], 8.0);
      tl.current = run;

      const st = gsap.timeline({ scrollTrigger: { trigger: fig, start: "top 75%", once: true, onEnter: () => run.play(0) } });
      return () => {
        st.scrollTrigger?.kill();
        run.kill();
      };
    },
    { scope: root }
  );

  const replay = () => {
    const fig = root.current?.querySelector<HTMLElement>(".ins-iso");
    if (!tl.current || !fig) return;
    fig.querySelectorAll("[data-on],[data-done],[data-box]").forEach((e) => e.removeAttribute("data-on"));
    fig.querySelectorAll("[data-done]").forEach((e) => e.removeAttribute("data-done"));
    fig.querySelectorAll("[data-box]").forEach((e) => e.removeAttribute("data-box"));
    setDone(false);
    tl.current.play(0);
  };

  return (
    <figure ref={root} className="relative lg:-mr-[calc(var(--gutter)+2vw)]">
      <div className="flex items-center justify-between gap-4 text-[13px] lg:pr-[calc(var(--gutter)+2vw)]">
        <span className="flex items-center gap-2 text-[var(--ink-3)]">
          <span className={`h-1.5 w-1.5 rounded-full ${done ? "bg-[var(--accent)]" : "bg-[var(--ink-3)]"}`} />
          Fig 2 · Auto Inspect, recorded run
        </span>
        <span className="flex items-center gap-3">
          <span ref={clock} className="tnum font-mono text-[15px] text-[var(--ink)]" aria-label="Recorded run time">
            01:47
          </span>
          <button type="button" onClick={replay} className="btn btn-ghost btn-sm" disabled={!done}>
            Replay
          </button>
        </span>
      </div>
      {art}
      <figcaption className="mt-1 text-[13px] text-[var(--ink-3)] lg:pr-[calc(var(--gutter)+2vw)]">
        Totals from a recorded run: 4 views, 3 findings, a 6-page report in 1 min 47 s. Playback compressed.
      </figcaption>
    </figure>
  );
}
