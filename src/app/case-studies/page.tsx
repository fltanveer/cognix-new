import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CaseFilter } from "@/components/work/CaseFilter";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Case Studies: AI, Software, UX & SEO Results",
  description:
    "Case studies from Cognixlab: AI vehicle inspection in under two minutes, a scan-to-Revit engine, and page-one SEO results. Filter by service and industry.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero art="case-studies"
        title="Case studies"
        lead="What changed for each client, and how we measured it. Product design samples are labelled as samples."
        crumbs={[{ label: "Home", href: "/" }, { label: "Case studies", href: "/case-studies" }]}
      />
      <CaseFilter />
      <CtaBand title="Have a similar problem?" source="case-studies" />
    </>
  );
}
