/**
 * SAMPLE TESTIMONIALS — LAYOUT FILLER ONLY. NOT REAL CLIENTS.
 *
 * These exist so the testimonial rows can be designed at full density before Cognixlab collects more quotes.
 * They are attributed to roles and company types, never to invented people, and render with a visible "Sample" badge.
 * Production builds drop them automatically (see `showSampleTestimonials`). Replace them with real, permissioned quotes.
 */
export type SampleTestimonial = { text: string; role: string; org: string; service: string };

export const sampleTestimonials: SampleTestimonial[] = [
  {
    text: "We used to re-key every inspection into three systems. Now the report lands in the claim file before the adjuster is back in the car.",
    role: "Operations director",
    org: "Regional insurance inspection firm",
    service: "AI & automation",
  },
  {
    text: "The assessment told us not to automate half of what we asked for. That honesty is why we signed the pilot.",
    role: "COO",
    org: "Property management company, Boston",
    service: "Workflow Assessment",
  },
  {
    text: "Our modelers stopped tracing point clouds by hand. The time went straight back into design work.",
    role: "BIM manager",
    org: "Architecture practice, Cambridge",
    service: "Custom software",
  },
  {
    text: "Friday reporting used to take most of a day. It now builds itself overnight and someone just checks it.",
    role: "Finance lead",
    org: "Logistics startup, New York",
    service: "AI & automation",
  },
  {
    text: "They demoed working software every two weeks. We always knew exactly where the budget was going.",
    role: "Founder",
    org: "B2B SaaS company",
    service: "Custom software",
  },
  {
    text: "New patients now find us on Maps before they find the hospital group down the road.",
    role: "Practice manager",
    org: "Specialist clinic, Massachusetts",
    service: "SEO & growth",
  },
  {
    text: "Approvals stopped living in one person's inbox. Nothing waits for a vacation to end anymore.",
    role: "Head of operations",
    org: "Construction subcontractor",
    service: "AI & automation",
  },
  {
    text: "The UX review found the exact screen where trial users were giving up. One redesign later, they stopped.",
    role: "Product lead",
    org: "Fintech app",
    service: "Product & UX",
  },
  {
    text: "Handover was real: runbooks, monitoring, and a team that answered the one question we had a month later.",
    role: "IT manager",
    org: "Healthcare group",
    service: "AI & automation",
  },
];

/** Samples show in development (and in a preview build if explicitly enabled), never in a default production build. */
export const showSampleTestimonials =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_SAMPLE_TESTIMONIALS === "1";
