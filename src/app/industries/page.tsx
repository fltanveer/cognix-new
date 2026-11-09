import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Industries } from "@/components/home/Industries";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Industries: Insurance, AEC & Healthcare Practices",
  description: "Cognixlab focuses on three industries where we have shipped work: insurance and inspections, architecture/engineering/construction, and healthcare practices.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero art="industries"
        title="Industries we know from the inside"
        lead="We focus where we have shipped real work. If you’re outside these, we’ll still take the Workflow Review call and tell you honestly whether we’re the right fit."
        crumbs={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }]}
      />
      <Industries />
      <CtaBand source="industries" />
    </>
  );
}
