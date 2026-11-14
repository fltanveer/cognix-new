// Splits scripts/.raw/car-views-raw.png (2x2 sheet from gen-photos.mjs carviews) into four guided-capture
// views for the Auto Inspect phone demo, blurring the maker's badges so no brand mark ships.
// Output: public/img/inspect/view-{1..4}.webp  (1 front, 2 driver side, 3 rear, 4 passenger side)
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const SRC = new URL("./.raw/car-views-raw.png", import.meta.url).pathname;
const OUT = new URL("../public/img/inspect/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

// Quadrants inside the black gutters (source is 2048 square).
const SIZE = 965;
const QUADS = [
  { n: 1, left: 30, top: 30, badges: [[191, 562, 34]] },
  { n: 2, left: 1050, top: 30, badges: [] },
  { n: 3, left: 30, top: 1050, badges: [[861, 1512, 32], [762, 1546, 30]] },
  { n: 4, left: 1050, top: 1050, badges: [] },
];

for (const q of QUADS) {
  let img = sharp(SRC).extract({ left: q.left, top: q.top, width: SIZE, height: SIZE });
  if (q.badges.length) {
    const base = await img.png().toBuffer();
    const patches = await Promise.all(
      q.badges.map(async ([x, y, r]) => {
        const left = x - q.left - r, top = y - q.top - r, d = r * 2;
        const blurred = await sharp(base).extract({ left, top, width: d, height: d }).blur(9).toBuffer();
        const mask = Buffer.from(`<svg width="${d}" height="${d}"><circle cx="${r}" cy="${r}" r="${r}" fill="#fff"/></svg>`);
        const round = await sharp(blurred).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
        return { input: round, left, top };
      })
    );
    // sharp resizes before it composites, so flatten the patches into a buffer first.
    img = sharp(await sharp(base).composite(patches).png().toBuffer());
  }
  await img.resize(720, 720).webp({ quality: 80 }).toFile(`${OUT}view-${q.n}.webp`);
  console.log("ok view", q.n);
}
