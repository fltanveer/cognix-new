// Regenerate: node scripts/build-rewire-figure.mjs   (needs the iso-illustration-studio skill installed at ~/.claude/skills)
// Builds the "Rewire" patch-bay figure for the Cognixlab home page with the anatomy kit.
// The object is the explanation: six tool modules in a rack, joined by loose hand-patched cords
// (the manual hand-offs). Scrolling retracts the cords and wires every module to one backplane bus.
// Output: src/components/home/rewire-figure.ts (precomputed SVG string, no kit shipped to the site).
import { writeFileSync, readFileSync } from "node:fs";
import * as k from "/Users/tanvir/.claude/skills/iso-illustration-studio/styles/anatomy/kit/iso-kit.mjs";

const OUT_TS = "/Users/tanvir/cognix-new/src/components/home/rewire-figure.ts";
const OUT_HTML = process.argv[2];

const WIDTH = 760;
const HEIGHT = 520;

// ---------- world ----------
const PLATE = { x: -172, y: -116, w: 344, d: 196, r: 10 };
const PLATE_H = 12;
const FOOT_H = 5;
const BACK = { x: -160, y: -108, w: 320, d: 15, r: 2.5 };
const BACK_H = 18;
const BUS_Y = BACK.y + BACK.d / 2;
const MW = 64, MD = 46, MH = 20;
const COLS = [-132, -32, 68];
const ROWS = { back: -60, front: 12 };
const MODULES = [
  { id: "inbox", label: "INBOX", row: "back", col: 0 },
  { id: "sheet", label: "SHEETS", row: "back", col: 1 },
  { id: "chat", label: "CHAT", row: "back", col: 2 },
  { id: "pdf", label: "FORMS", row: "front", col: 0 },
  { id: "acct", label: "LEDGER", row: "front", col: 1 },
  { id: "crm", label: "CRM", row: "front", col: 2 },
].map((m) => ({ ...m, plan: { x: COLS[m.col], y: ROWS[m.row], w: MW, d: MD, r: 3 } }));
const jackOf = (m) => [m.plan.x + MW - 9, m.plan.y + 9, MH + 6.6]; // top of the plug seated in the jack
const ledOf = (m) => [m.plan.x + 8, m.plan.y + MD - 7];
const GAPS = { pdf: -50, acct: 50, crm: 150 };

// tangled hand-offs: [from, to, lift, sideways swing]
const TANGLE = [
  ["inbox", "sheet", 46, 30],
  ["sheet", "crm", 66, -40],
  ["chat", "pdf", 78, 46],
  ["pdf", "acct", 42, -28],
  ["acct", "inbox", 72, 36],
  ["crm", "chat", 52, -34],
];

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [-60, -40, 92], [60, -60, 92]],
  WIDTH,
  HEIGHT,
  { pad: 6, azimuth: 45 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], a[2] ?? 0], P) - k.depthOf([b[0], b[1], b[2] ?? 0], P));
const pathOf = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${at(p).map((n) => n.toFixed(1)).join(" ")}`).join("");
const bez = (a, b, c, d, n = 40) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, u = 1 - t;
    return [0, 1, 2].map((j) => u * u * u * a[j] + 3 * u * u * t * b[j] + 3 * u * t * t * c[j] + t * t * t * d[j]);
  });
/** A smooth route through 3D waypoints (Catmull-Rom sampled). */
const route = (pts, per = 14) => {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    for (let s = 0; s < per; s++) {
      const t = s / per, t2 = t * t, t3 = t2 * t;
      out.push([0, 1, 2].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};
const cord = (pts, cls, tone = "mid") => {
  const d = pathOf(pts);
  return `<path class="iso-line rw-cab-o ${cls}" pathLength="1" d="${d}"/><path class="iso-line rw-cab-i ${cls}" data-tone="${tone}" pathLength="1" d="${d}"/>`;
};

// ---------- base ----------
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 24))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 11);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // ruler strip along the front edge
  const strip = { x: -150, y: PLATE.y + PLATE.d - 15, w: 300, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const t = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 5, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  // maker's plate, front-left: rule lines stand for printed text
  const tag = { x: PLATE.x + 14, y: PLATE.y + PLATE.d - 34, w: 30, d: 14, r: 1.4 };
  out.push(S(k.slabOf(tag, 0, 0.8, P, 3, 0.3), { tone: "lo" }));
  for (let j = 0; j < 3; j++) out.push(`<path class="iso-line" data-tone="mid" data-free="" d="${k.lineOnTop([tag.x + 5, tag.y + 4 + j * 3], [tag.x + (j === 2 ? 16 : 24), tag.y + 4 + j * 3], 0.8, P)}"/>`);
  out.push(D([at([tag.x + 2.4, tag.y + 2.4, 0.8]), at([tag.x + tag.w - 2.4, tag.y + tag.d - 2.4, 0.8])], { size: 0.45 }));
  // aisle groove between the rows
  out.push(L(k.lineOnTop([PLATE.x + 5, 0], [PLATE.x + PLATE.w - 5, 0], 0, P), { tone: "faint" }));
  return out.join("");
}

// ---------- backplane with the bus ----------
const PORT_X = [...MODULES.filter((m) => m.row === "back").map((m) => jackOf(m)[0]), GAPS.pdf, GAPS.acct, GAPS.crm - 6];
function backplane() {
  const out = [S(k.slabOf(BACK, 0, BACK_H, P, 4, 0.8), { tone: "mid" })];
  out.push(L(k.sideSeam(BACK, 6, P, 4), { tone: "faint" }));
  const ch = { x: BACK.x + 6, y: BUS_Y - 2.4, w: BACK.w - 12, d: 4.8, r: 2.4 };
  out.push(L(k.planOutline(ch, BACK_H, P, 6), { tone: "lo" }));
  for (const x of byDepth(PORT_X.map((x) => [x, BUS_Y, BACK_H])).map((p) => p[0])) {
    out.push(S(k.cylinder(x, BUS_Y, 3.4, BACK_H, 1.6, P, 20), { tone: "mid" }));
    out.push(L(k.ring(x, BUS_Y, 1.6, BACK_H + 1.6, P, 16), { tone: "lo" }));
  }
  // one status light per port on the backplane's front face
  const fy = BACK.y + BACK.d;
  out.push(`<g class="rw-portleds">${PORT_X.map((x) => `<circle class="rw-portled" cx="${at([x + 7, fy, 11])[0].toFixed(1)}" cy="${at([x + 7, fy, 11])[1].toFixed(1)}" r="1.6"/>`).join("")}</g>`);
  // vent slots, closed, between the ports
  const slot = (x) => pathOf([[x, fy, 4], [x, fy, 9], [x + 3, fy, 9], [x + 3, fy, 4], [x, fy, 4]]);
  out.push(`<path class="iso-line" data-tone="faint" d="${[-140, -134, -128, 128, 134].map(slot).join("")}"/>`);
  out.push(D([BACK.x + 4, BACK.x + BACK.w - 4].map((x) => at([x, BUS_Y, BACK_H])), { size: 0.5 }));
  // the bus itself: dim at rest, drawn lit as the modules are wired in
  const bus = [[ch.x + 3, BUS_Y, BACK_H + 0.2], [ch.x + ch.w - 3, BUS_Y, BACK_H + 0.2]];
  out.push(`<path class="iso-line" data-tone="faint" d="${pathOf(bus)}"/>`);
  out.push(`<path class="iso-line rw-bus-glow" pathLength="1" d="${pathOf(bus)}"/>`);
  out.push(`<path class="iso-line rw-bus" pathLength="1" d="${pathOf(bus)}"/>`);
  out.push(`<path class="iso-line rw-pulse" pathLength="1" d="${pathOf(bus)}"/>`);
  return out.join("");
}

// ---------- module tops: each one a recognisable object ----------
const top = (m, dx, dy) => [m.plan.x + dx, m.plan.y + dy];
function tray(m) {
  const z = MH, out = [];
  const t = { x: m.plan.x + 8, y: m.plan.y + 13, w: 42, d: 26, r: 2 };
  out.push(S(k.slabOf(t, z, 5, P, 3, 0.5), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(t, 2.2), z + 5, P, 3), { tone: "lo" }));
  for (const [i, h] of [[0, 0.8], [1, 0.8]]) {
    const e = { x: t.x + 4 + i * 3, y: t.y + 4 - i * 2, w: 30, d: 17, r: 1 };
    const ez = z + 5 + i * h;
    out.push(S(k.slabOf(e, ez, h, P, 2), { tone: "hi", crease: "none" }));
    out.push(L(k.onTop([[e.x, e.y], [e.x + e.w / 2, e.y + e.d * 0.55], [e.x + e.w, e.y]], ez + h, P), { tone: "lo" }));
  }
  return out.join("");
}
function ledger(m) {
  const z = MH, out = [];
  const t = { x: m.plan.x + 7, y: m.plan.y + 13, w: 44, d: 28, r: 2 };
  out.push(S(k.slabOf(t, z, 2.2, P, 3, 0.5), { tone: "hi", crease: "lo" }));
  const zt = z + 2.2, g = k.insetPlan(t, 2.5);
  for (let i = 1; i < 5; i++) out.push(L(k.lineOnTop([g.x + (g.w / 5) * i, g.y], [g.x + (g.w / 5) * i, g.y + g.d], zt, P), { tone: "faint" }));
  for (let j = 1; j < 4; j++) out.push(L(k.lineOnTop([g.x, g.y + (g.d / 4) * j], [g.x + g.w, g.y + (g.d / 4) * j], zt, P), { tone: j === 1 ? "mid" : "faint" }));
  out.push(L(k.planOutline(g, zt, P, 3), { tone: "lo" }));
  return out.join("");
}
function speaker(m) {
  const z = MH, out = [];
  const [cx, cy] = top(m, 26, 26);
  out.push(S(k.cylinder(cx, cy, 13, z, 2, P, 48, 0.5), { tone: "mid" }));
  out.push(L(k.ring(cx, cy, 11, z + 2, P, 48), { tone: "lo" }));
  const holes = [];
  for (let gx = -9; gx <= 9; gx += 3) for (let gy = -9; gy <= 9; gy += 3) if (gx * gx + gy * gy <= 72) holes.push(at([cx + gx, cy + gy, z + 2]));
  out.push(D(holes, { size: 0.55, tone: "mid" }));
  const [bx, by] = top(m, 48, 34);
  out.push(S(k.cylinder(bx, by, 4, z, 3, P, 24, 0.4), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(bx, by, 2.2, z + 3, P, 16), { tone: "lo" }));
  return out.join("");
}
function forms(m) {
  const z = MH, out = [];
  for (let i = 0; i < 3; i++) {
    const s = { x: m.plan.x + 9 + i * 2.2, y: m.plan.y + 12 - i * 1.6, w: 34, d: 26, r: 0.8 };
    out.push(S(k.slabOf(s, z + i * 1.1, 1.1, P, 2), { tone: "hi", crease: "none" }));
  }
  const s = { x: m.plan.x + 13.4, y: m.plan.y + 8.8, w: 34, d: 26 };
  const zt = z + 3.3;
  for (let j = 0; j < 5; j++) {
    const y = s.y + 8 + j * 3.6, len = j === 4 ? 14 : 26;
    out.push(`<path class="iso-line" data-tone="lo" data-free="" d="${k.lineOnTop([s.x + 4, y], [s.x + 4 + len, y], zt, P)}"/>`);
  }
  const clip = { x: s.x + 11, y: s.y - 1.5, w: 12, d: 4, r: 1.2 };
  out.push(S(k.slabOf(clip, zt, 1.6, P, 3, 0.3), { tone: "mid" }));
  return out.join("");
}
function calculator(m) {
  const z = MH, out = [];
  const body = { x: m.plan.x + 8, y: m.plan.y + 9, w: 40, d: 30, r: 2.5 };
  out.push(S(k.slabOf(body, z, 2.4, P, 3, 0.5), { tone: "mid" }));
  const zt = z + 2.4;
  const disp = { x: body.x + 3, y: body.y + 3, w: body.w - 6, d: 7, r: 1 };
  out.push(S(k.slabOf(disp, zt, 0.6, P, 2), { tone: "lo", crease: "none" }));
  const keys = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) keys.push([body.x + 6 + c * 9.4, body.y + 14 + r * 5.6]);
  for (const [x, y] of byDepth(keys)) out.push(S(k.slabOf({ x: x - 3, y: y - 1.8, w: 6, d: 3.6, r: 0.9 }, zt, 1.2, P, 2), { tone: "hi", crease: "none" }));
  return out.join("");
}
function cardFile(m) {
  const z = MH, out = [];
  const t = { x: m.plan.x + 7, y: m.plan.y + 12, w: 44, d: 28, r: 2 };
  out.push(S(k.slabOf(t, z, 4, P, 3, 0.5), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(t, 2), z + 4, P, 3), { tone: "lo" }));
  for (let i = 0; i < 6; i++) {
    const c = { x: t.x + 4, y: t.y + 3 + i * 4, w: 36, d: 1.2, r: 0.4 };
    out.push(S(k.slabOf(c, z + 4, 9 - (i % 2) * 1.4, P, 2), { tone: "hi", crease: "none" }));
  }
  const tab = { x: t.x + 22, y: t.y + 3 + 3 * 4, w: 8, d: 1.2, r: 0.4 };
  out.push(S(k.slabOf(tab, z + 13, 2.2, P, 2), { tone: "hi", crease: "none" }));
  return out.join("");
}
const OBJECT = { inbox: tray, sheet: ledger, chat: speaker, pdf: forms, acct: calculator, crm: cardFile };

function moduleSvg(m) {
  const out = [`<path class="iso-halo" d="${k.haloOf(m.plan, 0, MH, P)}" style="filter:blur(5px)"/>`];
  out.push(S(k.slabOf(m.plan, 0, MH, P, 4, 0.8), { tone: "mid", inner: L(k.sideSeam(m.plan, 4, P, 4), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(m.plan, 3.5), MH, P, 4), { tone: "faint" }));
  out.push(D(k.corners(m.plan, 4).map(([x, y]) => at([x, y, MH])), { size: 0.45, tone: "mid" }));
  // vent slots on the front face, closed so they read as cut-outs
  const fy = m.plan.y + MD;
  const slot = (x) => pathOf([[x, fy, 6], [x, fy, 14], [x + 2.6, fy, 14], [x + 2.6, fy, 6], [x, fy, 6]]);
  out.push(`<path class="iso-line" data-tone="lo" d="${[44, 50, 56].map((dx) => slot(m.plan.x + dx)).join("")}"/>`);
  // engraved label on the side face, the one the row in front never hides
  out.push(k.faceTextSvg(k.sideMatrix([m.plan.x + MW, m.plan.y + MD / 2], 7.5, P, "right"), m.label, { size: 5, tone: "mid", anchor: "middle" }));
  out.push(OBJECT[m.id](m));
  // jack and status light
  const [jx, jy] = jackOf(m);
  out.push(S(k.cylinder(jx, jy, 3.6, MH, 2.4, P, 24, 0.4), { tone: "mid" }));
  // the plug seated in the jack: a knurled sleeve the cable leaves from
  out.push(S(k.cylinder(jx, jy, 2.5, MH + 2.4, 4.2, P, 20, 0.3), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(jx, jy, 2.5, MH + 2.8, MH + 5.8, 14, P), { tone: "lo" }));
  const [lx, ly] = ledOf(m);
  const g = at([lx, ly, MH + 1.2]);
  out.push(`<g class="rw-led" data-led="${m.id}"><circle class="rw-glow" cx="${g[0].toFixed(1)}" cy="${g[1].toFixed(1)}" r="7"/>${S(k.cylinder(lx, ly, 2.2, MH, 1.2, P, 20), { tone: "mid" })}</g>`);
  return `<g data-module="${m.id}">${out.join("")}</g>`;
}

// ---------- cords ----------
const mod = Object.fromEntries(MODULES.map((m) => [m.id, m]));
const PORT_Z = BACK_H + 1.6;
// connected state: every module wired back to the bus
function orderedBack() {
  return MODULES.filter((m) => m.row === "back").map((m) => {
    const [x, y, z] = jackOf(m);
    return cord(route([[x, y, z], [x, m.plan.y - 3, z + 1.5], [x, BUS_Y + 9, PORT_Z + 3], [x, BUS_Y, PORT_Z]], 10), "rw-wire");
  });
}
function orderedFront() {
  // each front cord leaves its jack, drops into the aisle, runs to a gap between the back modules, then back to the bus
  const aisle = [], gap = [];
  for (const id of ["pdf", "acct", "crm"]) {
    const m = mod[id];
    const [x, y, z] = jackOf(m);
    const gx = id === "crm" ? GAPS.crm - 6 : GAPS[id];
    const a = route([[x, y, z], [x, m.plan.y - 3, z + 1], [x, 2, 3], [x - 6, 0, 1.2], [gx, 0, 1.2]], 10);
    const b = route([[gx, 0, 1.2], [gx, -40, 1.2], [gx, BUS_Y + 12, 1.4], [gx, BUS_Y + 8, PORT_Z - 4], [gx, BUS_Y, PORT_Z]], 10);
    aisle.push(cord(a, "rw-wire rw-wire--a"));
    gap.push(cord(b, "rw-wire rw-wire--b"));
  }
  return { aisle, gap };
}
// tangled state: loose patch cords looping between jacks, above everything
function tangle() {
  return TANGLE.map(([a, b, lift, swing], i) => {
    const A = jackOf(mod[a]), B = jackOf(mod[b]);
    const mid = [(A[0] + B[0]) / 2 + swing, (A[1] + B[1]) / 2 - swing * 0.6, Math.max(A[2], B[2]) + lift];
    const pts = [...bez(A, [A[0] + swing * 0.4, A[1] + 10, A[2] + lift * 0.7], [mid[0] - swing * 0.5, mid[1], mid[2]], mid, 24), ...bez(mid, [mid[0] + swing * 0.5, mid[1], mid[2]], [B[0] - swing * 0.3, B[1] - 10, B[2] + lift * 0.6], B, 24).slice(1)];
    return cord(pts, "rw-tangle", i % 2 ? "mid" : "lo");
  });
}

// ---------- assemble in painter's order ----------
const back = MODULES.filter((m) => m.row === "back");
const front = MODULES.filter((m) => m.row === "front");
const { aisle, gap } = orderedFront();
const body = [
  base(),
  backplane(),
  `<g data-part="gap">${gap.join("")}</g>`,
  ...back.map(moduleSvg),
  `<g data-part="back-wires">${orderedBack().join("")}</g>`,
  `<g data-part="aisle">${aisle.join("")}</g>`,
  ...byDepth(front.map((m) => [m.plan.x + MW, m.plan.y + MD, 0, m])).map((p) => moduleSvg(p[3])),
  `<g data-part="tangle">${tangle().join("")}</g>`,
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "An isometric patch bay. Six tool modules, an inbox tray, a spreadsheet ledger, a team-chat speaker, a stack of forms, a calculator and a card file, sit in a rack. At first they are joined by loose patch cords looped between them by hand; then the cords come out and every module is wired back to one lit bus on the backplane.",
  body,
});

writeFileSync(
  OUT_TS,
  `// Generated by the anatomy iso kit (iso-illustration-studio, MIT). Do not edit by hand: rebuild with build-rewire.mjs.\n// A patch bay: six tool modules joined by hand-patched cords, rewired to one backplane bus.\nexport const REWIRE_SVG = ${JSON.stringify(svg)};\n`,
);
console.log("wrote", OUT_TS, (svg.length / 1024).toFixed(1) + " kB");

if (OUT_HTML) {
  const css = readFileSync("/Users/tanvir/cognix-new/src/components/home/rewire-iso.css", "utf8");
  const state = process.argv[3] ?? "before";
  writeFileSync(OUT_HTML, `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#10120d;padding:40px}${css}</style></head><body><div class="rw-iso" data-rw="${state}" style="width:${WIDTH}px">${svg}</div></body></html>`);
  console.log("wrote", OUT_HTML);
}
