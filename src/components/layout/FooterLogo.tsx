"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

// Cognixlab logo paths (viewBox 0 0 3519 831): the mark's outer shape, its gradient wedge, and the wordmark.
const VIEW_W = 3519;
const VIEW_H = 831;
const MARK = "M565 711.12L261.154 535.695C218.052 510.81 191.5 464.82 191.5 415.05C191.5 365.28 218.052 319.291 261.154 294.406L564.79 119.101L410 29.7335C378.132 11.3344 338.868 11.3344 307 29.7335L51.5 177.247C19.6317 195.646 0 229.649 0 266.447V563.896C0 600.694 19.6317 634.698 51.5 653.097L307 800.61C338.868 819.009 378.132 819.009 410 800.61L565 711.12Z";
const WEDGE = "M612.5 297.5L476.986 375.353C460.602 384.766 450.5 402.22 450.5 421.116C450.5 439.96 460.547 457.373 476.859 466.806L612.5 545.234V650.562L611.75 650.129L335.815 490.817C359.277 476.873 375 451.273 375 422C375 392.61 359.152 366.923 335.535 353.016L611.751 194.566L612.5 194.137V297.5Z";
const WORD = "M961.964 602C843.287 602 747.433 499.625 747.433 373.776C747.433 247.274 843.287 144.9 961.964 144.9C1067.6 144.9 1155.63 227.06 1173.23 334.652H1095.64C1079.99 269.445 1025.87 221.192 961.964 221.192C885.672 221.192 823.073 289.659 823.073 373.776C823.073 457.893 885.672 525.708 961.964 525.708C1025.87 525.708 1079.34 478.107 1095.64 413.552H1172.58C1154.98 520.491 1067.6 602 961.964 602ZM1360.1 253.143C1450.08 253.143 1524.42 331.391 1524.42 427.898C1524.42 523.752 1450.08 602 1360.1 602C1269.46 602 1195.78 523.752 1195.78 427.898C1195.78 331.391 1269.46 253.143 1360.1 253.143ZM1360.1 525.708C1408.35 525.708 1448.13 482.019 1448.13 427.246C1448.13 373.124 1408.35 329.435 1360.1 329.435C1311.19 329.435 1271.42 373.124 1271.42 427.246C1271.42 482.019 1311.19 525.708 1360.1 525.708ZM1798.28 266.184H1873.92V588.307C1873.92 673.728 1813.93 729.153 1721.99 729.153C1718.08 729.153 1714.17 729.153 1710.91 729.153V662.642C1714.82 663.294 1718.73 663.294 1723.29 663.294C1770.24 663.294 1798.28 634.603 1798.28 586.35V581.134C1773.5 596.783 1744.16 606.564 1713.51 606.564C1622.88 606.564 1549.19 528.316 1549.19 431.81C1549.19 335.956 1622.88 257.708 1713.51 257.708C1744.16 257.708 1773.5 267.489 1798.28 283.138V266.184ZM1710.91 533.533C1759.81 533.533 1798.93 487.888 1798.93 431.81C1798.93 375.732 1759.81 330.739 1710.91 330.739C1662.65 330.739 1623.53 375.732 1623.53 431.81C1623.53 487.888 1662.65 533.533 1710.91 533.533ZM2085.58 253.143C2175.57 253.143 2249.9 331.391 2249.9 427.246V602H2173.61V427.246C2173.61 373.124 2133.83 329.435 2085.58 329.435C2036.68 329.435 1996.9 373.124 1996.9 427.246V602.652H1921.26V427.898C1921.26 331.391 1994.94 253.143 2085.58 253.143ZM2335.59 234.233C2311.46 234.233 2291.9 214.019 2291.9 189.892C2291.9 165.766 2311.46 145.552 2335.59 145.552C2359.71 145.552 2379.93 165.766 2379.93 189.892C2379.93 214.019 2359.71 234.233 2335.59 234.233ZM2372.76 602.652H2297.77V253.143H2372.76V602.652ZM2724.98 253.143L2609.57 427.898L2724.98 602H2633.7L2563.92 496.365L2493.5 602H2402.86L2518.28 427.898L2402.86 253.143H2493.5L2563.92 358.778L2633.7 253.143H2724.98ZM2829.33 602.652H2754.34V145.552H2829.33V602.652ZM3036.16 253.143C3089.63 253.143 3133.32 296.832 3133.32 350.301V595.479H3057.03V581.134C3028.99 599.392 3000.95 602 2987.91 602C2920.1 602 2865.97 547.226 2865.97 480.063C2865.97 412.248 2920.1 358.126 2987.91 358.126H3057.03V350.301C3057.03 338.564 3047.9 328.783 3036.16 328.783H2987.91V253.143H3036.16ZM2987.91 525.708C3033.56 525.708 3049.86 472.89 3055.73 433.766H2987.91C2962.48 433.766 2941.61 454.632 2941.61 480.063C2941.61 505.494 2962.48 525.708 2987.91 525.708ZM3341.29 257.708C3431.93 257.708 3505.61 335.956 3505.61 431.81C3505.61 528.316 3431.93 606.564 3341.29 606.564C3311.95 606.564 3284.56 598.088 3260.44 583.742V596.131H3185.45V146.204H3260.44V280.53C3284.56 266.184 3311.95 257.708 3341.29 257.708ZM3429.32 431.81C3429.32 400.511 3416.93 373.124 3397.37 354.866C3396.72 354.214 3396.72 354.214 3396.07 353.562C3394.76 352.258 3392.81 350.953 3391.5 349.649C3389.54 348.345 3387.59 347.041 3385.63 345.737H3384.98C3375.85 339.216 3365.42 335.304 3353.68 334C3353.68 334 3353.68 334 3353.03 334C3351.07 334 3349.12 334 3347.16 334C3346.51 334 3345.86 333.348 3345.2 333.348C3343.9 333.348 3342.6 334 3341.94 334C3341.29 334 3341.29 334 3341.29 334C3340.64 334 3340.64 334 3340.64 334C3334.12 334 3327.6 335.304 3321.73 337.26C3293.04 346.389 3276.74 368.559 3268.26 391.382C3265 399.207 3262.39 407.683 3261.74 416.812C3261.09 417.464 3261.09 418.769 3261.09 419.421C3261.09 420.725 3261.09 422.029 3260.44 423.333C3260.44 425.941 3260.44 428.55 3260.44 431.158V431.81C3260.44 465.066 3274.13 494.409 3295.65 512.014C3306.73 521.796 3319.77 528.316 3336.08 529.62C3336.08 529.62 3336.08 529.62 3336.73 529.62C3338.03 530.272 3339.34 530.272 3341.29 530.272C3341.94 530.272 3342.6 530.272 3343.25 530.272C3343.9 530.272 3344.55 530.272 3345.2 530.272C3346.51 530.272 3348.46 530.272 3349.77 530.272C3350.42 530.272 3350.42 530.272 3350.42 530.272C3394.11 527.012 3429.32 484.628 3429.32 432.462V431.81Z";
const LIME = "#C9F31D";

function svgMarkup(ink: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" width="${VIEW_W}" height="${VIEW_H}"><defs><linearGradient id="g" x1="652" y1="401.5" x2="355.5" y2="411.5" gradientUnits="userSpaceOnUse"><stop stop-color="${LIME}" stop-opacity="0"/><stop offset="1" stop-color="${LIME}"/></linearGradient></defs><path d="${MARK}" fill="${ink}"/><path d="${WEDGE}" fill="url(#g)"/><circle cx="286.5" cy="421.5" r="62.5" fill="${LIME}"/><path d="${WORD}" fill="${ink}"/></svg>`;
}

type Particles = {
  n: number;
  hx: Float32Array; // home position
  hy: Float32Array;
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  bucket: Uint16Array; // index into colours
  colors: string[];
  size: number;
};

/**
 * Footer logo as a field of particles: the cursor pushes them away and they spring back into the logo.
 * They also assemble from a scatter the first time the footer scrolls into view.
 * The plain SVG stays underneath as the no-JS, reduced-motion and canvas-failure fallback, and sets the layout size.
 */
export function FooterLogo() {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const logo = svg.current;
    const cv = canvas.current;
    if (!host || !logo || !cv || prefersReducedMotion()) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let P: Particles | null = null;
    let raf = 0;
    let running = false;
    let visible = false;
    let introDone = false;
    let disposed = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const pointer = { x: -9999, y: -9999, px: -9999, py: -9999, speed: 0, active: false };

    // Rasterise the logo once per size and sample it on a grid; each opaque cell becomes one particle.
    async function build() {
      const hostBox = host!.getBoundingClientRect();
      const logoBox = logo!.getBoundingClientRect();
      if (!logoBox.width) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = hostBox.width;
      height = hostBox.height;
      cv!.width = Math.round(width * dpr);
      cv!.height = Math.round(height * dpr);
      cv!.style.width = `${width}px`;
      cv!.style.height = `${height}px`;

      const ox = logoBox.left - hostBox.left;
      const oy = logoBox.top - hostBox.top;
      const lw = Math.round(logoBox.width);
      const lh = Math.round(logoBox.height);
      const ink = getComputedStyle(host!).color;
      const img = new Image();
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup(ink))}`;
      await img.decode();
      if (disposed) return;

      const off = document.createElement("canvas");
      off.width = lw;
      off.height = lh;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(img, 0, 0, lw, lh);
      const data = octx.getImageData(0, 0, lw, lh).data;

      // Grid step scales with width so phones and wide screens both stay light.
      const step = Math.max(3, Math.round(lw / 320));
      const hx: number[] = [];
      const hy: number[] = [];
      const bucket: number[] = [];
      const colors: string[] = [];
      const colorIndex = new Map<string, number>();
      for (let y = 0; y < lh; y += step) {
        for (let x = 0; x < lw; x += step) {
          const i = (y * lw + x) * 4;
          const a = data[i + 3];
          if (a < 40) continue;
          // Quantise colour so drawing batches into a few fillStyle changes.
          const q = (v: number) => Math.min(255, Math.round(v / 16) * 16);
          const key = `rgba(${q(data[i])},${q(data[i + 1])},${q(data[i + 2])},${(Math.round((a / 255) * 6) / 6).toFixed(2)})`;
          let b = colorIndex.get(key);
          if (b === undefined) {
            b = colors.length;
            colors.push(key);
            colorIndex.set(key, b);
          }
          hx.push(ox + x);
          hy.push(oy + y);
          bucket.push(b);
        }
      }
      const n = hx.length;
      const next: Particles = {
        n,
        hx: Float32Array.from(hx),
        hy: Float32Array.from(hy),
        x: Float32Array.from(hx),
        y: Float32Array.from(hy),
        vx: new Float32Array(n),
        vy: new Float32Array(n),
        bucket: Uint16Array.from(bucket),
        colors,
        size: Math.max(1.6, step * 0.8),
      };
      // Before the intro has played, start from a loose scatter so the logo can assemble.
      if (!introDone) {
        for (let i = 0; i < n; i++) {
          const ang = Math.random() * Math.PI * 2;
          const r = 60 + Math.random() * Math.min(width, 900) * 0.35;
          next.x[i] += Math.cos(ang) * r;
          next.y[i] += Math.sin(ang) * r * 0.6;
        }
      }
      P = next;
      host!.dataset.particles = "on"; // hides the SVG; the canvas takes over
      if (visible) wake();
      else draw();
    }

    function step() {
      if (!P) return 0;
      const { n, x, y, vx, vy, hx, hy } = P;
      const R = Math.max(70, Math.min(150, width * 0.09));
      const R2 = R * R;
      const push = (introDone ? 2.4 : 0) * (0.55 + Math.min(pointer.speed, 40) / 40);
      const spring = introDone ? 0.06 : 0.035;
      let moving = 0;
      for (let i = 0; i < n; i++) {
        if (pointer.active && push) {
          const dx = x[i] - pointer.x;
          const dy = y[i] - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / R) * push;
            // Mostly outward, with a little swirl so the burst doesn't look like a plain dent.
            vx[i] += (dx / d) * f - (dy / d) * f * 0.35;
            vy[i] += (dy / d) * f + (dx / d) * f * 0.35;
          }
        }
        vx[i] = (vx[i] + (hx[i] - x[i]) * spring) * 0.86;
        vy[i] = (vy[i] + (hy[i] - y[i]) * spring) * 0.86;
        x[i] += vx[i];
        y[i] += vy[i];
        const off = Math.abs(hx[i] - x[i]) + Math.abs(hy[i] - y[i]) + Math.abs(vx[i]) + Math.abs(vy[i]);
        if (off > 0.15) moving++;
      }
      return moving;
    }

    function draw() {
      if (!P) return;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);
      const { n, x, y, bucket, colors, size } = P;
      for (let b = 0; b < colors.length; b++) {
        ctx!.fillStyle = colors[b];
        for (let i = 0; i < n; i++) if (bucket[i] === b) ctx!.fillRect(x[i], y[i], size, size);
      }
    }

    function frame() {
      const moving = step();
      draw();
      pointer.speed *= 0.9;
      if (!introDone && moving < (P?.n ?? 0) * 0.01) introDone = true;
      // Sleep once everything is home and the pointer has gone quiet.
      if (visible && (moving > 0 || (pointer.active && pointer.speed > 0.5))) raf = requestAnimationFrame(frame);
      else running = false;
    }

    function wake() {
      if (running || !P || !visible) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }

    const onMove = (e: PointerEvent) => {
      const r = host!.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (pointer.active) pointer.speed = Math.hypot(x - pointer.px, y - pointer.py);
      pointer.px = pointer.x = x;
      pointer.py = pointer.y = y;
      pointer.active = true;
      wake();
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.speed = 0;
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) wake();
      },
      { threshold: 0.15 }
    );
    io.observe(host);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => build().catch(() => undefined), 150);
    });
    ro.observe(host);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        running = false;
      } else wake();
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointercancel", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    build().catch(() => {
      // Rasterising failed: keep the SVG.
      delete host.dataset.particles;
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointercancel", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      delete host.dataset.particles;
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden="true" className="footer-logo container-x relative mt-20 select-none overflow-hidden pb-8 pt-6 text-[var(--ink)] md:pb-10">
      <svg ref={svg} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="footer-logo-svg block h-auto w-full">
        <defs>
          <linearGradient id="footer-logo-grad" x1="652" y1="401.5" x2="355.5" y2="411.5" gradientUnits="userSpaceOnUse">
            <stop stopColor={LIME} stopOpacity="0" />
            <stop offset="1" stopColor={LIME} />
          </linearGradient>
        </defs>
        <path d={MARK} fill="currentColor" />
        <path d={WEDGE} fill="url(#footer-logo-grad)" />
        <circle cx="286.5" cy="421.5" r="62.5" fill={LIME} />
        <path d={WORD} fill="currentColor" />
      </svg>
      <canvas ref={canvas} className="footer-logo-canvas pointer-events-none absolute left-0 top-0" />
    </div>
  );
}
