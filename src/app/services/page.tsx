import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ServicesList } from "@/components/home/ServicesList";
import { Method } from "@/components/home/Method";
import { CtaBand } from "@/components/CtaBand";
import { QuoteScrub } from "@/components/QuoteScrub";
import { testimonials } from "@/content/site";

export const metadata: Metadata = {
  title: "Services: AI Automation, Custom Software, UX & SEO",
  description:
    "Four services, one goal: less manual work and more of the right customers. AI & workflow automation, custom software, product & UX design, and SEO & growth.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero art="services"
        title="Four services. One goal: less manual work."
        lead="Most clients start with automation and add the rest only when it helps. Each service has a fixed first step, a clear deliverable and a price signal before you talk to us."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }]}
      />
      <section className="section tone-light">
        <div className="container-x">
          <ServicesList />
        </div>
      </section>
      <Method title="How every engagement runs." />
      <QuoteScrub text={testimonials[2].text} name={testimonials[2].name} title={testimonials[2].title} />
      <CtaBand title="Not sure which one you need?" body="That’s what the Workflow Review is for. One call, one workflow, an honest recommendation." source="services" />
    </>
  );
}
