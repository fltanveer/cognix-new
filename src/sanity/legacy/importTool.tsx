"use client";

/**
 * One-off Studio tool: copies the 7 posts migrated from WordPress into Sanity, uploading their
 * images from the site's /img/blog folder. Safe to run twice (documents are replaced, images de-duplicated).
 * Remove this tool and posts.json once the import is done.
 */
import { useState } from "react";
import { definePlugin, useClient } from "sanity";
import legacy from "./posts.json";

type LegacyBlock = { _type: string; _key: string; _legacySrc?: string; alt?: string; [k: string]: unknown };
type LegacyPost = (typeof legacy)[number];

function ImportTool({ apiVersion }: { apiVersion: string }) {
  const client = useClient({ apiVersion });
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const say = (line: string) => setLog((l) => [...l, line]);

  async function upload(src: string) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`Couldn't load ${src} (${res.status})`);
    const asset = await client.assets.upload("image", await res.blob(), { filename: src.split("/").pop() });
    return asset._id;
  }

  async function importPost(p: LegacyPost) {
    const coverRef = await upload(p.cover);
    const body = [];
    for (const b of p.body as LegacyBlock[]) {
      if (b._type === "image" && b._legacySrc) {
        body.push({ _type: "image", _key: b._key, ...(b.alt ? { alt: b.alt } : {}), asset: { _type: "reference", _ref: await upload(b._legacySrc) } });
      } else body.push(b);
    }
    await client.createOrReplace({
      _id: `post-${p.slug}`,
      _type: "post",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      publishedAt: p.date,
      category: p.category,
      cover: { _type: "image", asset: { _type: "reference", _ref: coverRef } },
      excerpt: p.excerpt,
      body,
      cta: p.cta,
      readMins: p.readMins,
    });
  }

  async function run() {
    setBusy(true);
    setLog([]);
    let ok = 0;
    for (const p of legacy) {
      try {
        say(`Importing “${p.title}”…`);
        await importPost(p);
        ok++;
        say(`  ✓ published at /insights/${p.slug}`);
      } catch (e) {
        say(`  ✗ ${(e as Error).message}`);
      }
    }
    say(ok === legacy.length ? `Done: all ${ok} posts imported.` : `Finished with errors: ${ok} of ${legacy.length} imported.`);
    setBusy(false);
  }

  return (
    <div style={{ padding: 32, maxWidth: 720, fontFamily: "inherit" }}>
      <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Import old WordPress posts</h1>
      <p style={{ opacity: 0.75, margin: "0 0 20px", lineHeight: 1.5 }}>
        Copies the {legacy.length} posts from the old site into Sanity with their images, and publishes them. Running it again replaces them
        with the original versions, so only use it once.
      </p>
      <button
        type="button"
        onClick={run}
        disabled={busy}
        data-testid="legacy-import-run"
        style={{ padding: "10px 18px", borderRadius: 6, border: 0, background: "#2276fc", color: "#fff", fontSize: 15, cursor: busy ? "wait" : "pointer" }}
      >
        {busy ? "Importing…" : `Import ${legacy.length} posts`}
      </button>
      <pre data-testid="legacy-import-log" style={{ marginTop: 24, whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.6 }}>
        {log.join("\n")}
      </pre>
    </div>
  );
}

export const legacyImportTool = definePlugin<{ apiVersion: string }>(({ apiVersion }) => ({
  name: "legacy-import",
  tools: [{ name: "import-old-posts", title: "Import old posts", component: () => <ImportTool apiVersion={apiVersion} /> }],
}));
