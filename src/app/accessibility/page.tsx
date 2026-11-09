import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Accessibility statement", description: "Cognixlab’s commitment to an accessible website and how to report a problem.", alternates: { canonical: "/accessibility" } };

export default function Accessibility() {
  return (
    <LegalPage title="Accessibility statement" lead="We want everyone to be able to use this site." updated="October 31, 2026">
      <p>We aim to meet WCAG 2.2 level AA. This site supports keyboard navigation, visible focus, screen-reader labels, sufficient color contrast and reduced motion: if your device asks for less motion, animations and smooth scrolling are turned off.</p>
      <h2>Known limitations</h2>
      <p>The booking calendar is provided by a third party (Calendly). If it doesn’t work for you, email <a href={`mailto:${site.email}`}>{site.email}</a> or call <a href={site.phoneHref}>{site.phone}</a> and we’ll book the call for you.</p>
      <h2>Report a problem</h2>
      <p>Tell us what page and what went wrong at <a href={`mailto:${site.email}`}>{site.email}</a>. We aim to reply within two business days.</p>
    </LegalPage>
  );
}
