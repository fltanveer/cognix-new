import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "How we handle your data",
  description: "NDAs, access controls, personal-data masking and no training on client data: how Cognixlab handles client data on AI and software projects.",
  alternates: { canonical: "/data-handling" },
};

export default function DataHandling() {
  return (
    <LegalPage title="How we handle your data" lead="The short version: your data stays yours, stays where you approve, and is never used to train anything." updated="October 31, 2026">
      <h2>Before we see anything</h2>
      <ul>
        <li>We sign a mutual NDA before discovery.</li>
        <li>We agree in writing which systems and datasets we may access, and for how long.</li>
      </ul>
      <h2>Access</h2>
      <ul>
        <li>Least-privilege accounts, created in your systems where possible, removed at the end of the engagement.</li>
        <li>Only the people named on the project get access.</li>
      </ul>
      <h2>Where data lives</h2>
      <ul>
        <li>In infrastructure you control or approve: your cloud account, a private network, or a vendor you have signed with.</li>
        <li>Where a project needs it, models can run inside your own environment so data never leaves it.</li>
      </ul>
      <h2>Personal data</h2>
      <ul>
        <li>Personal and sensitive fields are masked or removed before they reach a language model.</li>
        <li>We keep logs of what the AI system processed so you can audit it.</li>
      </ul>
      <h2>Models and training</h2>
      <ul>
        <li>We never use client data to train models for anyone else.</li>
        <li>We choose model providers whose terms exclude training on your inputs, and tell you which ones we use.</li>
      </ul>
      <h2>At the end</h2>
      <p>We hand over code, documentation and credentials, and delete any copies of your data we held, confirmed in writing.</p>
      <p>Questions: <a href={`mailto:${site.email}`}>{site.email}</a></p>
    </LegalPage>
  );
}
