// Generates site photos with Gemini. Key is read from ./api.env (gitignored).
// Usage: node scripts/gen-photos.mjs <hero|industries|covers|hand|avatars|faces|carviews|logos> [name ...]   (no names = whole set)
// Photos stand for the kind of work; they never depict real clients, staff or endorsers.
import { readFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

const KEY = readFileSync(new URL("../api.env", import.meta.url), "utf8").trim().replace(/^[A-Z_]+=/, "");
const MODEL = "gemini-3-pro-image";

const LOOK =
  "Editorial documentary photograph, low-key lighting, deep near-black shadows, warm tungsten practical light with one subtle chartreuse-lime (#c9f31d) accent glow, shallow depth of field, 35mm, fine film grain, muted desaturated palette, premium magazine feel. No text, no readable screens, no logos, no brand names, no watermarks.";

const HERO = {
  inspect:
    "Close-up of two hands holding a smartphone, photographing a dented front quarter panel of a dark sedan inside a dim garage at night. The phone screen glows softly and shows the car panel. Faces out of frame.",
  scan:
    "A terrestrial laser scanner on a tripod standing alone inside an unfinished concrete building interior, raw columns and rebar, dusk light falling through open window openings, dust in the air.",
  model:
    "Over-the-shoulder view of an architect's hands at a dark studio desk, a laptop showing a glowing wireframe 3D building model made of thin lines, rolled drawings and a scale ruler beside it. Face not visible.",
  clinic:
    "A calm, modern medical practice reception desk in the evening, empty, warm pendant lights, a tablet resting on a stone counter, a plant, soft reflections. Quiet and premium, no people.",
  ops:
    "Silhouette of an operations manager seen from behind at a desk at night, two monitors showing abstract blurred charts and flow diagrams, city lights through the window, coffee cup. Face not visible.",
  paper:
    "Top-down view of a cluttered desk: stacks of printed forms, sticky notes, a calculator, a pen and a laptop, a hand reaching for a sheet. Represents manual busywork. Dramatic side light.",
  adjuster:
    "An insurance adjuster crouching beside a car at night under a single streetlight, holding a tablet, seen from behind and slightly side, reflections on wet asphalt. Face not visible.",
};

const INDUSTRIES = {
  "insurance-inspections":
    "Dusk in an open-air parking lot: an inspector's gloved hands hold a smartphone up to a scraped rear bumper of a dark SUV, the phone screen shows the bumper framed by a thin glowing lime outline box. Car body fills most of the frame, wet tarmac reflections. Face out of frame.",
  "architecture-construction":
    "Blue hour on a construction site: an engineer in a hard hat seen from behind holds a tablet showing a glowing thin-line wireframe of the steel-frame building in front of them, exposed steel beams, a tower crane, work lights. Face not visible.",
  "healthcare-practices":
    "A consultant surgeon's private practice office in the evening: walnut desk with a stethoscope, an open laptop glowing softly, a neat stack of patient folders, blurred framed certificates and a window with city lights behind. No people, quiet and premium.",
};

// Case-study covers (3:2) for cards whose old art clashed with the palette or carried baked-in text.
const COVERS = {
  "pknail-cover":
    "A dark architecture studio at night: a wide monitor shows a dense grey point cloud of a building floor on the left that resolves into a clean extruded wall model drawn in thin glowing lime lines on the right. A laser scanner on a tripod stands beside the desk. No people.",
  "kibria-cover":
    "A consultant surgeon's consulting room in warm evening light: a smartphone lies on a walnut desk beside a stethoscope, its screen shows an abstract street map with one glowing lime location pin and a few blank result cards. Shallow depth of field, framed certificates blurred behind. No people.",
  "phc-cover":
    "An aesthetic dermatology clinic treatment room in the evening: a smartphone on a small tripod with a soft ring light is set up to film an empty treatment chair, skincare bottles on a tray, a thin lime accent light along the wall. Calm and premium. No people.",
  "jvs-cover":
    "An agile coaching workshop in a dark office: a planning wall covered with columns of sticky notes and printed sprint boards, a few lime sticky notes standing out, one hand placing a note, warm practical light, laptop and coffee on the table below. Face not visible.",
};

// Cut-out asset: keyed by scripts/key-hand.mjs, so it must NOT use the editorial LOOK suffix.
const HAND = {
  "hand-phone-raw":
    "Studio product photograph. A dark-skinned human hand, seen from the front, holds a modern frameless smartphone upright and perfectly straight, phone facing the camera squarely with no tilt or perspective. Low-key lighting: the hand is almost a black silhouette with a thin soft white rim light along the fingers and the thin silver phone frame. Fingers wrap only the left and right edges of the phone and do not cover any part of the screen. The phone screen is a solid flat pure blue #0000FF, completely uniform, no reflections, no glare, no UI. The entire background is the same solid flat pure blue #0000FF chroma key, perfectly even, no gradient, no shadows on the background. Phone centered, occupying about 55% of the image height, wrist exiting the bottom right edge. Square composition. No text, no logos.",
};

// Avatars for the phone mock UI only (illustrative app users, never presented as clients or staff).
const AVATAR_LOOK =
  "Tight head-and-shoulders portrait photo for an app profile avatar, softly lit, dark charcoal background, natural skin, friendly neutral expression, shallow depth of field. No text, no logos.";
const AVATARS = {
  "av-1": "A woman in her early 30s with curly dark hair, olive sweater.",
  "av-2": "A man in his 40s with short grey beard and glasses, dark shirt.",
  "av-3": "A young East Asian woman with straight black hair, black blazer.",
  "av-4": "A man in his late 20s with short black hair and light stubble, charcoal hoodie.",
};

// Full-bleed portrait cards inside the phone feed (illustrative app users).
const FACE_LOOK =
  "Editorial portrait photo, head and shoulders filling the frame, face centred in the upper half, soft directional light, deep charcoal background with a faint warm rim light, natural skin texture, confident relaxed expression. No text, no logos.";
const FACES = {
  "face-1": "A South Asian woman in her early 30s, hair tied back, black turtleneck.",
  "face-2": "A Black man in his late 30s with a short beard, olive field jacket over a grey t-shirt.",
  "face-3": "A woman in her 40s with short silver-blonde hair and small earrings, dark navy blazer.",
};

// One car, four guided views, generated as a single 2x2 sheet so it stays the same car (split by scripts/split-car-views.mjs).
const CARVIEWS = {
  "car-views-raw":
    "A 2x2 grid contact sheet of four photos of the SAME dark graphite-grey mid-size SUV parked in a dim concrete parking garage at night, taken handheld by an insurance inspector. Top-left: front three-quarter view showing a visible dent on the front bumper corner. Top-right: driver-side profile showing a long scratch along the rear door. Bottom-left: rear three-quarter view showing a cracked tail light. Bottom-right: passenger-side profile, clean. Every photo: the whole car centred and fully in frame with space around it, eye-level, overhead fluorescent light, realistic, slightly desaturated, consistent car, consistent location. Thin black gutters between the four photos. No text, no watermark, no number plates readable.",
};

// Wordmark sprite for clients without a supplied logo: one sheet, cut by scripts/cut-logo-sprite.mjs.
// Typographic stand-ins only; replace with each client's official logo when supplied.
const LOGOSPRITE = {
  "logo-sprite-raw":
    "A logo sprite sheet on a pure solid black background (#000000). A grid of 3 columns by 2 rows: six equal cells with generous empty space between them, no grid lines, no borders, no frames. Each cell holds ONE wordmark logo, centred, pure white (#FFFFFF), flat vector style: no gradients, no shadows, no glow, no mockup, no extra words. Every logo must use a clearly different typographic style. " +
    "Cell 1 (top-left): the text 'Auto Inspect' in a bold geometric sans-serif, with a small square camera-viewfinder icon (four corner brackets around a dot) to its left. " +
    "Cell 2 (top-middle): the text 'PKNAIL' in a condensed technical uppercase typeface with wide letter spacing, with a small isometric cube outline icon to its left. " +
    "Cell 3 (top-right): the text 'Dr. S. M. G. Kibria' in an elegant high-contrast serif, with the words 'CONSULTANT SURGEON' in small widely tracked capitals centred beneath it. " +
    "Cell 4 (bottom-left): the letters 'PHC' in a thin, wide, light sans-serif with the words 'AESTHETIC & DERMA CARE' in small tracked capitals beneath, and a small minimal leaf shape above the letters. " +
    "Cell 5 (bottom-middle): a 'JVS' monogram inside a thin circle, followed to its right by the word 'Management' in a medium humanist sans-serif. " +
    "Cell 6 (bottom-right): completely empty black. Spell every word exactly as given, letter for letter.",
};

const SETS = {
  hero: { shots: HERO, ratio: "3:4", width: 720, dir: "../public/img/hero/" },
  industries: { shots: INDUSTRIES, ratio: "4:5", width: 1100, dir: "../public/img/industries/" },
  avatars: { shots: AVATARS, ratio: "1:1", width: 160, dir: "../public/img/avatars/", look: AVATAR_LOOK, model: "gemini-3.1-flash-image" },
  carviews: { shots: CARVIEWS, ratio: "1:1", width: 2048, dir: "../scripts/.raw/", raw: true, size: "2K" },
  logos: { shots: LOGOSPRITE, ratio: "3:2", width: 2048, dir: "../scripts/.raw/", raw: true, size: "2K" },
  hand: { shots: HAND, ratio: "1:1", width: 2048, dir: "../scripts/.raw/", raw: true, size: "2K" },
  faces: { shots: FACES, ratio: "4:5", width: 720, dir: "../public/img/faces/", look: FACE_LOOK },
  covers: { shots: COVERS, ratio: "3:2", width: 1600, dir: "../public/img/work/" },
};
const [setName = "hero", ...picked] = process.argv.slice(2);
const SET = SETS[setName];
if (!SET) throw new Error(`Unknown set "${setName}". Use: ${Object.keys(SETS).join(", ")}`);
const OUT = new URL(SET.dir, import.meta.url);
mkdirSync(OUT, { recursive: true });
const SHOTS = SET.shots;

async function gen(name) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${SET.model ?? MODEL}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: SET.raw ? SHOTS[name] : SET.look ? `${SHOTS[name]} ${SET.look}` : `${SHOTS[name]} ${LOOK} Portrait ${SET.ratio} composition.` }] }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: SET.ratio, ...(SET.size ? { imageSize: SET.size } : {}) } },
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${name}: ${res.status} ${json.error?.message ?? ""}`);
  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error(`${name}: no image in response`);
  const buf = Buffer.from(part.inlineData.data, "base64");
  if (SET.raw) await sharp(buf).png().toFile(new URL(`${name}.png`, OUT).pathname);
  else await sharp(buf).resize({ width: SET.width }).webp({ quality: 78 }).toFile(new URL(`${name}.webp`, OUT).pathname);
  console.log("ok", name);
}

const names = picked.length ? picked : Object.keys(SHOTS);
const results = await Promise.allSettled(names.map(gen));
results.forEach((r) => r.status === "rejected" && console.error(r.reason.message));
