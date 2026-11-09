import { Marquee } from "@/components/motion/Marquee";

// Names already published on cognixlab.co. Confirm written permission before launch (see README).
const names = ["Auto Inspect", "PKNail", "Paperade AI", "BudgetNow", "Dr. S. M. G. Kibria", "PHC Aesthetic & Derma Care", "JVS Management"];

export function ProofStrip() {
  return (
    <section aria-label="Clients and products we have worked on" className="border-y border-[var(--line)] py-7">
      <div className="container-x mb-4 text-[13px] text-[var(--ink-3)]">Clients and products we’ve built for</div>
      <Marquee
        speed={36}
        items={names.map((n) => (
          <span key={n} className="whitespace-nowrap text-[clamp(22px,2.6vw,34px)] tracking-[-0.03em] text-[var(--ink-2)]">
            {n}
          </span>
        ))}
      />
    </section>
  );
}
