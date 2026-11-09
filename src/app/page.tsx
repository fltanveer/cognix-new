import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ProofStrip } from "@/components/home/ProofStrip";
import { Rewire } from "@/components/home/Rewire";
import { RewireArt } from "@/components/home/RewireArt";
import { ServicesList } from "@/components/home/ServicesList";
import { WorkRail } from "@/components/home/WorkRail";
import { Method } from "@/components/home/Method";
import { Industries } from "@/components/home/Industries";
import { PricingRoute } from "@/components/home/PricingRoute";
import { Team } from "@/components/Team";
import { TestimonialRows } from "@/components/TestimonialRows";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";
import { InspectBay } from "@/components/home/InspectBay";
import { InspectArt } from "@/components/home/InspectArt";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { homeFaqs } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: "AI Workflow Automation & Custom Software | Cognixlab, Boston & NYC" },
  description:
    "Cognixlab connects disconnected tools and automates manual work for growing companies in Boston and New York, starting with a fixed-price workflow assessment.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <Rewire art={<RewireArt />} />

      <section className="section" aria-labelledby="services-title">
        <div className="container-x">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SplitHeading id="services-title" text="What we do, in the order clients usually need it." className="t-d2 max-w-[20ch]" />
            <Link href="/services" className="btn btn-ghost btn-sm">
              All services
            </Link>
          </div>
          <ServicesList />
        </div>
      </section>

      <WorkRail />

      <section className="section" aria-labelledby="run-title">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-6">
          <div>
            <SplitHeading id="run-title" text="Four photos in. A signed-off report out." className="t-d2 max-w-[14ch]" />
            <Reveal variant="rise" stagger={0.08} className="mt-6 space-y-4 text-[var(--ink-2)]">
              <p>
                Auto Inspect replaces manual photo review for insurers. Agents follow guided capture on a phone, the system checks quality,
                detects and annotates damage, and issues a time-stamped report.
              </p>
              <p>
                <Link href="/case-studies/auto-inspect" className="link-u text-[var(--ink)]">
                  Read the Auto Inspect case study →
                </Link>
              </p>
            </Reveal>
          </div>
          <InspectBay art={<InspectArt />} />
        </div>
      </section>

      <Method />
      <Industries />
      <PricingRoute />
      <Team />
      <TestimonialRows />
      <Faq items={homeFaqs} />
      <CtaBand source="home-closing" />
    </>
  );
}
