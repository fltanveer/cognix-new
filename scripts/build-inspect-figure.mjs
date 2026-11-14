// Regenerate: node scripts/build-inspect-figure.mjs [preview.html] [before|after]
// (needs the iso-illustration-studio skill installed at ~/.claude/skills)
//
// "Four photos in. A signed-off report out." as an isometric inspection bay, built with the anatomy kit
// at the same camera and scale as the Rewire patch bay. A car on a marked platform; the agent walks a dashed
// path around it with a handheld phone, taking four guided views (front, right, rear, left) and uploading
// each one wirelessly to the inspection unit (five stage lights, a report tray).
// The page plays the recorded run: four captures + uploads, three findings, five stages, six pages, a stamp.
import { writeFileSync, readFileSync } from "node:fs";
import * as k from "/Users/tanvir/.claude/skills/iso-illustration-studio/styles/anatomy/kit/iso-kit.mjs";
import * as G from "/Users/tanvir/.claude/skills/iso-illustration-studio/styles/anatomy/kit/lathe.mjs";

const OUT_TS = "/Users/tanvir/cognix-new/src/components/home/inspect-figure.ts";
const OUT_HTML = process.argv[2];

const WIDTH = 760;
const HEIGHT = 520;

// ---------- world ----------
const PLATE = { x: -212, y: -134, w: 424, d: 254, r: 10 };
const PLATE_H = 12, FOOT_H = 5;
const CAR = { cx: -34, cy: -6 };
const TT_R = 92; // platform under the car
const WALK_R = 108; // where the agent stands for each view
const UNIT = { x: 104, y: -116, w: 80, d: 62, r: 4 };
const UNIT_H = 36;
const TRAY = { x: 112, y: -46, w: 62, d: 42, r: 3 };
const PAGE = { x: 119, y: -41, w: 48, d: 32, r: 0.8 };
const PAGE_H = 0.9, PAGES = 6;
const STAGES = 5;

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [CAR.cx, CAR.cy, 60], [-34, 104, 80], [72, -6, 80], [-136, -6, 80], [-34, -116, 80],
    // apexes of the upload arcs
    [1, -48, 100], [55, -102, 100], [109, -48, 100], [55, 6, 100]],
  WIDTH,
  HEIGHT,
  { pad: 6, azimuth: 45 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const pathOf = (pts, close = false) => pts.map((p, i) => `${i ? "L" : "M"}${at(p).map((n) => n.toFixed(1)).join(" ")}`).join("") + (close ? "Z" : "");
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], a[2] ?? 0], P) - k.depthOf([b[0], b[1], b[2] ?? 0], P));
const route = (pts, per = 12) => {
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
/** A closed rectangle on a vertical face (x fixed or y fixed), for windows, lights and screens. */
const faceRect = (axis, at0, [a0, a1], [z0, z1]) =>
  axis === "x"
    ? [[at0, a0, z0], [at0, a0, z1], [at0, a1, z1], [at0, a1, z0]]
    : [[a0, at0, z0], [a0, at0, z1], [a1, at0, z1], [a1, at0, z0]];

// ---------- base and platform ----------
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 26))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 11);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  const strip = { x: -190, y: PLATE.y + PLATE.d - 15, w: 380, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const t = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 5, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  return out.join("");
}
function platform() {
  const out = [S(k.cylinder(CAR.cx, CAR.cy, TT_R, 0, 3, P, 96, 1), { tone: "mid" })];
  out.push(L(k.ring(CAR.cx, CAR.cy, TT_R - 6, 3, P, 96), { tone: "lo" }));
  const ticks = k.radialTicks(CAR.cx, CAR.cy, TT_R - 7, 72, 6, 3, [2, 4], P);
  out.push(L(ticks.minor, { tone: "faint" }), L(ticks.major, { tone: "lo" }));
  // the agent's walking path around the car
  out.push(`<path class="iso-line ins-walk" data-free="" d="${k.ring(CAR.cx, CAR.cy, WALK_R, 0.3, P, 120)}"/>`);
  return out.join("");
}

// ---------- the car ----------
const BODY = { x: CAR.cx - 62, y: CAR.cy - 27, w: 124, d: 54, r: 12 };
const BODY_Z = 9, BODY_H = 16;
const CABIN = { x: CAR.cx - 30, y: CAR.cy - 23, w: 62, d: 46, r: 12 };
const CABIN_Z = BODY_Z + BODY_H, CABIN_H = 15;
const WHEEL_R = 11, WHEEL_W = 7;
const wheel = (x, side) => {
  const y = side > 0 ? BODY.y + BODY.d - 2 : BODY.y + 2;
  const F = G.frameAlong([x, y, WHEEL_R], [0, side, 0]);
  const out = [S(G.disc(0, WHEEL_W, WHEEL_R, F, P), { tone: "lo" })];
  if (side > 0) {
    out.push(S(G.disc(WHEEL_W, WHEEL_W + 0.8, WHEEL_R * 0.58, F, P), { tone: "mid" }));
    out.push(L(G.circleOf(F, WHEEL_W + 0.8, 2.2, P, 20), { tone: "lo" }));
  }
  return out.join("");
};
function carFar() {
  return [-38, 36].map((dx) => wheel(CAR.cx + dx, -1)).join("");
}
function car() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BODY, 3, BODY_Z, P)}" style="filter:blur(6px)"/>`];
  out.push(S(k.slabOf(BODY, BODY_Z, BODY_H, P, 8, 1), { tone: "mid", inner: L(k.sideSeam(BODY, BODY_Z + 6, P, 8), { tone: "faint" }) }));
  // shut lines: bonnet and boot on top, doors on the near side
  const bx1 = BODY.x + BODY.w, yN = BODY.y + BODY.d;
  out.push(L(k.lineOnTop([CABIN.x + CABIN.w + 2, BODY.y], [CABIN.x + CABIN.w + 2, yN], CABIN_Z, P), { tone: "lo" }));
  out.push(L(k.lineOnTop([CABIN.x - 4, BODY.y], [CABIN.x - 4, yN], CABIN_Z, P), { tone: "lo" }));
  out.push(`<path class="iso-line" data-tone="lo" d="${[-8, 18].map((dx) => pathOf([[CAR.cx + dx, yN, BODY_Z + 2], [CAR.cx + dx, yN, CABIN_Z - 1]])).join("")}" data-free=""/>`);
  // headlights on the front face, a grille between them
  for (const dy of [-18, 12]) out.push(`<path class="iso-line" data-tone="mid" d="${pathOf(faceRect("x", bx1, [CAR.cy + dy, CAR.cy + dy + 6], [BODY_Z + 9, BODY_Z + 13]), true)}"/>`);
  out.push(`<path class="iso-line" data-tone="lo" d="${pathOf(faceRect("x", bx1, [CAR.cy - 8, CAR.cy + 8], [BODY_Z + 4, BODY_Z + 9]), true)}"/>`);
  // cabin with its glass
  out.push(S(k.slabOf(CABIN, CABIN_Z, CABIN_H, P, 8, 0.8), { tone: "mid" }));
  const cx1 = CABIN.x + CABIN.w, cyN = CABIN.y + CABIN.d, gz = [CABIN_Z + 3, CABIN_Z + CABIN_H - 3];
  out.push(`<path class="iso-line ins-glass" d="${pathOf(faceRect("x", cx1, [CABIN.y + 6, cyN - 6], gz), true)}"/>`);
  out.push(`<path class="iso-line ins-glass" d="${pathOf(faceRect("y", cyN, [CABIN.x + 8, CABIN.x + 28], gz), true)}${pathOf(faceRect("y", cyN, [CABIN.x + 32, cx1 - 8], gz), true)}"/>`);
  out.push(L(k.planOutline(k.insetPlan(CABIN, 6), CABIN_Z + CABIN_H, P, 6), { tone: "faint" }));
  // mirror on the near side
  out.push(S(k.slabOf({ x: cx1 - 6, y: cyN, w: 5, d: 4, r: 1 }, CABIN_Z + 1, 3, P, 2), { tone: "mid" }));
  return out.join("");
}
function carNear() {
  return [-38, 36].map((dx) => wheel(CAR.cx + dx, 1)).join("");
}
// three findings: a ring on the damaged panel and a dashed annotation box around it
const FINDINGS = [
  { face: "x", at: BODY.x + BODY.w, c: [CAR.cy + 14, BODY_Z + 7], r: 4.2 }, // front bumper corner
  { face: "y", at: BODY.y + BODY.d, c: [CAR.cx - 30, BODY_Z + 8], r: 4.6 }, // rear door
  { face: "top", at: CABIN_Z + CABIN_H, c: [CAR.cx + 10, CAR.cy - 6], r: 5 }, // roof
];
function findings() {
  return FINDINGS.map((f, i) => {
    let ring, box, dot;
    if (f.face === "top") {
      ring = k.ring(f.c[0], f.c[1], f.r, f.at, P, 28);
      box = pathOf([[f.c[0] - 8, f.c[1] - 8, f.at], [f.c[0] + 8, f.c[1] - 8, f.at], [f.c[0] + 8, f.c[1] + 8, f.at], [f.c[0] - 8, f.c[1] + 8, f.at]], true);
      dot = at([f.c[0], f.c[1], f.at]);
    } else {
      const cen = f.face === "x" ? [f.at, f.c[0], f.c[1]] : [f.c[0], f.at, f.c[1]];
      ring = k.sideRing(cen, f.r, f.face, P);
      box = pathOf(faceRect(f.face, f.at, [f.c[0] - 8, f.c[0] + 8], [f.c[1] - 6, f.c[1] + 6]), true);
      dot = at(cen);
    }
    return `<g class="ins-find" data-i="${i}"><path class="iso-line ins-box" d="${box}"/><path class="iso-line ins-ring" d="${ring}"/><circle class="ins-dot" cx="${dot[0].toFixed(1)}" cy="${dot[1].toFixed(1)}" r="1.3"/></g>`;
  }).join("");
}

// ---------- capture spots: a handheld phone over a footprint marker, back to the car ----------
const STATIONS = [
  { id: "front", at: [CAR.cx + WALK_R, CAR.cy], face: "x", dir: -1, aim: [BODY.x + BODY.w, CAR.cy, BODY_Z + 9] },
  { id: "rear", at: [CAR.cx - WALK_R, CAR.cy], face: "x", dir: 1, aim: [BODY.x, CAR.cy, BODY_Z + 9] },
  { id: "right", at: [CAR.cx, CAR.cy + WALK_R], face: "y", dir: -1, aim: [CAR.cx, BODY.y + BODY.d, BODY_Z + 9] },
  { id: "left", at: [CAR.cx, CAR.cy - WALK_R], face: "y", dir: 1, aim: [CAR.cx, BODY.y, BODY_Z + 9] },
];
const HEAD_Z = 36, PH_W = 16, PH_H = 30, PH_T = 2.6;
/** Ground marker for a capture spot (always visible): where the agent stands. */
function spot(s) {
  const [x, y] = s.at;
  return L(k.ring(x, y, 7, 0.4, P, 28), { tone: "lo" }) + L(k.ring(x, y, 3.2, 0.4, P, 20), { tone: "mid" });
}
function station(s, idx) {
  const [x, y] = s.at, out = [];
  // dotted drop line from the phone to its marker: held in the air, not mounted
  out.push(`<path class="iso-line ins-drop" data-free="" d="${pathOf([[x, y, 0.6], [x, y, HEAD_Z - 1]])}"/>`);
  const plan = s.face === "x" ? { x: x - PH_T / 2, y: y - PH_W / 2, w: PH_T, d: PH_W, r: 0.8 } : { x: x - PH_W / 2, y: y - PH_T / 2, w: PH_W, d: PH_T, r: 0.8 };
  out.push(S(k.slabOf(plan, HEAD_Z, PH_H, P, 3, 0.3), { tone: "mid" }));
  // the screen faces the agent (away from the car); we see it on the front and right phones
  const near = s.face === "x" ? plan.x + plan.w : plan.y + plan.d;
  if (s.dir < 0) {
    const scr = s.face === "x" ? faceRect("x", near, [y - PH_W / 2 + 2, y + PH_W / 2 - 2], [HEAD_Z + 3, HEAD_Z + PH_H - 4]) : faceRect("y", near, [x - PH_W / 2 + 2, x + PH_W / 2 - 2], [HEAD_Z + 3, HEAD_Z + PH_H - 4]);
    out.push(`<path class="ins-screen" data-i="${idx}" d="${pathOf(scr, true)}"/>`);
    // the capture guide on screen: a small car frame
    const c = s.face === "x" ? [near, y, HEAD_Z + 14] : [x, near, HEAD_Z + 14];
    const g = s.face === "x" ? faceRect("x", c[0], [y - 4.5, y + 4.5], [c[2] - 3, c[2] + 3]) : faceRect("y", c[1], [x - 4.5, x + 4.5], [c[2] - 3, c[2] + 3]);
    out.push(`<path class="iso-line" data-tone="lo" d="${pathOf(g, true)}"/>`);
  }
  return `<g class="ins-phone" data-i="${idx}">${out.join("")}</g>`;
}
const lensOf = (s) => [s.at[0] + (s.face === "x" ? s.dir * PH_T : 0), s.at[1] + (s.face === "y" ? s.dir * PH_T : 0), HEAD_Z + PH_H - 8];
const ray = (s, idx) => `<path class="iso-line ins-ray" data-i="${idx}" pathLength="1" d="${pathOf([lensOf(s), s.aim])}"/>${D([at(lensOf(s)), at(s.aim)], { size: 0.9, tone: "mid" })}`;

// ---------- inspection unit, stage lights and report tray ----------
function unit() {
  const out = [`<path class="iso-halo" d="${k.haloOf(UNIT, 0, UNIT_H, P)}" style="filter:blur(5px)"/>`];
  out.push(S(k.slabOf(UNIT, 0, UNIT_H, P, 4, 0.8), { tone: "mid", inner: L(k.sideSeam(UNIT, 8, P, 4), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(UNIT, 4), UNIT_H, P, 4), { tone: "faint" }));
  out.push(D(k.corners(UNIT, 4).map(([x, y]) => at([x, y, UNIT_H])), { size: 0.45, tone: "mid" }));
  // printer slot on top, near the front
  const slot = { x: UNIT.x + 10, y: UNIT.y + UNIT.d - 14, w: UNIT.w - 20, d: 4, r: 2 };
  out.push(S(k.slabOf(slot, UNIT_H - 0.6, 0.6, P, 4), { tone: "lo", crease: "none" }));
  // five stage lights along the top
  for (let i = 0; i < STAGES; i++) {
    const lx = UNIT.x + 14 + i * 13, ly = UNIT.y + 14;
    const g = at([lx, ly, UNIT_H + 1.2]);
    out.push(`<g class="ins-stage" data-i="${i}"><circle class="rw-glow" cx="${g[0].toFixed(1)}" cy="${g[1].toFixed(1)}" r="6"/>${S(k.cylinder(lx, ly, 2.4, UNIT_H, 1.2, P, 20), { tone: "mid" })}</g>`);
  }
  // vents on the front face and an engraved label on the side
  const fy = UNIT.y + UNIT.d;
  const vent = (x) => pathOf([[x, fy, 8], [x, fy, 24], [x + 2.6, fy, 24], [x + 2.6, fy, 8]], true);
  out.push(`<path class="iso-line" data-tone="lo" d="${[10, 16, 22, 28].map((dx) => vent(UNIT.x + dx)).join("")}"/>`);
  out.push(k.faceTextSvg(k.sideMatrix([UNIT.x + UNIT.w, UNIT.y + UNIT.d / 2], 14, P, "right"), "INSPECT", { size: 5.5, tone: "mid", anchor: "middle" }));
  return out.join("");
}
function tray() {
  const out = [S(k.slabOf(TRAY, 0, 3, P, 4, 0.5), { tone: "mid" })];
  out.push(L(k.planOutline(k.insetPlan(TRAY, 2.5), 3, P, 4), { tone: "lo" }));
  for (let i = 0; i < PAGES; i++) {
    const z = 3 + i * PAGE_H;
    const pg = { ...PAGE, x: PAGE.x + (i % 2 ? 0.8 : 0), y: PAGE.y + (i % 3) * 0.4 };
    const rules = i === PAGES - 1
      ? [0, 1, 2, 3].map((j) => `<path class="iso-line" data-tone="lo" data-free="" d="${k.lineOnTop([pg.x + 6, pg.y + 7 + j * 4], [pg.x + (j === 3 ? 22 : 36), pg.y + 7 + j * 4], z + PAGE_H, P)}"/>`).join("")
      : "";
    out.push(`<g class="ins-page" data-i="${i}">${S(k.slabOf(pg, z, PAGE_H, P, 2), { tone: "hi", crease: "none" })}${rules}</g>`);
  }
  // the sign-off stamp on the top page
  const zt = 3 + PAGES * PAGE_H, sc = [PAGE.x + PAGE.w - 11, PAGE.y + PAGE.d - 10];
  out.push(`<g class="ins-stamp"><path class="iso-line" d="${k.ring(sc[0], sc[1], 6.5, zt, P, 32)}"/><path class="iso-line" data-free="" d="${k.onTop([[sc[0] - 3, sc[1]], [sc[0] - 0.6, sc[1] + 2.6], [sc[0] + 3.4, sc[1] - 2.8]], zt, P)}"/></g>`);
  return out.join("");
}

// ---------- wireless upload: an arc from each phone up and over to the unit ----------
const INBOX = [UNIT.x + UNIT.w / 2, UNIT.y + UNIT.d / 2 - 6, UNIT_H + 2];
function uploads() {
  return STATIONS.map((s, i) => {
    const top = [s.at[0], s.at[1], HEAD_Z + PH_H + 2];
    const mid = [(top[0] + INBOX[0]) / 2, (top[1] + INBOX[1]) / 2, Math.max(top[2], INBOX[2]) + 30];
    const d = pathOf(route([top, mid, INBOX], 16));
    return `<g class="ins-up" data-i="${i}"><path class="iso-line ins-up-trail" data-free="" pathLength="1" d="${d}"/><path class="iso-line ins-up-packet" data-free="" pathLength="1" d="${d}"/></g>`;
  }).join("");
}
// a receive light on the unit lid: where the uploads land
function inbox() {
  const g = at(INBOX);
  return `<g class="ins-rx"><circle class="rw-glow" cx="${g[0].toFixed(1)}" cy="${g[1].toFixed(1)}" r="7"/>${L(k.ring(INBOX[0], INBOX[1], 4, UNIT_H + 0.2, P, 24), { tone: "mid" })}</g>`;
}

// ---------- assemble in painter's order ----------
const st = Object.fromEntries(STATIONS.map((s, i) => [s.id, [s, i]]));
const body = [
  base(),
  platform(),
  ...STATIONS.map(spot),
  station(...st.left),
  station(...st.rear),
  ray(...st.left),
  ray(...st.rear),
  carFar(),
  car(),
  carNear(),
  findings(),
  ray(...st.front),
  ray(...st.right),
  unit(),
  inbox(),
  tray(),
  station(...st.front),
  station(...st.right),
  uploads(),
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "An isometric inspection bay. An agent walks around a car with a phone, taking four guided photos from the front, right, rear and left, and each photo uploads wirelessly to an inspection unit. Three damage findings are ringed and boxed on the car, the unit's five stage lights come on, and a six-page report prints into the tray and is stamped.",
  body,
});

writeFileSync(
  OUT_TS,
  `// Generated by the anatomy iso kit (iso-illustration-studio, MIT). Do not edit by hand: rebuild with scripts/build-inspect-figure.mjs.\n// An inspection bay: a handheld phone at four capture spots, uploads to an inspection unit, a report tray.\nexport const INSPECT_SVG = ${JSON.stringify(svg)};\n`,
);
console.log("wrote", OUT_TS, (svg.length / 1024).toFixed(1) + " kB");

if (OUT_HTML) {
  const css = readFileSync("/Users/tanvir/cognix-new/src/components/home/rewire-iso.css", "utf8") + readFileSync("/Users/tanvir/cognix-new/src/components/home/inspect-iso.css", "utf8");
  const state = process.argv[3] ?? "after";
  writeFileSync(OUT_HTML, `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#10120d;padding:40px}${css}</style></head><body><div class="rw-iso ins-iso" data-ins="${state}" style="width:${WIDTH}px">${svg}</div></body></html>`);
  console.log("wrote", OUT_HTML);
}
