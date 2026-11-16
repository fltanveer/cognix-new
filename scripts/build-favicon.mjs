// Builds the favicon set from one SVG: the Cognixlab mark (lime dot + chevron) on a dark rounded tile,
// so it reads on light and dark browser tabs alike. Run: node scripts/build-favicon.mjs
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const TILE = "#12140e";
const LIME = "#c9f31d";
// Mark geometry traced from public/brand/cognixlab-mark.png (its 304x400 canvas), drawn solid for small sizes.
const mark = `
  <polygon points="300,88 165,200 300,312 300,258 222,200 300,142" fill="${LIME}"/>
  <circle cx="140" cy="200" r="44" fill="${TILE}"/>
  <circle cx="140" cy="200" r="33" fill="${LIME}"/>`;
const fit = `translate(256 256) scale(1.68) translate(-203.5 -200)`;

const svg = (radius) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${radius}" fill="${TILE}"/>
  <g transform="${fit}">${mark}</g>
</svg>`;

// Browser tab icon (rounded tile) and Apple touch icon (square; iOS rounds the corners itself).
writeFileSync("src/app/icon.svg", svg(112));
await sharp(Buffer.from(svg(0))).resize(180, 180).png().toFile("src/app/apple-icon.png");

// favicon.ico with PNG-encoded 16, 32 and 48 px entries, for browsers that don't use the SVG.
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(Buffer.from(svg(112))).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const dir = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
writeFileSync("src/app/favicon.ico", Buffer.concat([header, ...dir, ...pngs]));
console.log("wrote src/app/icon.svg, src/app/apple-icon.png, src/app/favicon.ico");
