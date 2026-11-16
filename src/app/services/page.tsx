import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ServicesList } from "@/components/home/ServicesList";
import { Method } from "@/components/home/Method";
import { CtaBand } from "@/components/CtaBand";
import { QuoteScrub } from "@/components/QuoteScrub";
import { testimonials } from "@/content/site";

export const metadata: Metadata = {
  title: "Services: AI Automation, Custom Software & Product UX",
  description:
    "Three services, one goal: less manual work. AI & workflow automation, custom software, and product & UX design, plus SEO & growth as an add-on for healthcare practices.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero art="services"
        title="Three services. One goal: less manual work."
        lead="Most clients start with automation and add the rest only when it helps. Each service has a fixed first step, a clear deliverable and a price signal before you talk to us. SEO & Growth is an add-on for healthcare practices."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }]}
      />
      <section className="section tone-light">
        <div className="container-x">
          <ServicesList />
        </div>
      </section>
      <Method title="How every engagement runs." />
      <QuoteScrub text={testimonials[0].text} name={testimonials[0].name} title={testimonials[0].title} />
      <CtaBand title="Not sure which one you need?" body="That’s what the Workflow Review is for. One call, one workflow, an honest recommendation." source="services" />
    </>
  );
}
