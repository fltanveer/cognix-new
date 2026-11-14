// One-off: converts the WordPress posts in src/content/posts.ts into Sanity Portable Text
// (src/sanity/legacy/posts.json). Images keep their /img/blog/... path in `_legacySrc`;
// the Studio's "Import old posts" tool uploads them and swaps in real image references.
import { readFileSync, writeFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { htmlToBlocks } from "@portabletext/block-tools";
import { Schema } from "@sanity/schema";
import { builtinTypes } from "@sanity/schema/_internal";

const ts = readFileSync(new URL("../src/content/posts.ts", import.meta.url), "utf8");
const posts = JSON.parse(ts.slice(ts.indexOf("= [") + 2, ts.lastIndexOf("]") + 1));

const schema = Schema.compile({
  name: "legacy",
  types: [
    ...builtinTypes,
    {
      name: "post",
      type: "document",
      fields: [
        {
          name: "body",
          type: "array",
          of: [
            {
              type: "block",
              styles: [{ value: "normal" }, { value: "h2" }, { value: "h3" }, { value: "h4" }, { value: "blockquote" }],
              lists: [{ value: "bullet" }, { value: "number" }],
              marks: {
                decorators: [{ value: "strong" }, { value: "em" }],
                annotations: [{ name: "link", type: "object", fields: [{ name: "href", type: "url" }] }],
              },
            },
            { type: "image", fields: [{ name: "alt", type: "string" }, { name: "caption", type: "string" }] },
          ],
        },
      ],
    },
  ],
});
const bodyType = schema.get("post").fields.find((f) => f.name === "body").type;

let n = 0;
const key = () => `k${(n++).toString(36).padStart(6, "0")}`;

const imageRule = {
  deserialize(el, _next, block) {
    const tag = el.tagName?.toLowerCase();
    if (tag !== "figure" && tag !== "img") return undefined;
    const img = tag === "img" ? el : el.querySelector("img");
    if (!img) return undefined;
    const alt = (img.getAttribute("alt") || "").replace(/-/g, " ").trim();
    return block({ _type: "image", _key: key(), _legacySrc: img.getAttribute("src"), ...(alt ? { alt } : {}) });
  },
};

const out = posts.map((p) => {
  const body = htmlToBlocks(p.html, bodyType, {
    parseHtml: (html) => new JSDOM(html).window.document,
    rules: [imageRule],
    keyGenerator: key,
  });
  return {
    slug: p.slug,
    title: p.title,
    date: p.date,
    category: p.category,
    cover: p.cover,
    excerpt: p.excerpt,
    cta: p.cta,
    readMins: p.readMins,
    body,
  };
});

writeFileSync(new URL("../src/sanity/legacy/posts.json", import.meta.url), JSON.stringify(out, null, 1));
for (const p of out) {
  const kinds = p.body.reduce((a, b) => ((a[b._type === "block" ? b.style + (b.listItem ? ":" + b.listItem : "") : b._type] = (a[b._type === "block" ? b.style + (b.listItem ? ":" + b.listItem : "") : b._type] || 0) + 1), a), {});
  console.log(p.slug, JSON.stringify(kinds));
}
