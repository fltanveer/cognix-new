import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Terms of use", description: "Terms for using the cognixlab.co website.", alternates: { canonical: "/terms" } };

// Plain-language baseline for website use only (client work is governed by signed agreements). Have counsel review before launch.
export default function Terms() {
  return (
    <LegalPage title="Terms of use" lead="The rules for using this website. Client projects are covered by separate written agreements." updated="October 31, 2026">
      <h2>Using this site</h2>
      <p>You may browse and share content from cognixlab.co for your own information. Don’t misuse the site, attempt to disrupt it, or submit false information through our forms.</p>
      <h2>Content</h2>
      <p>Text, design and images on this site belong to {site.legalName} or are used with permission. Client names and project material are shown with their permission and remain theirs.</p>
      <h2>No professional advice</h2>
      <p>Articles and examples on this site are general information, not advice for your specific situation. Results described in case studies depend on each client’s circumstances.</p>
      <h2>Prices</h2>
      <p>Prices on this site are starting points in US dollars. A project is only agreed once we both sign a written proposal or contract.</p>
      <h2>Liability</h2>
      <p>We work to keep this site accurate and available, but we provide it as is and can’t guarantee it will always be error-free.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the Commonwealth of Massachusetts.</p>
      <h2>Contact</h2>
      <p><a href={`mailto:${site.email}`}>{site.email}</a></p>
    </LegalPage>
  );
}
