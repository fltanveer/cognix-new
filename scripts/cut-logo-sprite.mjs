// Cuts scripts/.raw/logo-sprite-raw.png (gen-photos.mjs logos) into one transparent white logo per client,
// and prepares the client-supplied logos (BudgetNow, Paperade, FacilityFlow) the same way, so the strip
// reads as one monochrome set. Output: public/img/clients/*.png
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const RAW = new URL("./.raw/", import.meta.url).pathname;
const SRC = new URL("./logo-src/", import.meta.url).pathname; // client-supplied originals (tracked)
const OUT = new URL("../public/img/clients/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

/** White artwork on black → white on transparent (alpha from brightness), trimmed. */
async function whiteOnBlack(input, file) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const l = Math.max(data[i], data[i + 1], data[i + 2]);
    data[i] = data[i + 1] = data[i + 2] = 255;
    data[i + 3] = l < 40 ? 0 : l; // floor the near-black noise
  }
  const png = await sharp(data, { raw: info }).png().toBuffer();
  await sharp(png).trim({ threshold: 1 }).png().toFile(OUT + file);
  const m = await sharp(OUT + file).metadata();
  console.log("ok", file, `${m.width}x${m.height}`);
}

// Sprite cells (inside the white gutters of the 2528x1696 sheet).
const CELLS = {
  "auto-inspect.png": { left: 24, top: 258, width: 792, height: 564 },
  "pknail.png": { left: 867, top: 258, width: 790, height: 564 },
  "kibria.png": { left: 1708, top: 258, width: 792, height: 564 },
  "phc.png": { left: 24, top: 872, width: 792, height: 726 },
  "jvs.png": { left: 867, top: 872, width: 790, height: 726 },
};
for (const [file, box] of Object.entries(CELLS)) {
  await whiteOnBlack(await sharp(RAW + "logo-sprite-raw.png").extract(box).toBuffer(), file);
}

// Supplied logos -----------------------------------------------------------
// Paperade: already white artwork on transparent.
await sharp(SRC + "paperade.png").trim({ threshold: 1 }).png().toFile(OUT + "paperade.png");
console.log("ok paperade.png");

// BudgetNow: white "budget" + blue "now" pill. Mono version: the pill becomes white and the white
// letters inside it become cut-outs, so the mark survives as one colour.
{
  const { data, info } = await sharp(SRC + "budgetnow.png").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  // left edge of the pill: first column with a strongly blue pixel
  let pillX = W;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], b = data[i + 2], a = data[i + 3];
    if (a > 128 && b > 180 && r < 80) pillX = Math.min(pillX, (i / 4) % W);
  }
  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % W, r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    const blue = b - Math.max(r, g); // how blue the pixel is
    if (x >= pillX && a > 0) {
      // inside the pill area: blue → solid, white letters → holes (anti-aliased by blueness)
      const k = Math.max(0, Math.min(1, blue / 140));
      data[i + 3] = Math.round(a * k);
    }
    data[i] = data[i + 1] = data[i + 2] = 255;
  }
  await sharp(data, { raw: info }).trim({ threshold: 1 }).png().toFile(OUT + "budgetnow.png");
  console.log("ok budgetnow.png");
}

// FacilityFlow: the supplied SVG with every fill set to white.
{
  const svg = readFileSync(SRC + "facilityflow.svg", "utf8").replace(/fill="(?!none)[^"]*"/g, 'fill="#FFFFFF"');
  writeFileSync(OUT + "facilityflow.svg", svg);
  console.log("ok facilityflow.svg");
}
