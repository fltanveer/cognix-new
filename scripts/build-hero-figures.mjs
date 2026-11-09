// Regenerate: node scripts/build-hero-figures.mjs [preview-dir]
// (needs the iso-illustration-studio skill installed at ~/.claude/skills)
//
// Isometric hero figures for every inner page, built with the anatomy kit. One plinth, one camera and one
// projection for the whole set, so every figure is drawn at the same scale and reads as one family with the
// home page's patch bay and inspection bay. Each has exactly one lit idea in the accent and one quiet loop.
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import * as k from "/Users/tanvir/.claude/skills/iso-illustration-studio/styles/anatomy/kit/iso-kit.mjs";
import * as G from "/Users/tanvir/.claude/skills/iso-illustration-studio/styles/anatomy/kit/lathe.mjs";

const OUT_TS = "/Users/tanvir/cognix-new/src/components/hero-figures.ts";
const PREVIEW = process.argv[2];
const W = 560, H = 440;

// ---------- shared plinth and camera ----------
const PL = { x: -112, y: -82, w: 224, d: 164, r: 9 };
const PL_H = 10, FOOT = 4;
const P = k.fitProjection([...k.boxCorners(PL, -PL_H - FOOT, 0), [0, 0, 128], [-70, -60, 120], [70, 60, 110]], W, H, { pad: 10, azimuth: 45 });

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const pathOf = (pts, close = false) => pts.map((p, i) => `${i ? "L" : "M"}${at(p).map((n) => n.toFixed(1)).join(" ")}`).join("") + (close ? "Z" : "");
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], a[2] ?? 0], P) - k.depthOf([b[0], b[1], b[2] ?? 0], P));
const box = (plan, z, h, tone = "mid", bevel = 0.6, steps = 4, extra = {}) => S(k.slabOf(plan, z, h, P, steps, bevel), { tone, ...extra });
const cyl = (x, y, r, z, h, tone = "mid", steps = 24, bevel = 0) => S(k.cylinder(x, y, r, z, h, P, steps, bevel), { tone });
const top = (plan, z, tone = "faint") => L(k.planOutline(k.insetPlan(plan, 3), z, P, 4), { tone });
/** A closed rectangle on a vertical face (x fixed or y fixed). */
const face = (axis, v, [a0, a1], [z0, z1]) =>
  pathOf(axis === "x" ? [[v, a0, z0], [v, a0, z1], [v, a1, z1], [v, a1, z0]] : [[a0, v, z0], [a0, v, z1], [a1, v, z1], [a1, v, z0]], true);
/** A closed plus sign on an x-facing wall: a relief sign, not two loose strokes. */
const plusOn = (x, cy, cz, a = 6, t = 1.6) =>
  pathOf([[x, cy - t, cz + a], [x, cy + t, cz + a], [x, cy + t, cz + t], [x, cy + a, cz + t], [x, cy + a, cz - t], [x, cy + t, cz - t], [x, cy + t, cz - a], [x, cy - t, cz - a], [x, cy - t, cz - t], [x, cy - a, cz - t], [x, cy - a, cz + t], [x, cy - t, cz + t]], true);
const line = (d, tone = "lo", extra = "") => `<path class="iso-line" data-tone="${tone}" d="${d}"${extra}/>`;
const accentLine = (d, cls = "") => `<path class="iso-line hf-accent ${cls}" d="${d}"/>`;
const glowAt = (p, r = 6, cls = "") => {
  const [x, y] = at(p);
  return `<circle class="hf-glow ${cls}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"/>`;
};
const litTop = (solid, cls = "") => `<g class="hf-lit ${cls}">${solid}</g>`;
/** Expanding rings on the floor around a point: a signal, a pin, a ping. */
const rings = (x, y, z, r0 = 8) =>
  [0, 1, 2].map((i) => `<path class="iso-line hf-ring" style="--d:${i * 0.8}s" d="${k.ring(x, y, r0 + i * 0.01, z, P, 40)}"/>`).join("");
/** Screen offset of a world move, for CSS loops that travel along an axis. */
const shift = (dx, dy, dz = 0) => {
  const a = at([0, 0, 0]), b = at([dx, dy, dz]);
  return `--tx:${(b[0] - a[0]).toFixed(1)}px;--ty:${(b[1] - a[1]).toFixed(1)}px`;
};

function plinth() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PL, -PL_H - FOOT, PL_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PL, 18))) {
    out.push(cyl(x, y, 6, -PL_H - FOOT, 1.4, "lo", 24));
    out.push(cyl(x, y, 4.6, -PL_H - FOOT + 1.4, FOOT - 1.4, "mid", 24));
  }
  out.push(box(PL, -PL_H, PL_H, "mid", 1.4, 8));
  out.push(L(k.planOutline(k.insetPlan(PL, 4.5), 0, P), { tone: "lo" }));
  const sc = k.corners(PL, 9);
  out.push(L(sc.map(([x, y]) => k.ring(x, y, 1.9, 0, P, 14)).join(""), { tone: "lo" }));
  out.push(D(sc.map(([x, y]) => at([x, y, 0])), { size: 0.45 }));
  const strip = { x: PL.x + 20, y: PL.y + PL.d - 13, w: PL.w - 40, d: 6, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.5, P, 3), { tone: "lo", crease: "none" }));
  const t = k.topTicks(strip.x + 3, strip.x + strip.w - 3, 5, 5, strip.y + 0.7, 0.5, [1.8, 3.2], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  out.push(D([at([strip.x + 1.6, strip.y + 3, 0.5]), at([strip.x + strip.w - 1.6, strip.y + 3, 0.5])], { size: 0.4 }));
  return out.join("");
}

// ---------- reusable parts ----------
function tripod(x, y, headZ, tone = "mid") {
  const legs = [0, 2.1, 4.2].map((a) => a + 0.5);
  const feet = legs.map((a) => [x + Math.cos(a) * 11, y + Math.sin(a) * 11, 0]);
  return [
    cyl(x, y, 3.8, 0, 1.6, "mid", 18),
    cyl(x, y, 1.2, 1.6, headZ - 1.6, tone, 12),
    line(legs.map((a, i) => pathOf([feet[i], [x + Math.cos(a) * 2.6, y + Math.sin(a) * 2.6, headZ - 8]])).join(""), "mid"),
    D(feet.map(at), { size: 0.8, tone: "mid" }),
    cyl(x, y, 2.6, headZ - 10, 4, "mid", 16),
    cyl(x, y, 2.6, headZ - 2.6, 2.6, "mid", 16),
  ].join("");
}
function car(cx, cy, s = 1) {
  const B = { x: cx - 46 * s, y: cy - 20 * s, w: 92 * s, d: 40 * s, r: 9 * s };
  const C = { x: cx - 22 * s, y: cy - 17 * s, w: 46 * s, d: 34 * s, r: 9 * s };
  const bz = 7 * s, bh = 12 * s, cz = bz + bh, ch = 11 * s, wr = 8 * s;
  const wheel = (x, side) => {
    const F = G.frameAlong([x, side > 0 ? B.y + B.d - 1.5 : B.y + 1.5, wr], [0, side, 0]);
    let o = S(G.disc(0, 5 * s, wr, F, P), { tone: "lo" });
    if (side > 0) o += S(G.disc(5 * s, 5.6 * s, wr * 0.56, F, P), { tone: "mid" });
    return o;
  };
  const out = [[-28, 26].map((dx) => wheel(cx + dx * s, -1)).join("")];
  out.push(`<path class="iso-halo" d="${k.haloOf(B, 2, bz, P)}" style="filter:blur(5px)"/>`);
  out.push(box(B, bz, bh, "mid", 0.8, 8));
  out.push(box(C, cz, ch, "mid", 0.6, 8));
  const g = [cz + 2.5 * s, cz + ch - 2.5 * s];
  out.push(line(face("x", C.x + C.w, [C.y + 5 * s, C.y + C.d - 5 * s], g) + face("y", C.y + C.d, [C.x + 6 * s, C.x + C.w - 6 * s], g), "mid"));
  out.push(line(face("x", B.x + B.w, [cy - 14 * s, cy - 9 * s], [bz + 6 * s, bz + 9 * s]) + face("x", B.x + B.w, [cy + 9 * s, cy + 14 * s], [bz + 6 * s, bz + 9 * s]), "mid"));
  out.push([-28, 26].map((dx) => wheel(cx + dx * s, 1)).join(""));
  return { svg: out.join(""), body: B, cabin: C, top: cz + ch, side: B.y + B.d, front: B.x + B.w, bz };
}
function building(plan, floors, floorH = 14, litFloor = -1, litCol = -1) {
  const h = floors * floorH, out = [`<path class="iso-halo" d="${k.haloOf(plan, 0, h, P)}" style="filter:blur(5px)"/>`];
  out.push(box(plan, 0, h, "mid", 0.8, 4, { inner: L(k.sideSeam(plan, floorH, P, 4), { tone: "faint" }) }));
  for (let f = 1; f < floors; f++) out.push(line(k.sideSeam(plan, f * floorH, P, 4), "faint"));
  const cols = Math.max(2, Math.round(plan.w / 14)), rows = Math.max(2, Math.round(plan.d / 14));
  for (let f = 0; f < floors; f++) {
    const z = [f * floorH + 4, f * floorH + floorH - 4];
    for (let c = 0; c < cols; c++) {
      const x0 = plan.x + 4 + c * ((plan.w - 8) / cols), x1 = x0 + (plan.w - 8) / cols - 4;
      const d = face("y", plan.y + plan.d, [x0, x1], z);
      out.push(f === litFloor && c === litCol ? `<path class="hf-window" d="${d}"/>` : line(d, "lo"));
    }
    for (let r = 0; r < rows; r++) {
      const y0 = plan.y + 4 + r * ((plan.d - 8) / rows), y1 = y0 + (plan.d - 8) / rows - 4;
      out.push(line(face("x", plan.x + plan.w, [y0, y1], z), "lo"));
    }
  }
  out.push(top(plan, h));
  return { svg: out.join(""), h };
}
function pin(x, y, z, h = 34) {
  // a map pin: a ball on a stem, its tip on the floor, with signal rings at the tip
  const out = [rings(x, y, z + 0.2, 7)];
  out.push(`<g class="hf-float">`);
  out.push(cyl(x, y, 0.9, z, h - 8, "hi", 10));
  out.push(`<g class="hf-lit">${S(G.sphereOf([x, y, z + h], 8, P), { tone: "hi", lit: true })}</g>`);
  out.push(glowAt([x, y, z + h], 11));
  out.push(`</g>`);
  return out.join("");
}

// ---------- the figures ----------
const FIG = {};

FIG.services = () => {
  // four stations in order, joined by one lit flow: automate, build, design, grow
  const xs = [-72, -24, 24, 72], o = [];
  const flow = [[-90, 34, 0.4], [90, 34, 0.4]];
  o.push(line(pathOf(flow), "faint"), accentLine(pathOf(flow), "hf-draw"), `<path class="iso-line hf-pulse-line" pathLength="1" d="${pathOf(flow)}"/>`);
  xs.forEach((x, i) => {
    const plan = { x: x - 17, y: -26, w: 34, d: 34, r: 3 };
    o.push(`<path class="iso-halo" d="${k.haloOf(plan, 0, 16, P)}" style="filter:blur(4px)"/>`, box(plan, 0, 16 + i * 8, "mid", 0.6, 4));
    const z = 16 + i * 8;
    o.push(top(plan, z));
    if (i === 0) for (let j = 0; j < 3; j++) o.push(box({ x: x - 11 + j * 2, y: -20 + j * 6, w: 20, d: 4, r: 1 }, z, 1.2, "hi", 0.2, 2)); // cards to automate
    if (i === 1) o.push(line([0, 1, 2, 3].map((j) => k.lineOnTop([x - 10, -18 + j * 5], [x + (j % 2 ? 2 : 8), -18 + j * 5], z, P)).join(""), "mid", ' data-free=""')); // code lines
    if (i === 2) o.push(box({ x: x - 10, y: -19, w: 20, d: 20, r: 2 }, z, 1.4, "hi", 0.3, 3), line(k.planOutline({ x: x - 7, y: -16, w: 14, d: 6, r: 1 }, z + 1.4, P, 2), "lo")); // a frame to design
    if (i === 3) o.push(cyl(x, -9, 1.2, z, 18, "mid", 10), S(G.sphereOf([x, -9, z + 20], 3.4, P), { tone: "hi" })); // a beacon to be found
    o.push(cyl(x, 34, 2.6, 0, 1, "mid", 16), litTop(cyl(x, 34, 1.6, 1, 0.6, "mid", 14), "hf-seq"), line(pathOf([[x, 8, 0.4], [x, 32, 0.4]]), "lo"));
  });
  return o.join("");
};

FIG["service-ai-automation"] = () => {
  // a sorter: documents ride a conveyor into a gate; the checked one is routed to the lit tray
  const o = [];
  const belt = { x: -96, y: -14, w: 150, d: 28, r: 3 };
  for (const x of [-84, -40, 4, 44]) o.push(box({ x: x - 3, y: belt.y + 4, w: 6, d: 20, r: 1 }, 0, 12, "mid", 0.3, 2));
  o.push(box(belt, 12, 5, "mid", 0.6, 4));
  for (const x of [-92, 50]) {
    const F = G.frameAlong([x, belt.y, 14.5], [0, 1, 0]);
    o.push(S(G.disc(-1, belt.d + 1, 3.2, F, P), { tone: "lo" }));
  }
  for (let x = belt.x + 8; x < belt.x + belt.w - 4; x += 10) o.push(line(k.lineOnTop([x, belt.y], [x, belt.y + belt.d], 17, P), "faint"));
  // documents on the belt: the middle one is the one being routed
  for (const [x, cls] of [[-80, ""], [-22, "hf-travel"]]) {
    const doc = box({ x: x - 9, y: -9, w: 18, d: 18, r: 1 }, 17, 1.4, cls ? "hi" : "mid", 0.2, 2);
    o.push(cls ? `<g class="${cls}" style="${shift(60, 0)}">${doc}<path class="iso-line hf-accent" d="${k.planOutline({ x: x - 9, y: -9, w: 18, d: 18, r: 1 }, 18.4, P, 2)}"/></g>` : doc);
  }
  // the gate arch over the belt with a scanner bar
  o.push(box({ x: 8, y: -22, w: 6, d: 6, r: 1 }, 0, 44, "mid", 0.4, 2), box({ x: 8, y: 16, w: 6, d: 6, r: 1 }, 0, 44, "mid", 0.4, 2));
  o.push(box({ x: 6, y: -24, w: 10, d: 48, r: 2 }, 44, 7, "mid", 0.5, 3));
  o.push(accentLine(pathOf([[11, -12, 43.4], [11, 12, 43.4]]), "hf-pulse"), D([at([11, -12, 43.4]), at([11, 12, 43.4])], { size: 0.7, tone: "mid" }));
  // two out-trays: rejected (plain) and routed (lit)
  const tA = { x: 62, y: -40, w: 34, d: 28, r: 2 }, tB = { x: 62, y: 12, w: 34, d: 28, r: 2 };
  o.push(box(tA, 0, 6, "mid", 0.5, 3), top(tA, 6), box(tB, 0, 6, "mid", 0.5, 3), top(tB, 6));
  for (let i = 0; i < 3; i++) o.push(box({ x: tB.x + 6, y: tB.y + 5, w: 22, d: 18, r: 1 }, 6 + i * 1.1, 1.1, "hi", 0.2, 2));
  o.push(litTop(cyl(tB.x + tB.w - 4, tB.y + 4, 1.8, 6, 0.8, "mid", 14)), glowAt([tB.x + tB.w - 4, tB.y + 4, 6.8], 5, "hf-pulse"));
  return o.join("");
};

FIG["service-custom-software"] = () => {
  // a rack of blades cabled to a terminal; one blade is out on its rails, lit
  const o = [], R = { x: -78, y: -50, w: 56, d: 70, r: 3 };
  o.push(`<path class="iso-halo" d="${k.haloOf(R, 0, 80, P)}" style="filter:blur(5px)"/>`, box(R, 0, 80, "mid", 0.8, 4));
  for (let i = 0; i < 6; i++) {
    const z = 8 + i * 11, fx = R.x + R.w;
    if (i === 3) continue;
    o.push(line(face("x", fx, [R.y + 5, R.y + R.d - 5], [z, z + 8]), "lo"));
    o.push(D([0, 1, 2].map((j) => at([fx, R.y + 10 + j * 4, z + 4])), { size: 0.7, tone: "mid" }));
  }
  // the pulled blade
  const blade = { x: R.x + R.w - 4, y: R.y + 6, w: 30, d: R.d - 12, r: 1.4 };
  o.push(line(face("x", R.x + R.w, [R.y + 5, R.y + R.d - 5], [41, 49]), "mid"));
  o.push(box(blade, 41, 8, "mid", 0.5, 3));
  for (let j = 0; j < 4; j++) o.push(box({ x: blade.x + 6 + j * 5.6, y: blade.y + 8, w: 3.2, d: blade.d - 16, r: 0.6 }, 49, 2.4, "hi", 0.2, 2));
  o.push(litTop(cyl(blade.x + blade.w - 4, blade.y + 4, 1.6, 49, 0.6, "mid", 14), "hf-blink"), glowAt([blade.x + blade.w - 4, blade.y + 4, 49.6], 5, "hf-blink"));
  // terminal on the right with code lines, and the cable from rack to terminal
  const T = { x: 34, y: -6, w: 52, d: 40, r: 3 };
  o.push(box(T, 0, 10, "mid", 0.6, 4), box({ x: T.x + 4, y: T.y + 4, w: 6, d: T.d - 8, r: 1 }, 10, 34, "mid", 0.5, 2));
  const scr = { x: T.x + 10, y: T.y + 4, w: 2, d: T.d - 8 };
  o.push(box({ ...scr, r: 0.6 }, 14, 28, "lo", 0.2, 2));
  for (let j = 0; j < 5; j++) o.push(line(pathOf([[scr.x + 2, scr.y + 4, 37 - j * 4.4], [scr.x + 2, scr.y + 4 + (j % 3 === 1 ? 12 : 24), 37 - j * 4.4]]), j === 1 ? "hi" : "mid", ' data-free=""'));
  o.push(accentLine(pathOf([[scr.x + 2, scr.y + 4, 37 - 5 * 4.4], [scr.x + 2, scr.y + 7, 37 - 5 * 4.4]]), "hf-blink"));
  const cab = [[R.x + R.w, R.y + R.d - 6, 6], [R.x + R.w + 18, R.y + R.d - 6, 1], [T.x - 6, T.y + 20, 1], [T.x, T.y + 20, 4]];
  o.push(`<path class="iso-line rw-cab-o" d="${pathOf(cab)}"/><path class="iso-line rw-cab-i" d="${pathOf(cab)}"/>`);
  return o.join("");
};

FIG["service-product-ux"] = () => {
  // a tablet on a stand showing a wireframe; the primary button is lit and tapped
  const o = [], base = { x: -40, y: -10, w: 70, d: 36, r: 4 };
  o.push(box(base, 0, 5, "mid", 0.6, 4), box({ x: -12, y: 0, w: 14, d: 10, r: 2 }, 5, 26, "mid", 0.5, 3));
  // tablet leaning back: a slab on the y face, drawn as a thin box
  const tab = { x: -58, y: 8, w: 106, d: 4, r: 3 };
  o.push(`<g class="hf-float">`);
  o.push(box(tab, 26, 76, "mid", 0.6, 4));
  const fy = tab.y + tab.d, sx = [tab.x + 6, tab.x + tab.w - 6], sz = [30, 98];
  o.push(`<path class="hf-screen" d="${face("y", fy, sx, sz)}"/>`);
  o.push(line(face("y", fy, [sx[0] + 6, sx[1] - 6], [86, 94]), "mid"));
  o.push(line(face("y", fy, [sx[0] + 6, sx[0] + 44], [52, 80]) + face("y", fy, [sx[0] + 50, sx[1] - 6], [70, 80]) + face("y", fy, [sx[0] + 50, sx[1] - 6], [52, 64]), "lo"));
  o.push(`<path class="hf-button" d="${face("y", fy, [sx[1] - 38, sx[1] - 6], [38, 46])}"/>`);
  const tapAt = [sx[1] - 22, fy, 42];
  o.push(`<g class="hf-tap">${[0, 1].map((i) => `<path class="iso-line hf-ring" style="--d:${i * 0.9}s" d="${k.sideRing(tapAt, 6, "y", P)}"/>`).join("")}</g>`);
  o.push(`</g>`);
  // pencil and ruler beside it
  o.push(box({ x: 40, y: -40, w: 56, d: 8, r: 1 }, 0, 1.4, "hi", 0.2, 2));
  const tk = k.topTicks(42, 94, 4, 5, -40.5, 1.4, [2, 3.4], P);
  o.push(L(tk.minor, { tone: "lo" }), L(tk.major, { tone: "mid" }));
  const F = G.frameAlong([46, -20, 2.2], [1, 0.25, 0]);
  o.push(S(G.disc(0, 44, 2.2, F, P), { tone: "mid" }));
  return o.join("");
};

FIG["service-seo-growth"] = () => {
  // city blocks; one pin stands over the right shop, signalling
  const o = [];
  const blocks = [[-90, -60, 30, 26, 3], [-52, -60, 26, 26, 5], [-90, -24, 26, 30, 2], [26, -66, 30, 30, 4], [62, -66, 26, 30, 2], [26, 22, 30, 28, 2], [62, 22, 30, 28, 3], [-90, 22, 30, 28, 4], [-52, 22, 26, 28, 2]];
  // streets: a cross of road lines
  o.push(line(pathOf([[PL.x + 4.5, 8, 0], [PL.x + PL.w - 4.5, 8, 0]]) + pathOf([[8, PL.y + 4.5, 0], [8, PL.y + PL.d - 4.5, 0]]), "faint"));
  for (const [x, y, w, d, f] of byDepth(blocks.map(([x, y, w, d, f]) => [x, y, 0, w, d, f])).map(([x, y, , w, d, f]) => [x, y, w, d, f])) {
    o.push(building({ x, y, w, d, r: 2 }, f, 9).svg);
  }
  o.push(pin(-34, -10, 0, 40));
  return o.join("");
};

FIG["case-studies"] = () => {
  // a drawer cabinet; the top drawer is out, one folder tab lit
  const o = [], C = { x: -54, y: -50, w: 70, d: 80, r: 3 };
  o.push(`<path class="iso-halo" d="${k.haloOf(C, 0, 78, P)}" style="filter:blur(5px)"/>`, box(C, 0, 78, "mid", 0.8, 4));
  const fy = C.y + C.d;
  for (let i = 0; i < 3; i++) {
    const z = 4 + i * 24;
    if (i === 2) continue;
    o.push(line(face("y", fy, [C.x + 5, C.x + C.w - 5], [z, z + 20]), "lo"), box({ x: C.x + C.w / 2 - 9, y: fy, w: 18, d: 2.4, r: 1 }, z + 12, 2.4, "mid", 0.2, 2));
  }
  const dr = { x: C.x + 4, y: fy - 4, w: C.w - 8, d: 40, r: 1.6 };
  o.push(line(face("y", fy, [C.x + 5, C.x + C.w - 5], [52, 72]), "mid"));
  o.push(box(dr, 52, 18, "mid", 0.5, 3));
  for (let i = 0; i < 6; i++) {
    const f = { x: dr.x + 4, y: dr.y + 6 + i * 5.4, w: dr.w - 8, d: 1.4, r: 0.4 };
    o.push(box(f, 54, i === 3 ? 21 : 17 + (i % 2) * 2, "hi", 0.1, 2));
    if (i === 3) o.push(litTop(box({ x: f.x + 30, y: f.y, w: 12, d: 1.4, r: 0.4 }, 75, 4, "mid", 0.1, 2)), glowAt([f.x + 36, f.y, 78], 6, "hf-pulse"));
  }
  o.push(box({ x: dr.x + dr.w / 2 - 9, y: dr.y + dr.d, w: 18, d: 2.4, r: 1 }, 62, 2.4, "mid", 0.2, 2));
  // loose folder and a printed sheet on the plinth
  o.push(box({ x: 34, y: -10, w: 40, d: 30, r: 1 }, 0, 1.4, "hi", 0.2, 2), box({ x: 40, y: -6, w: 34, d: 26, r: 1 }, 1.4, 1, "hi", 0.2, 2));
  o.push([0, 1, 2].map((j) => line(k.lineOnTop([46, 0 + j * 5], [46 + (j === 2 ? 12 : 22), 0 + j * 5], 2.4, P), "lo", ' data-free=""')).join(""));
  return o.join("");
};

FIG.industries = () => {
  // three plinths: inspection (car), construction (frame), a practice (clinic); one light each, in turn
  const o = [];
  const pads = [{ x: -94, y: -56, w: 64, d: 64 }, { x: -24, y: -56, w: 64, d: 64 }, { x: 46, y: -56, w: 56, d: 64 }];
  pads.forEach((p) => o.push(box({ ...p, r: 4 }, 0, 4, "mid", 0.5, 4), top({ ...p, r: 4 }, 4)));
  o.push(car(-62, -24, 0.56).svg.replace(/<path class="iso-halo"[^>]*\/>/, ""));
  // a building frame: columns and slabs
  for (let f = 0; f < 3; f++) o.push(box({ x: -14, y: -46, w: 44, d: 44, r: 1 }, 4 + f * 18, 2.4, "mid", 0.3, 2));
  for (const [x, y] of byDepth([[-12, -44], [26, -44], [-12, -6], [26, -6]].map(([x, y]) => [x, y, 0])).map((p) => [p[0], p[1]])) o.push(box({ x, y, w: 3, d: 3, r: 0.6 }, 6.4, 34, "mid", 0.2, 2));
  // a clinic with a cross on its face
  const cl = { x: 56, y: -46, w: 36, d: 40, r: 2 };
  o.push(box(cl, 4, 30, "mid", 0.6, 4), top(cl, 34));
  const fx = cl.x + cl.w;
  o.push(line(plusOn(fx, cl.y + 20, 20, 6, 1.8), "hi"));
  pads.forEach((p, i) => {
    const lp = [p.x + p.w - 6, p.y + p.d - 6, 4];
    o.push(litTop(cyl(lp[0], lp[1], 2, 4, 0.8, "mid", 14), `hf-seq hf-seq-${i}`), glowAt([lp[0], lp[1], 4.8], 5, `hf-seq hf-seq-${i}`));
  });
  return o.join("");
};

FIG["industry-insurance-inspections"] = () => {
  const o = [], c = car(-28, -14, 1.32);
  o.push(c.svg);
  // a phone on a tripod at the front, its sight line to the damaged bumper lit
  o.push(tripod(84, 26, 46));
  const ph = { x: 82.6, y: 16, w: 3, d: 20, r: 0.8 };
  o.push(box(ph, 46, 34, "mid", 0.3, 2));
  o.push(`<path class="hf-screen hf-pulse-fill" d="${face("x", ph.x + ph.w, [ph.y + 2, ph.y + ph.d - 2], [49, 76])}"/>`);
  const hit = [c.front, -2, c.bz + 9];
  o.push(accentLine(pathOf([[82.6, 26, 70], hit]), "hf-pulse"), D([at([82.6, 26, 70]), at(hit)], { size: 0.9, tone: "hi" }));
  o.push(`<path class="iso-line hf-accent" d="${k.sideRing(hit, 5, "x", P)}"/>`);
  return o.join("");
};

FIG["industry-architecture-construction"] = () => {
  // scan to model: a point cloud on the left resolves into a framed building on the right; a scanner sweeps it
  const o = [], dots = [];
  let s = 7;
  const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const X0 = -88, X1 = -26, Y0 = -50, Y1 = 14, ZT = 54;
  for (let i = 0; i < 900; i++) {
    const w = r(), u = r(), v = r();
    if (w < 0.24) dots.push([X0 + u * (X1 - X0), Y0, v * ZT]);
    else if (w < 0.48) dots.push([X0, Y0 + u * (Y1 - Y0), v * ZT]);
    else if (w < 0.62) dots.push([X0 + u * (X1 - X0), Y1, v * ZT * 0.35]);
    else if (w < 0.82) dots.push([X0 + u * (X1 - X0), Y0 + v * (Y1 - Y0), 0.4]);
    else dots.push([X0 + u * (X1 - X0), Y0 + v * (Y1 - Y0), (r() < 0.5 ? 18 : 36) + 1]);
  }
  o.push(D(byDepth(dots).map(at), { size: 0.5, tone: "mid" }));
  // the modelled half: slabs and columns
  for (let f = 0; f < 3; f++) o.push(box({ x: -20, y: -50, w: 60, d: 64, r: 1 }, f * 18, 2.6, "mid", 0.3, 2));
  for (const [x, y] of byDepth([[-18, -48], [36, -48], [-18, 10], [36, 10], [9, -48], [9, 10]].map(([x, y]) => [x, y, 0])).map((p) => [p[0], p[1]])) o.push(box({ x, y, w: 3.2, d: 3.2, r: 0.6 }, 2.6, 36, "mid", 0.2, 2));
  o.push(box({ x: -20, y: -50, w: 60, d: 64, r: 1 }, 54, 2.6, "mid", 0.3, 2));
  // the scanner on its tripod, its fan lit
  o.push(tripod(64, 40, 34), cyl(64, 40, 4, 34, 7, "mid", 20), litTop(cyl(64, 40, 2.4, 41, 1.4, "hi", 16)));
  const hits = [[-26, -50, 44], [-26, 14, 6], [-88, 14, 30]];
  o.push(`<g class="hf-pulse">${hits.map((t) => accentLine(pathOf([[64, 40, 39], t]))).join("")}${D(hits.map(at), { size: 1, tone: "hi" })}</g>`);
  return o.join("");
};

FIG["industry-healthcare-practices"] = () => {
  // a practice on a street corner, a map pin over it
  const o = [], b = building({ x: -72, y: -56, w: 92, d: 72, r: 3 }, 2, 20, 0, 2);
  o.push(line(pathOf([[PL.x + 0.6, 30, 0], [PL.x + PL.w - 0.6, 30, 0]]), "faint"));
  o.push(b.svg);
  const fx = 20;
  o.push(box({ x: fx, y: -38, w: 3, d: 36, r: 1 }, 28, 10, "mid", 0.2, 2));
  o.push(line(plusOn(fx + 3, -20, 33, 3.4, 1.1), "hi"));
  o.push(box({ x: 40, y: -30, w: 30, d: 24, r: 2 }, 0, 12, "mid", 0.5, 3), box({ x: 74, y: 0, w: 22, d: 20, r: 2 }, 0, 18, "mid", 0.5, 3));
  o.push(pin(-26, -20, 40, 34));
  return o.join("");
};

FIG.pricing = () => {
  // four steps up; you start on the second (the assessment), the block on it is lit
  const o = [], steps = [0, 1, 2, 3];
  for (const i of steps) {
    const p = { x: -90 + i * 46, y: -40, w: 44, d: 64, r: 2 };
    o.push(`<path class="iso-halo" d="${k.haloOf(p, 0, 10 + i * 16, P)}" style="filter:blur(4px)"/>`, box(p, 0, 10 + i * 16, "mid", 0.6, 4), top(p, 10 + i * 16));
    o.push(line(face("y", p.y + p.d, [p.x + 6, p.x + 20], [4, 8]), "lo"));
  }
  const z = 26, cx = -44 + 22;
  o.push(`<g class="hf-float">${litTop(box({ x: cx - 9, y: -17, w: 18, d: 18, r: 2 }, z, 16, "mid", 0.5, 3))}${glowAt([cx, -8, z + 16], 9, "hf-pulse")}</g>`);
  o.push(line(pathOf([[-90 + 22, -8, 10.4], [cx - 9, -8, 26.4]]), "lo", ' data-dashed=""'), D([at([-90 + 22, -8, 10.4]), at([cx - 9, -8, 26.4])], { size: 0.9, tone: "mid" }));
  return o.join("");
};

FIG.about = () => {
  // the studio: a low building with a workshop door; one window lit, someone's in
  const o = [], b = building({ x: -70, y: -60, w: 110, d: 76, r: 3 }, 3, 16, 1, 4);
  o.push(b.svg);
  o.push(box({ x: 40, y: -26, w: 2.4, d: 26, r: 0.8 }, 0, 22, "lo", 0.2, 2));
  o.push(box({ x: 52, y: 26, w: 30, d: 22, r: 2 }, 0, 6, "mid", 0.5, 3), cyl(78, -30, 9, 0, 3, "mid", 32), cyl(78, -30, 1.4, 3, 24, "mid", 10), S(G.sphereOf([78, -30, 34], 10, P), { tone: "mid" }));
  o.push(`<g class="hf-pulse">${glowAt([-70 + 4 + 4 * ((110 - 8) / 8) + 4, 16, 24], 10)}</g>`);
  return o.join("");
};

FIG.insights = () => {
  // an open notebook on a stand and a stack of journals; a lit bookmark
  const o = [];
  for (let i = 0; i < 4; i++) o.push(box({ x: -86 + (i % 2) * 2, y: -50 + i * 1.5, w: 50, d: 36, r: 1.6 }, i * 6, 6, i % 2 ? "mid" : "hi", 0.4, 3));
  const L1 = { x: -20, y: -24, w: 48, d: 60, r: 1.4 }, R1 = { x: 30, y: -24, w: 48, d: 60, r: 1.4 };
  o.push(box({ x: -24, y: -28, w: 106, d: 68, r: 2 }, 0, 5, "mid", 0.5, 3));
  o.push(box(L1, 5, 3, "hi", 0.3, 3), box(R1, 5, 3, "hi", 0.3, 3));
  for (let j = 0; j < 7; j++) o.push(line(k.lineOnTop([L1.x + 6, L1.y + 8 + j * 6.4], [L1.x + (j === 6 ? 24 : 40), L1.y + 8 + j * 6.4], 8, P), "lo", ' data-free=""'));
  for (let j = 0; j < 4; j++) o.push(line(k.lineOnTop([R1.x + 6, R1.y + 8 + j * 6.4], [R1.x + (j === 3 ? 20 : 40), R1.y + 8 + j * 6.4], 8, P), "lo", ' data-free=""'));
  o.push(box({ x: R1.x + 6, y: R1.y + 36, w: 34, d: 16, r: 1 }, 8, 0.6, "lo", 0.1, 2));
  o.push(`<g class="hf-lit">${box({ x: R1.x + 30, y: R1.y + R1.d - 2, w: 5, d: 18, r: 0.4 }, 4, 1, "mid", 0.1, 2)}</g>`, glowAt([R1.x + 32, R1.y + R1.d + 14, 4], 6, "hf-pulse"));
  return o.join("");
};

FIG.contact = () => {
  // a desk calendar: one day booked and lit, a phone face-up beside it
  const o = [], base = { x: -70, y: -30, w: 96, d: 34, r: 3 };
  o.push(box(base, 0, 8, "mid", 0.6, 4));
  const pg = { x: -66, y: -6, w: 88, d: 4, r: 1.6 };
  o.push(box(pg, 8, 78, "hi", 0.4, 3));
  const fy = pg.y + pg.d, xs = [-60, 18];
  o.push(line(face("y", fy, xs, [72, 82]), "mid"));
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
    const x0 = -60 + c * 13, z0 = 56 - r * 13;
    const d = face("y", fy, [x0 + 1, x0 + 11], [z0, z0 + 10]);
    o.push(r === 1 && c === 3 ? `<path class="hf-button hf-pulse-fill" d="${d}"/>` : line(d, "lo"));
  }
  for (const x of [-50, 8]) o.push(cyl(x, -4, 2, 84, 6, "mid", 14));
  const ph = { x: 44, y: -40, w: 22, d: 42, r: 3 };
  o.push(box(ph, 0, 3, "mid", 0.4, 3), box({ x: ph.x + 2, y: ph.y + 2, w: ph.w - 4, d: ph.d - 4, r: 2 }, 3, 0.4, "lo", 0.1, 3));
  o.push(litTop(box({ x: ph.x + 4, y: ph.y + 6, w: ph.w - 8, d: 7, r: 1 }, 3.4, 0.6, "mid", 0.1, 2)), glowAt([ph.x + 11, ph.y + 9, 4], 6, "hf-pulse"));
  return o.join("");
};

FIG.legal = () => {
  // documents under a padlock: the lock is the one lit idea
  const o = [];
  for (let i = 0; i < 4; i++) o.push(box({ x: -80 + i * 1.6, y: -40 - i * 1.2, w: 70, d: 90, r: 1.2 }, i * 1.2, 1.2, "hi", 0.2, 2));
  for (let j = 0; j < 8; j++) o.push(line(k.lineOnTop([-70, -30 + j * 8], [-70 + (j % 3 === 2 ? 30 : 52), -30 + j * 8], 4.8, P), "lo", ' data-free=""'));
  const Bd = { x: 20, y: -18, w: 44, d: 26, r: 4 };
  o.push(`<path class="iso-halo" d="${k.haloOf(Bd, 0, 40, P)}" style="filter:blur(5px)"/>`);
  o.push(box(Bd, 0, 40, "mid", 0.8, 6));
  // shackle: a U of round bar standing on the body's top face, drawn after it
  const F = G.frameOf([42, -5, 40], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  const arc = Array.from({ length: 25 }, (_, i) => G.pointOf(F, 0, 14, Math.PI - (i / 24) * Math.PI));
  o.push(`<path class="iso-line rw-cab-o" d="${pathOf([[28, -5, 40], ...arc, [56, -5, 40]])}" style="stroke-width:7px;stroke:var(--anatomy-mid)"/><path class="iso-line" d="${pathOf([[28, -5, 40], ...arc, [56, -5, 40]])}" style="stroke-width:4.4px;stroke:var(--anatomy-lit-top)"/>`);

  const fy = Bd.y + Bd.d;
  o.push(litTop(cyl(42, fy + 0.1, 3.4, 16, 0.1, "mid", 20)));
  o.push(`<path class="hf-button hf-pulse-fill" d="${face("y", fy + 0.2, [40.6, 43.4], [12, 20])}"/>`, `<path class="iso-line hf-accent" d="${k.sideRing([42, fy + 0.3, 22], 3.6, "y", P)}"/>`);
  return o.join("");
};

// ---------- build ----------
const out = {};
for (const [key, fn] of Object.entries(FIG)) {
  out[key] = k.figureSvg({ width: W, height: H, label: "", body: [plinth(), fn()] });
}
writeFileSync(
  OUT_TS,
  `// Generated by the anatomy iso kit (iso-illustration-studio, MIT). Do not edit by hand: rebuild with scripts/build-hero-figures.mjs.\n// One isometric hero figure per inner page, same plinth, camera and scale.\nexport const HERO_FIGURES: Record<string, string> = ${JSON.stringify(out)};\nexport type HeroFigure = keyof typeof HERO_FIGURES;\n`,
);
console.log("wrote", OUT_TS, Object.keys(out).length, "figures", (JSON.stringify(out).length / 1024).toFixed(0) + " kB");

if (PREVIEW) {
  mkdirSync(PREVIEW, { recursive: true });
  const css = ["rewire-iso.css", "hero-figures.css"].map((f) => readFileSync(`/Users/tanvir/cognix-new/src/components/${f === "rewire-iso.css" ? "home/" : ""}${f}`, "utf8")).join("\n");
  const cells = Object.entries(out).map(([key, svg]) => `<div style="width:420px"><div style="font:12px monospace;color:#8a917d">${key}</div><div class="rw-iso hf">${svg}</div></div>`).join("");
  writeFileSync(`${PREVIEW}/heroes.html`, `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#10120d;padding:24px;display:flex;flex-wrap:wrap;gap:12px}${css}</style></head><body>${cells}</body></html>`);
  console.log("wrote", `${PREVIEW}/heroes.html`);
}
