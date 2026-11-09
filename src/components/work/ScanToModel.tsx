"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type Seg = [number, number, number, number];
// Simple floor plan in unit space: outer shell + interior walls (with door gaps).
const walls: Seg[] = [
  [0.08, 0.1, 0.92, 0.1],
  [0.92, 0.1, 0.92, 0.9],
  [0.92, 0.9, 0.08, 0.9],
  [0.08, 0.9, 0.08, 0.1],
  [0.46, 0.1, 0.46, 0.42],
  [0.46, 0.52, 0.46, 0.9],
  [0.08, 0.56, 0.3, 0.56],
  [0.38, 0.56, 0.46, 0.56],
  [0.46, 0.46, 0.66, 0.46],
  [0.74, 0.46, 0.92, 0.46],
];

function rand(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

/**
 * Data graphic of the PKNail pipeline: scan points → AI-extracted walls → native model.
 * Plays once on view; static final frame under reduced motion.
 */
export function ScanToModel({ className, showSteps = true }: { className?: string; showSteps?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    const r = rand(7);
    const pts: { x: number; y: number; nx: number; ny: number; wall: boolean; t: number }[] = [];
    walls.forEach(([x1, y1, x2, y2]) => {
      const len = Math.hypot(x2 - x1, y2 - y1);
      const n = Math.round(len * 260);
      for (let i = 0; i < n; i++) {
        const k = r();
        const g = (r() + r() + r() - 1.5) * 0.035;
        const horiz = Math.abs(y2 - y1) < 0.001;
        pts.push({ x: x1 + (x2 - x1) * k, y: y1 + (y2 - y1) * k, nx: horiz ? 0 : g, ny: horiz ? g : 0, wall: true, t: r() });
      }
    });
    for (let i = 0; i < 520; i++) {
      // furniture & clutter blobs
      const cx = [0.25, 0.7, 0.24, 0.8, 0.62][i % 5];
      const cy = [0.3, 0.25, 0.75, 0.7, 0.72][i % 5];
      pts.push({ x: cx + (r() - 0.5) * 0.16, y: cy + (r() - 0.5) * 0.12, nx: 0, ny: 0, wall: false, t: r() });
    }

    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue("--ink").trim() || "#eef1e8";
    const accent = css.getPropertyValue("--accent").trim() || "#c9f31d";
    const state = { a: 0 };
    let w = 0;
    let h = 0;

    const size = () => {
      const b = wrap.current!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = b.width;
      h = b.height;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    function draw() {
      const a = state.a;
      ctx.clearRect(0, 0, w, h);
      const pad = 14;
      const S = Math.min(w, h) - pad * 2;
      const ox = (w - S) / 2;
      const oy = (h - S) / 2;
      const scan = clamp(a / 0.3);
      const snap = clamp((a - 0.32) / 0.3);
      const lines = clamp((a - 0.58) / 0.24);
      const solid = clamp((a - 0.82) / 0.18);

      ctx.fillStyle = ink;
      for (const p of pts) {
        if (p.t > scan) continue;
        const fade = p.wall ? 1 - solid * 0.85 : 1 - snap;
        if (fade <= 0.01) continue;
        ctx.globalAlpha = (p.wall ? 0.55 : 0.32) * fade;
        const x = ox + (p.x + p.nx * (1 - snap)) * S;
        const y = oy + (p.y + p.ny * (1 - snap)) * S;
        ctx.fillRect(x, y, 1.4, 1.4);
      }
      ctx.globalAlpha = 1;
      if (lines > 0) {
        ctx.lineCap = "square";
        walls.forEach(([x1, y1, x2, y2], i) => {
          const local = clamp(lines * walls.length - i * 0.6);
          if (local <= 0) return;
          ctx.strokeStyle = solid > 0 ? ink : accent;
          ctx.lineWidth = 1 + solid * 5;
          ctx.globalAlpha = 0.9;
          ctx.beginPath();
          ctx.moveTo(ox + x1 * S, oy + y1 * S);
          ctx.lineTo(ox + (x1 + (x2 - x1) * local) * S, oy + (y1 + (y2 - y1) * local) * S);
          ctx.stroke();
        });
        ctx.globalAlpha = 1;
      }
    }

    size();
    const ro = new ResizeObserver(size);
    ro.observe(wrap.current!);

    if (prefersReducedMotion()) {
      state.a = 1;
      draw();
      setStep(2);
      return () => ro.disconnect();
    }

    const tl = gsap.to(state, {
      a: 1,
      duration: 5.2,
      ease: "none",
      paused: true,
      onUpdate: () => {
        draw();
        setStep(state.a < 0.32 ? 0 : state.a < 0.82 ? 1 : 2);
      },
    });
    const st = ScrollTrigger.create({ trigger: wrap.current, start: "top 80%", once: true, onEnter: () => tl.play() });
    return () => {
      st.kill();
      tl.kill();
      ro.disconnect();
    };
  }, []);

  const steps = ["Scan", "AI extraction", "Native model"];
  return (
    <div className={className}>
      <div ref={wrap} className="relative h-full min-h-[220px] w-full">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" role="img" aria-label="Animated diagram: scanned points of a floor plan are extracted into walls and become a native model." />
      </div>
      {showSteps && (
        <ol className="mt-3 flex gap-4 font-mono text-[11.5px]" aria-hidden="true">
          {steps.map((s, i) => (
            <li key={s} className={`flex items-center gap-1.5 transition-colors duration-300 ${i <= step ? "text-[var(--ink)]" : "text-[var(--ink-3)]"}`}>
              <span className={`h-1.5 w-1.5 rounded-full transition-colors ${i === step ? "bg-[var(--accent)]" : i < step ? "bg-[var(--ink)]" : "bg-[var(--ink-3)]"}`} />
              {s}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
