// Regenerate: node scripts/build-method-icons.mjs [preview.html]
// (needs the iso-illustration-studio skill installed at ~/.claude/skills)
//
// Four small isometric icons for the method phases (Assess, Architect, Implement, Optimize), built with the
// anatomy kit on one shared tile and camera so they read as a set with the hero figures. Each has one idea in
// the accent: a lens over a process map, a wireframe drawing itself on a blueprint, a block lowering into its
// slot, a trend line over rising bars. Classes are styled by method-icons.css; the accent only lights while
// its phase is in focus.
import { writeFileSync, readFileSync } from "node:fs";
import * as k from "/Users/tanvir/.claude/skills/iso-illustration-studio/styles/anatomy/kit/iso-kit.mjs";

const OUT_TS = "/Users/tanvir/cognix-new/src/components/home/method-icons.ts";
const PREVIEW = process.argv[2];
const W = 240, H = 210;

const T = { x: -52, y: -52, w: 104, d: 104, r: 12 };
const T_H = 6;
const P = k.fitProjection([...k.boxCorners(T, -T_H, 0), [2, -2, 50], [-28, -24, 30], [28, 26, 46]], W, H, { pad: 6, azimuth: 45 });

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const pathOf = (pts, close = false) => pts.map((p, i) => `${i ? "L" : "M"}${at(p).map((n) => n.toFixed(1)).join(" ")}`).join("") + (close ? "Z" : "");
const box = (plan, z, h, tone = "mid", bevel = 0.5, steps = 4) => S(k.slabOf(plan, z, h, P, steps, bevel), { tone });
const line = (d, tone = "lo", extra = "") => `<path class="iso-line" data-tone="${tone}" d="${d}"${extra}/>`;
const accent = (d, cls = "", extra = "") => `<path class="iso-line mi-accent ${cls}" d="${d}"${extra}/>`;
const glow = (p, r = 6) => {
  const [x, y] = at(p);
  return `<circle class="mi-glow" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"/>`;
};
const lit = (solid) => `<g class="mi-lit">${solid}</g>`;
/** Screen offset of a world move, for CSS loops that travel along an axis. */
const shift = (dx, dy, dz = 0) => {
  const a = at([0, 0, 0]), b = at([dx, dy, dz]);
  return `--tx:${(b[0] - a[0]).toFixed(1)}px;--ty:${(b[1] - a[1]).toFixed(1)}px`;
};

function tile() {
  const out = [`<path class="iso-halo" d="${k.haloOf(T, -T_H, T_H, P)}"/>`];
  out.push(box(T, -T_H, T_H, "mid", 1, 8));
  out.push(L(k.planOutline(k.insetPlan(T, 4), 0, P, 8), { tone: "lo" }));
  const sc = k.corners(T, 8);
  out.push(L(sc.map(([x, y]) => k.ring(x, y, 1.6, 0, P, 12)).join(""), { tone: "lo" }));
  out.push(D(sc.map(([x, y]) => at([x, y, 0])), { size: 0.4 }));
  return out.join("");
}

// ---------- 1. Assess: a lens hovering over a three-step process map ----------
function assess() {
  const nodes = [[-28, -24], [2, -2], [28, 26]];
  const out = [tile()];
  // links on the tile top between the nodes (drawn first, nodes cover their ends)
  out.push(line(k.lineOnTop(nodes[0], nodes[1], 0, P) + k.lineOnTop(nodes[1], nodes[2], 0, P), "mid"));
  nodes.forEach(([x, y], i) => {
    const plan = { x: x - 9, y: y - 9, w: 18, d: 18, r: 3 };
    out.push(i === 1 ? lit(box(plan, 0, 8)) : box(plan, 0, 8));
  });
  // the lens: a ring held above the middle node, a handle, and its glow. It bobs.
  const [cx, cy] = nodes[1], z = 34, r = 13;
  const hEnd = [cx + 22, cy + 22, z - 12];
  const handle = pathOf([[cx + r * 0.72, cy + r * 0.72, z], hEnd]);
  out.push(
    `<g class="mi-bob">${glow([cx, cy, z], 10)}${accent(k.ring(cx, cy, r, z, P, 48))}${accent(k.ring(cx, cy, r - 2.4, z, P, 44), "mi-thin")}` +
      `<path class="iso-line" data-tone="mid" data-free="" d="${handle}"/>${D([at(hEnd)], { size: 1.2, tone: "mid" })}` +
      `<path class="iso-line mi-drop" data-free="" d="${pathOf([[cx, cy, 8.4], [cx, cy, z - 0.5]])}"/></g>`
  );
  return out.join("");
}

// ---------- 2. Architect: a blueprint sheet with a wireframe being drawn on it ----------
function architect() {
  const out = [tile()];
  const sheet = { x: -40, y: -40, w: 80, d: 80, r: 2 };
  out.push(box(sheet, 0, 0.8, "lo", 0, 3));
  // drafting grid on the sheet
  const g = [];
  for (let i = 1; i < 5; i++) {
    const v = sheet.x + (i * sheet.w) / 5;
    g.push(k.lineOnTop([v, sheet.y + 2], [v, sheet.y + sheet.d - 2], 0.8, P));
    const u = sheet.y + (i * sheet.d) / 5;
    g.push(k.lineOnTop([sheet.x + 2, u], [sheet.x + sheet.w - 2, u], 0.8, P));
  }
  out.push(line(g.join(""), "faint", ' data-free=""'));
  // a solid finished block on the sheet, and the planned wireframe next to it (the idea)
  out.push(box({ x: -32, y: 8, w: 22, d: 22, r: 2 }, 0.8, 18));
  const B = { x: -2, y: -30, w: 32, d: 38 }, z0 = 0.8, z1 = 30;
  const c = [[B.x, B.y], [B.x + B.w, B.y], [B.x + B.w, B.y + B.d], [B.x, B.y + B.d]];
  const ring = (z) => pathOf(c.map(([x, y]) => [x, y, z]), true);
  const posts = c.map(([x, y]) => pathOf([[x, y, z0], [x, y, z1]])).join("");
  out.push(`<g class="mi-draw">${accent(ring(z0), "", ' pathLength="1"')}${accent(posts, "", ' pathLength="1"')}${accent(ring(z1), "", ' pathLength="1"')}</g>`);
  out.push(D(c.map(([x, y]) => at([x, y, z1])), { size: 0.9, tone: "mid" }));
  out.push(glow([B.x + B.w / 2, B.y + B.d / 2, z1], 9));
  return out.join("");
}

// ---------- 3. Implement: built blocks, and the last one lowering into its slot ----------
function implement() {
  const out = [tile()];
  const slot = { x: 6, y: 2, w: 26, d: 26, r: 2 };
  // the slot it lands in: an outline on the tile
  out.push(accent(k.planOutline(slot, 0.2, P, 2), "mi-slot"));
  out.push(box({ x: -36, y: -34, w: 26, d: 26, r: 2 }, 0, 14));
  out.push(box({ x: -36, y: 2, w: 26, d: 26, r: 2 }, 0, 22));
  out.push(box({ x: 6, y: -34, w: 26, d: 26, r: 2 }, 0, 18));
  // the new block, lit, hovering above the slot and settling down on a loop
  out.push(
    `<g class="mi-lower" style="${shift(0, 0, -14)}">${glow([slot.x + 13, slot.y + 13, 34], 10)}${lit(box(slot, 20, 14))}` +
      `<path class="iso-line mi-drop" data-free="" d="${pathOf([[slot.x + 13, slot.y + 13, 0.5], [slot.x + 13, slot.y + 13, 19.5]])}"/></g>`
  );
  return out.join("");
}

// ---------- 4. Optimize: rising bars and a trend line over them ----------
function optimize() {
  const out = [tile()];
  const hs = [12, 19, 27, 38];
  // side by side across the view (x - y), same depth (x + y const), so none hides another
  const bars = hs.map((h, i) => ({ plan: { x: -38 + i * 17, y: 14 - i * 17, w: 13, d: 13, r: 1.5 }, h }));
  bars.forEach((b, i) => out.push(i === bars.length - 1 ? lit(box(b.plan, 0, b.h)) : box(b.plan, 0, b.h)));
  const tops = bars.map((b) => [b.plan.x + 6.5, b.plan.y + 6.5, b.h + 8]);
  out.push(`<g class="mi-trend">${accent(pathOf(tops), "", ' pathLength="1" data-free=""')}</g>`);
  out.push(D(tops.map(at), { size: 1.1, tone: "mid" }));
  out.push(glow(tops[tops.length - 1], 8));
  return out.join("");
}

const ICONS = { assess, architect, implement, optimize };
const LABELS = {
  assess: "A magnifying lens over a three-step process map.",
  architect: "A blueprint with a planned wireframe drawn next to a finished block.",
  implement: "Built blocks with the last one lowering into its slot.",
  optimize: "Four rising bars with a trend line across their tops.",
};
const out = {};
for (const [name, fn] of Object.entries(ICONS)) out[name] = k.figureSvg({ width: W, height: H, label: LABELS[name], body: [fn()] });

writeFileSync(
  OUT_TS,
  `// Generated by the anatomy iso kit (iso-illustration-studio, MIT). Do not edit by hand: rebuild with scripts/build-method-icons.mjs.\nexport const METHOD_ICONS: Record<string, string> = ${JSON.stringify(out)};\n`
);
console.log("wrote", OUT_TS, (JSON.stringify(out).length / 1024).toFixed(1) + " kB");

if (PREVIEW) {
  const css = readFileSync("/Users/tanvir/cognix-new/src/components/home/rewire-iso.css", "utf8") + readFileSync("/Users/tanvir/cognix-new/src/components/home/method-icons.css", "utf8");
  const cells = Object.values(out).map((svg) => `<div class="rw-iso mi is-on" style="width:${W}px;display:inline-block;margin:8px">${svg}</div>`).join("");
  writeFileSync(PREVIEW, `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#10120d;padding:24px}${css}</style></head><body>${cells}</body></html>`);
  console.log("wrote", PREVIEW);
}
