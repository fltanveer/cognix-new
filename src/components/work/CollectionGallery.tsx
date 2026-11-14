"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CollectionItem } from "@/content/site";
import { useLenis } from "@/components/motion/SmoothScroll";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import "./collection.css";

/**
 * A body of separate designs shown as what it is: a staggered wall of full pages, each for a different
 * client. Columns sit at different heights and drift at different speeds as you scroll. Hovering a frame
 * scrolls through its page; pressing it opens the whole page in a viewer (with the live link for sites).
 */
export function CollectionGallery({ items, kind }: { items: CollectionItem[]; kind: "designs" | "sites" }) {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<CollectionItem | null>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]");
      if (prefersReducedMotion()) return;
      // staggered entrance: tiles rise in, row by row
      gsap.set(tiles, { y: 70, autoAlpha: 0 });
      tiles.forEach((t, i) =>
        gsap.to(t, { y: 0, autoAlpha: 1, duration: 1.1, ease: "expo.out", delay: (i % 3) * 0.12, scrollTrigger: { trigger: t, start: "top 92%", once: true } })
      );
      // columns drift at different speeds (desktop only)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-col]").forEach((col) => {
          const speed = Number(col.dataset.col);
          gsap.fromTo(col, { y: 40 * speed }, { y: -40 * speed, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  // The viewer: a native modal dialog; page scroll is paused while it's open.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open) {
      if (!d.open) d.showModal();
      lenis?.stop();
      d.querySelector<HTMLElement>(".cg-view-scroll")?.scrollTo(0, 0);
    } else if (d.open) d.close();
    if (!open) lenis?.start();
  }, [open, lenis]);

  // Three columns on desktop, two on tablet, one on phones: distributed round-robin so reading order holds.
  const cols = (n: number) => Array.from({ length: n }, (_, c) => items.filter((_, i) => i % n === c));

  // The first row is above the fold: load it first (fixes the LCP warning).
  const tile = (it: CollectionItem) => (
    <figure key={it.name} data-tile="" className="cg-tile">
      <button type="button" className="cg-frame group" onClick={() => setOpen(it)} aria-label={`Open the full ${it.name} page`}>
        <span className="cg-chrome" aria-hidden="true">
          <i />
          <i />
          <i />
          <span className="cg-url">{it.url ? it.url.replace(/^https?:\/\//, "").replace(/\/$/, "") : it.name}</span>
        </span>
        <span className="cg-viewport">
          <span
            className="cg-page"
            style={{ ["--shift" as string]: `-${Math.max(0, (1 - 1600 / it.h) * 100).toFixed(2)}%`, ["--dur" as string]: `${Math.min(14, it.h / 700).toFixed(1)}s` }}
          >
            <Image src={it.src} alt={`${it.name} ${kind === "sites" ? "website" : "landing page"}, full page`} width={1280} height={it.h} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" priority={items.indexOf(it) < 3} />
          </span>
          <span className="cg-hint" aria-hidden="true">
            Hover to scroll · click to open
          </span>
        </span>
      </button>
      <figcaption className="cg-cap">
        <span className="min-w-0">
          <b>{it.name}</b>
          <em>
            {it.category}
            {it.timeline ? ` · ${it.timeline}` : ""}
          </em>
        </span>
        {it.url ? (
          <a href={it.url} target="_blank" rel="noopener" className="cg-visit">
            Visit site <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="cg-tag">Landing page</span>
        )}
      </figcaption>
    </figure>
  );

  return (
    <div ref={root} className="cg">
      {/* desktop: 3 staggered columns */}
      <div className="cg-grid cg-grid--3">
        {cols(3).map((col, c) => (
          <div key={c} data-col={c === 1 ? 1.4 : c === 2 ? 0.6 : 0} className={`cg-col cg-col--${c}`}>
            {col.map(tile)}
          </div>
        ))}
      </div>
      {/* tablet: 2 staggered columns */}
      <div className="cg-grid cg-grid--2">
        {cols(2).map((col, c) => (
          <div key={c} className={`cg-col cg-col--${c}`}>
            {col.map(tile)}
          </div>
        ))}
      </div>
      {/* phones: one column */}
      <div className="cg-grid cg-grid--1">{items.map(tile)}</div>

      <dialog ref={dialog} className="cg-view" data-lenis-prevent="" onClose={() => setOpen(null)} onClick={(e) => e.target === dialog.current && setOpen(null)} aria-label={open ? `${open.name}, full page` : undefined}>
        {open && (
          <div className="cg-view-panel">
            <div className="cg-view-bar">
              <span className="min-w-0">
                <b>{open.name}</b>
                <em>
                  {open.category}
                  {open.timeline ? ` · ${open.timeline}` : ""}
                </em>
              </span>
              <span className="flex items-center gap-2">
                {open.url && (
                  <a href={open.url} target="_blank" rel="noopener" className="btn btn-primary btn-sm">
                    Visit live site
                  </a>
                )}
                <button type="button" className="cg-close" onClick={() => setOpen(null)} aria-label="Close">
                  ✕
                </button>
              </span>
            </div>
            <div className="cg-view-scroll" data-lenis-prevent="">
              <Image src={open.src} alt={`${open.name}, full page`} width={1280} height={open.h} sizes="(min-width: 1100px) 1000px, 96vw" />
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
