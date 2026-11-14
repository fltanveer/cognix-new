import { Marquee } from "@/components/motion/Marquee";

// Names already published on cognixlab.co. Confirm written permission before launch (see README).
// BudgetNow, Paperade and FacilityFlow are the clients' own logos, recoloured to one tone.
// The others are typographic stand-ins (scripts/cut-logo-sprite.mjs): replace each with the
// client's official logo when it's supplied.
// `h` is the display height, tuned per mark so they read at the same optical size.
const logos = [
  { name: "Auto Inspect", src: "/img/clients/auto-inspect.png", w: 637, h0: 135, h: 30 },
  { name: "PKNail", src: "/img/clients/pknail.png", w: 552, h0: 108, h: 23 },
  { name: "Paperade AI", src: "/img/clients/paperade.png", w: 737, h0: 180, h: 34 },
  { name: "BudgetNow", src: "/img/clients/budgetnow.png", w: 1563, h0: 283, h: 28 },
  { name: "Dr. S. M. G. Kibria", src: "/img/clients/kibria.png", w: 629, h0: 109, h: 31 },
  { name: "PHC Aesthetic & Derma Care", src: "/img/clients/phc.png", w: 364, h0: 289, h: 50 },
  { name: "JVS Management", src: "/img/clients/jvs.png", w: 636, h0: 173, h: 36 },
  { name: "FacilityFlow", src: "/img/clients/facilityflow.svg", w: 156, h0: 26, h: 26 },
];

export function ProofStrip() {
  return (
    <section aria-label="Clients and products we have worked on" className="border-y border-[var(--line)] py-8">
      <div className="container-x mb-6 text-[13px] text-[var(--ink-3)]">Clients and products we’ve built for</div>
      <Marquee
        speed={36}
        dots={false}
        items={logos.map((l) => (
          <span key={l.name} className="client-logo">
            {/* Explicit size so the marquee can measure its track before the images load. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.src} alt={l.name} width={l.w} height={l.h0} style={{ height: l.h, width: "auto" }} loading="eager" decoding="async" />
          </span>
        ))}
      />
    </section>
  );
}
