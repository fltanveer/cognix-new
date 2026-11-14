import Link from "next/link";
import { BookButton } from "@/components/booking/Booking";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";

export function CtaBand({
  title = "Have a process that eats your team's week?",
  body = "Book a Workflow Review. We map one workflow with you and tell you honestly whether AI, automation or nothing is the right fix.",
  secondary = { label: "See our work", href: "/work" },
  source = "cta-band",
}: {
  title?: string;
  body?: string;
  secondary?: { label: string; href: string };
  source?: string;
}) {
  return (
    <section className="section tone-lime relative overflow-hidden" aria-labelledby="cta-band-title">
      <div className="pointer-events-none absolute inset-0 blueprint opacity-70" aria-hidden="true" />
      <div className="container-x relative">
        <div className="grid items-end gap-10 md:grid-cols-[1.5fr_1fr]">
          <SplitHeading id="cta-band-title" text={title} className="t-d1 max-w-[16ch]" />
          <Reveal variant="rise" stagger={0.08} className="space-y-6">
            <p className="t-lead text-[var(--ink-2)]">{body}</p>
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <BookButton source={source} />
              </Magnetic>
              <Link href={secondary.href} className="btn btn-ghost">
                {secondary.label}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
