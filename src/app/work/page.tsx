import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WorkIndex } from "@/components/work/WorkIndex";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Work: Products, Results, Product Design and Sites",
  description:
    "Cognixlab work: AI vehicle inspection in under two minutes, a scan-to-Revit engine, page-one SEO results, product design for clients, landing pages and live sites.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageHero art="case-studies"
        title="Work"
        lead="Products we built, results we measured, design for clients, and collections of landing pages and live sites. Each entry says plainly what it is."
        crumbs={[{ label: "Home", href: "/" }, { label: "Work", href: "/work" }]}
      />
      <WorkIndex />
      <CtaBand title="Have a similar problem?" source="work" />
    </>
  );
}
