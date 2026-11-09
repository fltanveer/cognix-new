import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Privacy policy", description: "How Cognixlab collects, uses and protects personal information submitted through cognixlab.co.", alternates: { canonical: "/privacy" } };

// Plain-language baseline. Have counsel review before launch.
export default function Privacy() {
  return (
    <LegalPage title="Privacy policy" lead="What we collect through this website, why, and what you can ask us to do with it." updated="October 31, 2026">
      <h2>Who we are</h2>
      <p>{site.legalName} (“Cognixlab”, “we”) is based at {site.address.street}, {site.address.city}, {site.address.region} {site.address.zip}, USA. Contact us about privacy at <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Details you send through our forms: name, work email, company website, your message and an optional budget range.</li>
        <li>Booking details you enter in our scheduling tool (Calendly) when you book a call.</li>
        <li>Basic usage data from analytics tools, such as pages visited and device type, if you allow analytics cookies.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To reply to you and run the call you booked.</li>
        <li>To send the guide you requested.</li>
        <li>To understand which pages are useful so we can improve the site.</li>
      </ul>
      <p>We don’t sell personal information. We don’t use what you send us to train AI models.</p>
      <h2>Who processes it</h2>
      <p>We use service providers to host this website, schedule calls, store leads and measure site usage. They process data on our behalf under their own security and privacy terms.</p>
      <h2>How long we keep it</h2>
      <p>We keep enquiry and booking details for as long as needed to respond and follow up, and for up to 24 months afterwards unless you ask us to delete them sooner.</p>
      <h2>Your choices</h2>
      <p>You can ask us to access, correct or delete your information, or to stop contacting you, by emailing <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
      <h2>Changes</h2>
      <p>If we change this policy we’ll update the date at the top of this page.</p>
    </LegalPage>
  );
}
