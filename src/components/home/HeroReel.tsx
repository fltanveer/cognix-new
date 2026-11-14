import Image from "next/image";
import { InView } from "@/components/InView";

/**
 * Hero right side: two columns of field photos and proof cards drifting slowly upward, on a loop.
 * Photos are generated (scripts/gen-hero-reel.mjs) and stand for the kind of work, not for clients.
 * Every number on a card is a published case-study result. Decorative: hidden from assistive tech.
 */
type Tile =
  | { kind: "photo"; src: string; tag: string; ratio: string }
  | { kind: "stat"; value: string; label: string; tone: "accent" | "surface" }
  | { kind: "offer" };

const colA: Tile[] = [
  { kind: "photo", src: "inspect", tag: "Front left · dent found", ratio: "3/4" },
  { kind: "stat", value: "1:47", label: "Four photos to an annotated PDF report", tone: "accent" },
  { kind: "photo", src: "clinic", tag: "Intake forms, automated", ratio: "4/5" },
  { kind: "photo", src: "ops", tag: "One view of every tool", ratio: "3/4" },
  { kind: "offer" },
];

const colB: Tile[] = [
  { kind: "photo", src: "scan", tag: "Site scan · point cloud", ratio: "4/5" },
  { kind: "stat", value: "Revit 2026", label: "Scan-to-Revit add-in, live", tone: "surface" },
  { kind: "photo", src: "model", tag: "Native walls, not traced", ratio: "3/4" },
  { kind: "photo", src: "paper", tag: "Re-keyed by hand, today", ratio: "4/5" },
  { kind: "stat", value: "150%+", label: "Organic traffic in four months", tone: "surface" },
  { kind: "photo", src: "adjuster", tag: "Claim photo captured", ratio: "3/4" },
];

function Card({ t, eager }: { t: Tile; eager?: boolean }) {
  if (t.kind === "photo")
    return (
      <div className="reel-photo" style={{ aspectRatio: t.ratio }}>
        <Image src={`/img/hero/${t.src}.webp`} alt="" fill sizes="(min-width: 1024px) 18vw, 0px" priority={eager} className="object-cover" />
        <span className="reel-tag">
          <span className="reel-dot" />
          {t.tag}
        </span>
      </div>
    );
  if (t.kind === "stat")
    return (
      <div className={`reel-stat ${t.tone === "accent" ? "reel-stat--accent" : ""}`}>
        <span className="reel-stat-value">{t.value}</span>
        <span className="reel-stat-label">{t.label}</span>
      </div>
    );
  return (
    <div className="reel-offer">
      <span className="text-[12px] text-[var(--ink-3)]">Start here</span>
      <span className="mt-1 text-[17px] leading-tight text-[var(--ink)]">Workflow Assessment</span>
      <span className="text-[13px] text-[var(--ink-2)]">Two weeks · $4,500 fixed</span>
      <span className="reel-offer-btn">Book a call</span>
    </div>
  );
}

function Column({ tiles, dur, offset, eager }: { tiles: Tile[]; dur: number; offset: number; eager?: boolean }) {
  return (
    <div className="reel-col">
      {/* Two identical halves; the track slides up one half per loop. */}
      <div className="reel-track" style={{ animationDuration: `${dur}s`, animationDelay: `${-offset}s` }}>
        {[0, 1].map((half) => (
          <div key={half} className="reel-half">
            {tiles.map((t, i) => (
              <Card key={i} t={t} eager={eager && half === 0 && i === 0} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroReel() {
  return (
    <InView>
      <div className="hero-reel" aria-hidden="true">
        <Column tiles={colA} dur={62} offset={0} eager />
        <Column tiles={colB} dur={74} offset={20} eager />
      </div>
    </InView>
  );
}
