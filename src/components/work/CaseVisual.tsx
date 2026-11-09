"use client";

import { Phone, Scroll, Stage, Window, type Act } from "@/stageshow/kit";
import type { Visual } from "@/content/site";
import "./case-visual.css";

/**
 * Staged covers for case studies, built on the Stageshow kit (src/stageshow, MIT).
 * Real design screens from each project, never redrawn: phones for apps, an app window for
 * SaaS, scrolling browser windows for pages. One story per stage, looping while on screen;
 * reduced motion and thumbnails get the poster (the first screens, in place).
 *
 * Framing follows the kit's rules: one hero in focus by depth, neighbours are filler the stage
 * cuts, heroes run off the bottom on the project's own ground (no plate, no floating device).
 */
type Variant = "card" | "card-md" | "hero";
const SIZE: Record<Variant, { w: number; h: number }> = {
  card: { w: 704, h: 484 },
  "card-md": { w: 640, h: 480 },
  hero: { w: 1200, h: 600 },
};

/** The hero's compact design: below 720px of container it recomposes at 4:3 rather than shrinking the 2:1 scene. */
const COMPACT = { below: 720, width: SIZE["card-md"].w, height: SIZE["card-md"].h };
const stageSize = (variant: Variant) => ({
  width: SIZE[variant].w,
  height: SIZE[variant].h,
  compact: variant === "hero" ? COMPACT : undefined,
});
/** The geometry in use: the hero's compact layout borrows the 4:3 card composition. */
const eff = (variant: Variant, layout: string): Variant => (variant === "hero" && layout === "compact" ? "card-md" : variant);

type S = { on: boolean; i: number };
const initial: S = { on: false, i: 0 };
const poster: S = { on: true, i: 0 };

/** Bring the scene in, then advance one screen every `hold` ms, forever. The index never wraps, so nothing ever jumps. */
function stepper(hold: number) {
  return async (a: Act<S>) => {
    await a.wait(120);
    a.put({ on: true });
    for (let i = 1; ; i++) {
      await a.wait(hold);
      await a.set({ i });
    }
  };
}

const mod = (v: number, n: number) => ((v % n) + n) % n;

/**
 * A rolling window of three slides keyed by their position in an endless sequence:
 * the one leaving, the one shown, the one arriving. Each slide only ever moves left;
 * a new one mounts out of sight on the right, the old one unmounts out of sight on the left.
 */
function Track({ srcs, i }: { srcs: string[]; i: number }) {
  return (
    <div className="cv-track">
      {[i - 1, i, i + 1].map((v) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={v}
          src={srcs[mod(v, srcs.length)]}
          alt=""
          decoding="async"
          draggable={false}
          data-current={v === i || undefined}
          style={{ transform: `translateX(${(v - i) * 100}%)` }}
        />
      ))}
    </div>
  );
}

/** Rotate a list so each phone starts on a different screen. */
const rot = <T,>(arr: T[], by: number) => arr.map((_, k) => arr[(k + by) % arr.length]);

function Phones({ v, variant }: { v: Extract<Visual, { kind: "phones" }>; variant: Variant }) {
  return (
    <Stage fill {...stageSize(variant)} initial={initial} poster={poster} script={stepper(2600)} className="cv">
      {(s, _rect, layout) => {
        const g = eff(variant, layout);
        const { w } = SIZE[g];
        const hero = g === "hero";
        const cw = hero ? 290 : g === "card" ? 236 : 226;
        const sw = hero ? 250 : g === "card" ? 200 : 190;
        const gap = hero ? -40 : -34; // side phones tuck behind the hero's edge
        const cx = (w - cw) / 2;
        const top = hero ? 54 : 40;
        const drop = hero ? 64 : 52;
        return (
          <div className="cv-scene" data-on={s.on || undefined}>
            {[
              { k: "l", x: cx - sw - gap, y: top + drop, pw: sw, list: rot(v.screens, 4), lag: 1 },
              { k: "r", x: cx + cw + gap, y: top + drop, pw: sw, list: rot(v.screens, 2), lag: 2 },
              { k: "c", x: cx, y: top, pw: cw, list: v.screens.slice(0, 4), lag: 0 },
            ].map((p) => (
              <div key={p.k} className={`cv-phone cv-phone--${p.k}`} style={{ left: p.x, top: p.y, ["--lag" as string]: p.lag }}>
                <Phone width={p.pw} frame="pro" status={false} dark={v.dark}>
                  <div className="cv-screen">
                    <Track srcs={p.list.slice(0, 4)} i={s.i} />
                  </div>
                </Phone>
              </div>
            ))}
          </div>
        );
      }}
    </Stage>
  );
}

function AppWindow({ v, variant }: { v: Extract<Visual, { kind: "window" }>; variant: Variant }) {
  return (
    <Stage fill {...stageSize(variant)} initial={initial} poster={poster} script={stepper(3000)} className="cv">
      {(s, _rect, layout) => {
        const hero = eff(variant, layout) === "hero";
        const inset = hero ? 72 : 40;
        return (
          <div className="cv-scene" data-on={s.on || undefined}>
            <Window title={v.title} className="cv-win cv-win--hero" style={{ left: inset, top: inset, width: hero ? 1220 : 780, height: hero ? 760 : 520 }}>
              <div className="cv-winbody">
                <Track srcs={v.screens} i={s.i} />
              </div>
            </Window>
          </div>
        );
      }}
    </Stage>
  );
}

/** Where each page stops, as a fraction of its reach; the last stop scrolls back up to the top, a visible cause for the loop. */
const STOPS = [0.32, 0.62, 1];

function Pages({ v, variant }: { v: Extract<Visual, { kind: "pages" }>; variant: Variant }) {
  const pages = v.pages.slice(0, 3);
  const order = pages.length === 1 ? [0] : [1, 2, 0]; // hero window rendered last so it sits in front
  async function script(a: Act<S>) {
    await a.wait(120);
    a.put({ on: true });
    for (;;) {
      for (let step = 0; step <= STOPS.length; step++) {
        await a.wait(1500);
        // the hero window leads; its neighbours follow a beat apart, not awaited
        pages.forEach((_, k) => {
          const to = step < STOPS.length ? `pg${k}-${step}` : 0;
          setTimeout(() => void a.scroll(`pg${k}`, to, { duration: 1700 }).catch(() => {}), k * 420);
        });
        await a.wait(1700 + 420 * (pages.length - 1));
      }
    }
  }
  return (
    <Stage fill {...stageSize(variant)} initial={initial} poster={poster} script={script} className="cv">
      {(s, _rect, layout) => {
        const g = eff(variant, layout);
        const { w, h } = SIZE[g];
        const hero = g === "hero";
        const ww = hero ? 760 : 470;
        const gap = hero ? 32 : 22;
        const top = hero ? 56 : 40;
        const cx = (w - ww) / 2;
        const slots = pages.length === 1 ? [cx] : [cx, cx - ww - gap, cx + ww + gap];
        return (
          <div className="cv-scene" data-on={s.on || undefined}>
            {order.map((k) => {
              const p = pages[k];
              const reach = p.reach ?? 0.85;
              return (
                <Window
                  key={p.src}
                  url={p.url}
                  title={p.url ? undefined : p.title}
                  className={`cv-win ${k === 0 ? "cv-win--hero" : "cv-win--side"}`}
                  style={{ left: slots[k], top, width: ww, height: h - top + 60 }}
                >
                  <Scroll name={`pg${k}`} bar="overlay" className="cv-pagebody">
                    <div className="cv-pagewrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.src} alt="" decoding="async" draggable={false} className="cv-page" />
                      {STOPS.map((f, idx) => (
                        <span key={idx} className="cv-mark" data-target={`pg${k}-${idx}`} style={{ top: `${f * reach * 100}%` }} />
                      ))}
                    </div>
                  </Scroll>
                </Window>
              );
            })}
          </div>
        );
      }}
    </Stage>
  );
}

export function CaseVisual({ visual, variant = "card", alt }: { visual: Visual; variant?: Variant; alt: string }) {
  return (
    <div className={`cv-host cv-host--${variant}`} role="img" aria-label={alt} style={{ ["--cv-ground" as string]: visual.ground }}>
      {visual.kind === "phones" && <Phones v={visual} variant={variant} />}
      {visual.kind === "window" && <AppWindow v={visual} variant={variant} />}
      {visual.kind === "pages" && <Pages v={visual} variant={variant} />}
    </div>
  );
}
