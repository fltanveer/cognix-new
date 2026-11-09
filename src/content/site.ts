export const site = {
  name: "Cognixlab",
  legalName: "Cognixlab LLC",
  url: "https://cognixlab.co",
  email: "contact@cognixlab.co",
  phone: "+1 781 227 5492",
  phoneHref: "tel:+17812275492",
  address: { street: "301 Binney St", city: "Cambridge", region: "MA", zip: "02142", country: "US" },
  // Existing Calendly event. Create a 30-minute "Workflow Review" event type and swap the URL + minutes.
  booking: {
    url: "https://calendly.com/zakaria-mahmud-bappy/45min",
    minutes: 45,
    label: "Book a Workflow Review",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/cognixlab-co",
    x: "https://x.com/Cognixlab",
    instagram: "https://instagram.com/cognixlab.1/",
    facebook: "https://www.facebook.com/Cognixlab.1",
  },
  positioning:
    "Cognixlab helps growing companies in Boston and New York remove manual work and connect disconnected tools, starting with a fixed-price workflow assessment and moving to a focused AI or software pilot only when the numbers justify it.",
};

export const nav = [
  { label: "Services", href: "/services" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Industries", href: "/industries" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
];

export type Service = {
  slug: string;
  name: string;
  short: string;
  problem: string;
  pain: string[];
  deliverables: string[];
  timeline: { step: string; detail: string }[];
  proofSlug: string;
  proofLine: string;
  priceSignal: string;
  cta: string;
  faqs: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
};

export const services: Service[] = [
  {
    slug: "ai-automation",
    name: "AI & Workflow Automation",
    short: "Find the manual steps that cost you most, then automate the ones where the numbers work.",
    problem: "Your team re-keys the same data into three systems, chases approvals in email, and builds the weekly report by hand.",
    pain: [
      "Same customer data typed into the CRM, the spreadsheet and the invoice",
      "Approvals that live in someone's inbox",
      "Reports assembled by hand every Friday",
      "AI pilots that demoed well and never reached production",
    ],
    deliverables: [
      "Map of one core workflow with the cost of each manual step",
      "Data readiness report: what is clean, what is missing, what is risky",
      "Working proof of concept on your own data",
      "Go / no-go recommendation with a scoped pilot and budget",
      "Production automation or AI agent, integrated with the tools you already use",
      "Monitoring and a handover your team can run",
    ],
    timeline: [
      { step: "Week 1–2", detail: "Workflow Assessment: interviews, process map, data review, proof of concept" },
      { step: "Week 3–8", detail: "Pilot: one workflow automated end to end, measured against the baseline" },
      { step: "Ongoing", detail: "Extend to the next workflow only when the pilot pays for itself" },
    ],
    proofSlug: "auto-inspect",
    proofLine: "Auto Inspect: four-view vehicle inspection to an annotated PDF report in 1 min 47 s.",
    priceSignal: "Workflow Assessment $4,500 fixed · Pilots from $12,000",
    cta: "Scope your assessment",
    faqs: [
      { q: "What if AI isn't the right fix?", a: "Then we say so in the assessment. A lot of manual work disappears with a better integration or a simple rule, and that is cheaper to build and run." },
      { q: "Where does our data go?", a: "It stays in infrastructure you control or approve. We sign an NDA before discovery, mask personal data before it reaches a model, and never use client data to train anything." },
      { q: "Which tools do you integrate with?", a: "Whatever you run today: CRMs, accounting, inboxes, spreadsheets, document stores and internal databases. If it has an API or an export, we can usually connect it." },
    ],
    metaTitle: "AI Workflow Automation for Growing Companies | Cognixlab, Boston",
    metaDescription: "Fixed-price workflow assessment, then a measured AI or automation pilot. Cognixlab removes manual work for growing companies in Boston and New York.",
  },
  {
    slug: "custom-software",
    name: "Custom Software",
    short: "Software that fits how your business actually runs, and talks to everything else you use.",
    problem: "Off-the-shelf tools cover 80% of the job. Your team covers the other 20% with spreadsheets and workarounds.",
    pain: [
      "A core process that no SaaS product handles well",
      "Internal tools held together with exports and macros",
      "A product idea that needs AI built in, not bolted on",
    ],
    deliverables: [
      "Technical scope with architecture diagram and fixed milestones",
      "Web, mobile or desktop application, built and tested in stages",
      "Integrations with your existing systems through their APIs",
      "AI components (vision, document extraction, retrieval) where they earn their place",
      "Documentation, handover and support plan",
    ],
    timeline: [
      { step: "Week 1–2", detail: "Scope, architecture and clickable prototype" },
      { step: "Month 1–4", detail: "Build in two-week increments with a demo at the end of each" },
      { step: "Launch", detail: "Staged rollout, monitoring, and a support plan" },
    ],
    proofSlug: "pknail",
    proofLine: "PKNail 2.0: scan-to-Revit engine, live as a Revit 2026 add-in.",
    priceSignal: "Fixed milestones, priced after a two-week scoping phase",
    cta: "Request a proposal",
    faqs: [
      { q: "Do we own the code?", a: "Yes. You own the code and the infrastructure accounts. We work in your repositories from day one." },
      { q: "Can you take over an existing product?", a: "Yes. We start with a short technical review so you know what you're inheriting before we commit to a plan." },
    ],
    metaTitle: "Custom Software & AI Product Development | Cognixlab, Boston",
    metaDescription: "Custom web, mobile and desktop software with AI built in where it pays off. Fixed milestones, your code, built by Cognixlab in Cambridge, MA.",
  },
  {
    slug: "product-ux",
    name: "Product & UX Design",
    short: "Your product works, but people still struggle with it. We find where and fix it.",
    problem: "Sign-ups don't activate, support tickets repeat the same question, and the team argues about the roadmap without data.",
    pain: [
      "Users drop off at the same step every week",
      "Features that exist but nobody finds",
      "A redesign planned on opinion rather than evidence",
    ],
    deliverables: [
      "UX review of your key flows with prioritized issues",
      "User interviews and behavior analysis",
      "Redesigned flows as a tested Figma prototype",
      "Design system your developers can build from",
    ],
    timeline: [
      { step: "Week 1", detail: "UX review and analytics read-out" },
      { step: "Week 2–4", detail: "Research, redesign and prototype testing" },
      { step: "Week 5+", detail: "Design system and build support" },
    ],
    proofSlug: "auto-inspect",
    proofLine: "Auto Inspect: guided photo capture that non-technical agents complete without training.",
    priceSignal: "Scoped per product after a free UX review call",
    cta: "Book a UX review",
    faqs: [
      { q: "Do you only design, or build too?", a: "Both. Our designers and engineers work in the same team, so what we design is what ships." },
    ],
    metaTitle: "Product & UX Design for SaaS and Internal Tools | Cognixlab",
    metaDescription: "UX reviews, research and product design that improve adoption of software people already pay for. Cognixlab, Cambridge, MA.",
  },
  {
    slug: "seo-growth",
    name: "SEO & Growth",
    short: "Make sure the right people find you, on Google, Maps and AI answer engines.",
    problem: "You're good at what you do, but competitors with weaker work show up first when buyers search.",
    pain: [
      "High-intent searches go to competitors",
      "Weak Google Maps presence in your area",
      "Not mentioned when buyers ask ChatGPT or Google's AI Overview",
    ],
    deliverables: [
      "Technical SEO audit and fixes",
      "Search intent map and content plan",
      "Local SEO and Google Business Profile optimization",
      "Content written for buyers and AI answer engines",
      "Monthly reporting tied to leads, not rankings alone",
    ],
    timeline: [
      { step: "Month 1", detail: "Audit, technical fixes and intent map" },
      { step: "Month 2–4", detail: "Content, local SEO and authority building" },
      { step: "Ongoing", detail: "Reporting and iteration" },
    ],
    proofSlug: "dr-kibria-seo",
    proofLine: "Dr. Kibria: 150%+ organic traffic and page one for 10+ high-intent keywords in four months.",
    priceSignal: "Visibility check free · Monthly programs scoped per market",
    cta: "Get a visibility check",
    faqs: [
      { q: "Is SEO still worth it with AI search?", a: "Yes. AI answer engines draw on the same signals: clear pages, real expertise and consistent business data. We optimize for both." },
    ],
    metaTitle: "SEO, Local SEO & AI Search Visibility | Cognixlab, Boston",
    metaDescription: "Technical SEO, local SEO and content that gets you found on Google, Maps and AI answer engines. Measured by leads, not vanity rankings.",
  },
];

export type Industry = {
  slug: string;
  name: string;
  short: string;
  intro: string;
  problems: string[];
  proofSlugs: string[];
};

export const industries: Industry[] = [
  {
    slug: "insurance-inspections",
    name: "Insurance & inspections",
    short: "Claims and inspection teams buried in photos, forms and back-and-forth.",
    intro: "Inspections and claims run on evidence. When that evidence is scattered across phones, email and PDFs, every claim takes longer and fraud gets easier.",
    problems: [
      "Inconsistent photo evidence from field agents",
      "Manual damage review and report writing",
      "Delays and disputes from unclear documentation",
    ],
    proofSlugs: ["auto-inspect"],
  },
  {
    slug: "architecture-construction",
    name: "Architecture, engineering & construction",
    short: "Firms that turn site scans and drawings into models by hand.",
    intro: "Getting from a site scan to a usable model is still mostly manual. We build tools that move that work into software your team already uses.",
    problems: [
      "Point clouds redrawn by hand in Revit",
      "Hours lost between survey and design",
      "Disconnected tools between site and office",
    ],
    proofSlugs: ["pknail"],
  },
  {
    slug: "healthcare-practices",
    name: "Healthcare practices",
    short: "Clinics and specialists who need patients to find and trust them.",
    intro: "Patients search, compare and decide online before they call. Practices that show up clearly, with real credentials, win those patients.",
    problems: [
      "Invisible for high-intent local searches",
      "Weak Google Maps presence",
      "Front-desk time lost to repeat questions",
    ],
    proofSlugs: ["dr-kibria-seo", "phc-aesthetic"],
  },
];

/**
 * How a case study's cover is staged (rendered by CaseVisual with the Stageshow kit).
 * phones: real app screens in iPhone frames; window: SaaS screens in an app window;
 * pages: long pages scrolling in browser windows (landing pages, live sites).
 */
export type Visual =
  | { kind: "phones"; screens: string[]; ground: string; dark?: boolean }
  | { kind: "window"; screens: string[]; ground: string; title: string }
  | { kind: "pages"; ground: string; pages: { src: string; title?: string; url?: string; reach?: number }[] };

export type CaseStudy = {
  slug: string;
  oldSlug?: string;
  client: string;
  title: string;
  headline: string;
  industry: string;
  service: "AI & Software" | "Product & UX" | "SEO & Growth";
  status: string;
  timeline?: string;
  cover: string;
  coverAlt: string;
  visual?: Visual;
  metric?: { value: string; label: string };
  flagship?: boolean;
  sample?: boolean;
  summary: string;
  challenge: string;
  phases: { phase: "Assess" | "Architect" | "Implement" | "Optimize"; text: string }[];
  results: { value: string; label: string; note?: string }[];
  gallery: { src: string; alt: string; wide?: boolean }[];
  quote?: { text: string; name: string; title: string };
  metaDescription: string;
};

export const cases: CaseStudy[] = [
  {
    slug: "auto-inspect",
    oldSlug: "auto-inspect",
    client: "Auto Inspect",
    title: "Auto Inspect",
    headline: "AI vehicle inspection: from manual photo review to an annotated report in under two minutes",
    industry: "Insurance & inspections",
    service: "AI & Software",
    status: "Live",
    cover: "/img/work/auto-inspect-cover.webp",
    coverAlt: "Auto Inspect app screens showing vehicle details and AI photo analysis",
    visual: { kind: "phones", ground: "#1b1c1e", dark: true, screens: ["/img/work/p/auto-inspect/s1.webp", "/img/work/p/auto-inspect/s2.webp", "/img/work/p/auto-inspect/s3.webp", "/img/work/p/auto-inspect/s4.webp", "/img/work/p/auto-inspect/s5.webp", "/img/work/p/auto-inspect/s6.webp"] },
    metric: { value: "1:47", label: "from four photos to annotated PDF report" },
    flagship: true,
    summary: "An AI inspection platform that lets insurers verify a vehicle's condition from guided phone photos, detect and annotate damage, and issue a tamper-evident report.",
    challenge: "Vehicle inspections relied on manual judgment, inconsistent photos and fragmented tools. Insurers faced slow approvals, disputes and fraud risk because the evidence was unclear or easy to manipulate.",
    phases: [
      { phase: "Assess", text: "Mapped the inspection-to-claim workflow and where evidence quality broke down: angles, lighting, missing views and edited photos." },
      { phase: "Architect", text: "Designed a five-stage pipeline: guided capture, quality checks, damage detection, annotation and report generation, with two assessment modes." },
      { phase: "Implement", text: "Built a mobile-first guided capture flow, AI damage detection and classification, and time-stamped reports with metadata validation." },
      { phase: "Optimize", text: "Tuned capture guidance and detection on real inspections so non-technical users get consistent results." },
    ],
    results: [
      { value: "4", label: "vehicle views captured with guided angles" },
      { value: "3", label: "damage findings detected and annotated in the live run" },
      { value: "1 min 47 s", label: "from upload to a 6-page PDF report" },
    ],
    gallery: [
      { src: "/img/work/auto-inspect-screens.webp", alt: "Auto Inspect screens: welcome, vehicle details, guided capture and policy activation", wide: true },
      { src: "/img/work/auto-inspect-trips.webp", alt: "Auto Inspect trip map and road rewards screens" },
      { src: "/img/work/auto-inspect-field.webp", alt: "Inspector photographing a vehicle interior" },
    ],
    metaDescription: "Auto Inspect case study: AI vehicle inspection with guided capture, damage detection and an annotated 6-page PDF report in 1 min 47 s.",
  },
  {
    slug: "pknail",
    client: "PKNail",
    title: "PKNail 2.0",
    headline: "Scan to Revit: turning point clouds into native building models",
    industry: "Architecture, engineering & construction",
    service: "AI & Software",
    status: "Revit 2026 add-in live",
    cover: "",
    coverAlt: "",
    metric: { value: "Revit 2026", label: "add-in live" },
    flagship: true,
    summary: "An engine that takes a site scan, extracts walls, openings and plan geometry with AI, and produces a native Revit model instead of a traced reference.",
    challenge: "Turning a laser scan into a usable Revit model is slow, manual redrawing. Every hour spent tracing a point cloud is an hour not spent on design.",
    phases: [
      { phase: "Assess", text: "Studied how modelers move from survey data to Revit and which steps were pure redrawing." },
      { phase: "Architect", text: "Defined a scan → AI extraction → native model pipeline that runs inside the tool modelers already use." },
      { phase: "Implement", text: "Built the extraction engine and the Revit 2026 add-in that writes native elements." },
      { phase: "Optimize", text: "Ongoing: accuracy and speed targets are being measured against manual modeling." },
    ],
    results: [
      { value: "Live", label: "Revit 2026 add-in" },
      { value: "Native", label: "Revit elements, not imported geometry" },
      { value: "3-step", label: "scan → AI extraction → model pipeline" },
    ],
    gallery: [],
    metaDescription: "PKNail 2.0 case study: an AI scan-to-Revit engine that converts point clouds into native Revit models. Revit 2026 add-in live.",
  },
  {
    slug: "drive",
    client: "Drive",
    title: "Drive",
    headline: "A project management workspace that gives executives the overview and teams the detail",
    industry: "B2B SaaS",
    service: "Product & UX",
    status: "Product design",
    timeline: "11 months",
    cover: "",
    coverAlt: "Drive dashboard with critical tasks, reminders, agenda and active mandates",
    visual: { kind: "window", ground: "#dfe8e1", title: "Drive", screens: ["/img/work/p/drive/s1.webp", "/img/work/p/drive/s2.webp", "/img/work/p/drive/s3.webp", "/img/work/p/drive/s4.webp", "/img/work/p/drive/s5.webp"] },
    metric: { value: "11 months", label: "design engagement" },
    summary: "Drive centralises task tracking, timeline views and resource allocation for high-growth SaaS teams in one workspace, built on Material UI so it feels familiar from the first session.",
    challenge: "Work was spread across chat threads, spreadsheets and calendars. Leaders had no single overview, and deadlines slipped because nobody could see what was at risk.",
    phases: [
      { phase: "Assess", text: "Mapped where communication fragmented and what an executive needs to see in the first ten seconds of a session." },
      { phase: "Architect", text: "Chose Material UI as the foundation so dense tables, filters and agendas behave the way people already expect." },
      { phase: "Implement", text: "Designed the home view around critical tasks and reminders, with mandates, activities, companies and people one click away." },
    ],
    results: [
      { value: "11 months", label: "design engagement" },
      { value: "Material UI", label: "design system foundation" },
      { value: "5 core views", label: "home, prospects, imports, lists and detail" },
    ],
    gallery: [
      { src: "/img/work/p/drive/s2.webp", alt: "Drive data import flow", wide: true },
      { src: "/img/work/p/drive/s3.webp", alt: "Drive prospects table with status tags", wide: true },
    ],
    metaDescription: "Drive: product design for a project management SaaS workspace on Material UI, by Cognixlab.",
  },
  {
    slug: "revexia",
    client: "Revexia",
    title: "Revexia",
    headline: "An operations dashboard that surfaces the few numbers that matter from a firehose of data",
    industry: "B2B SaaS",
    service: "Product & UX",
    status: "Product design",
    timeline: "5 months",
    cover: "",
    coverAlt: "Revexia dashboard with revenue, conversion, AI predictions and active offers",
    visual: { kind: "window", ground: "#0e1533", title: "Revexia", screens: ["/img/work/p/revexia/s1.webp", "/img/work/p/revexia/s2.webp", "/img/work/p/revexia/s3.webp", "/img/work/p/revexia/s4.webp"] },
    metric: { value: "5 months", label: "design engagement" },
    summary: "Revexia helps businesses monitor and scale their digital operations: revenue, segments, offers and automations in one dark, focused interface built on a custom design system.",
    challenge: "The platform had to surface critical insight from large data streams without overwhelming the people acting on it.",
    phases: [
      { phase: "Assess", text: "Identified the handful of signals each role acts on daily and what could move behind a click." },
      { phase: "Architect", text: "Built a bespoke component system around clarity and speed: metric tiles, one primary chart, offers as cards." },
      { phase: "Implement", text: "Designed the dashboard, segmentation hub and offer engine so every screen leads to one next action." },
    ],
    results: [
      { value: "5 months", label: "design engagement" },
      { value: "Custom UI", label: "bespoke design system" },
      { value: "4 core views", label: "dashboard, segments, offers and automations" },
    ],
    gallery: [
      { src: "/img/work/p/revexia/s2.webp", alt: "Revexia segmentation hub", wide: true },
      { src: "/img/work/p/revexia/s4.webp", alt: "Revexia offer intelligence engine", wide: true },
    ],
    metaDescription: "Revexia: product design for a SaaS operations and revenue dashboard with a custom design system, by Cognixlab.",
  },
  {
    slug: "flowcite",
    client: "Flowcite",
    title: "Flowcite",
    headline: "A research workspace where sources, citations and drafts live in one place",
    industry: "Productivity SaaS",
    service: "Product & UX",
    status: "Product design",
    timeline: "5 months",
    cover: "",
    coverAlt: "Flowcite library with research documents, citations and collaborators",
    visual: { kind: "window", ground: "#cdeae9", title: "Flowcite", screens: ["/img/work/p/flowcite/s1.webp", "/img/work/p/flowcite/s2.webp", "/img/work/p/flowcite/s3.webp", "/img/work/p/flowcite/s4.webp"] },
    metric: { value: "5 months", label: "design engagement" },
    summary: "Flowcite streamlines research workflows, citation management and collaborative writing for academic and professional teams, on a fully custom design system.",
    challenge: "Research pipelines are complex. The interface had to hold rich document previews, citation tagging and collaboration without overwhelming people who just want to write.",
    phases: [
      { phase: "Assess", text: "Followed how teams move from discovery to publication and where sources and citations get lost." },
      { phase: "Architect", text: "Designed a custom system for document cards, smart tags and multi-tab work." },
      { phase: "Implement", text: "Designed the library, search, project moves and plans so the writing space stays calm and distraction-free." },
    ],
    results: [
      { value: "5 months", label: "design engagement" },
      { value: "Custom UI", label: "design system built for documents" },
      { value: "4 core flows", label: "library, search, plans and project moves" },
    ],
    gallery: [
      { src: "/img/work/p/flowcite/s2.webp", alt: "Flowcite advanced search", wide: true },
      { src: "/img/work/p/flowcite/s3.webp", alt: "Flowcite plans and upgrade", wide: true },
    ],
    metaDescription: "Flowcite: product design for a research and citation management SaaS, by Cognixlab.",
  },
  {
    slug: "dome",
    client: "DOME",
    title: "DOME",
    headline: "One console for enterprise operations: services, deployments and alerts",
    industry: "B2B SaaS",
    service: "Product & UX",
    status: "Product design",
    timeline: "6 months",
    cover: "",
    coverAlt: "DOME dashboard with project summary, services and deployments",
    visual: { kind: "window", ground: "#d5dcee", title: "DOME", screens: ["/img/work/p/dome/s1.webp", "/img/work/p/dome/s2.webp", "/img/work/p/dome/s3.webp"] },
    metric: { value: "6 months", label: "design engagement" },
    summary: "DOME centralises enterprise operations management under one interface, from onboarding to service health and analytics, built on a custom design system.",
    challenge: "Enormous data and workflow complexity, used by teams of very different technical levels. People had to always know where they are and what they can do next.",
    phases: [
      { phase: "Assess", text: "Mapped the jobs of admins, engineers and managers and the data each one needs first." },
      { phase: "Architect", text: "Set a strong spatial hierarchy and contextual navigation that scale from onboarding to analytics." },
      { phase: "Implement", text: "Designed the dashboard, service metrics and database setup with one consistent pattern library." },
    ],
    results: [
      { value: "6 months", label: "design engagement" },
      { value: "Custom UI", label: "scalable pattern library" },
      { value: "3 core views", label: "dashboard, service metrics and setup" },
    ],
    gallery: [
      { src: "/img/work/p/dome/s2.webp", alt: "DOME service metrics", wide: true },
      { src: "/img/work/p/dome/s3.webp", alt: "DOME add new database flow", wide: true },
    ],
    metaDescription: "DOME: product design for an enterprise operations SaaS console, by Cognixlab.",
  },
  {
    slug: "tms",
    client: "TMS",
    title: "TMS",
    headline: "A transport management app for parcels, drivers and deliveries on the move",
    industry: "Logistics & operations",
    service: "Product & UX",
    status: "Product design",
    timeline: "4 months",
    cover: "",
    coverAlt: "TMS app screens: parcel dashboard, delivery map and barcode upload",
    visual: { kind: "phones", ground: "#4a2fa3", screens: ["/img/work/p/tms/s1.webp", "/img/work/p/tms/s2.webp", "/img/work/p/tms/s3.webp", "/img/work/p/tms/s4.webp", "/img/work/p/tms/s5.webp", "/img/work/p/tms/s6.webp"] },
    metric: { value: "4 months", label: "design engagement" },
    summary: "TMS (Transport Management System) streamlines shipment tracking, driver assignment and proof of delivery for logistics teams, on a custom design system tuned for data density.",
    challenge: "Drivers and dispatchers work under time pressure. Shipment data had to be readable at a glance on a phone, with proof of delivery captured in a few taps.",
    phases: [
      { phase: "Assess", text: "Mapped the parcel lifecycle from pickup to delivery and where drivers lose time." },
      { phase: "Architect", text: "Designed a custom system for dense lists, status tags, maps and scanning." },
      { phase: "Implement", text: "Designed onboarding, the parcel dashboard, live tracking, barcode proof of delivery, chat and incident reports." },
    ],
    results: [
      { value: "4 months", label: "design engagement" },
      { value: "Custom UI", label: "system for dense operational data" },
      { value: "Parcel to proof", label: "pickup, tracking and delivery in one flow" },
    ],
    gallery: [
      { src: "/img/work/p/showcase/tms-1.webp", alt: "TMS sign up and verification", wide: true },
      { src: "/img/work/p/showcase/tms-2.webp", alt: "TMS parcels, tracking and delivery", wide: true },
    ],
    metaDescription: "TMS: mobile product design for a transport and parcel management app, by Cognixlab.",
  },
  {
    slug: "ldma",
    client: "Leih dir mein Auto",
    title: "Leih dir mein Auto",
    headline: "A car-sharing app for lending your car to friends and neighbours, safely",
    industry: "Mobility",
    service: "Product & UX",
    status: "Product design",
    timeline: "5 months",
    cover: "",
    coverAlt: "Leih dir mein Auto app screens: onboarding, community, car location and booking",
    visual: { kind: "phones", ground: "#1f6f74", screens: ["/img/work/p/ldma/s1.webp", "/img/work/p/ldma/s2.webp", "/img/work/p/ldma/s3.webp", "/img/work/p/ldma/s4.webp", "/img/work/p/ldma/s5.webp", "/img/work/p/ldma/s6.webp"] },
    metric: { value: "5 months", label: "design engagement" },
    summary: "Leih dir mein Auto (LDMA) lets people lend their car to friends, family and neighbours inside a private community: invites, bookings, trip checklists and the car's location in one app.",
    challenge: "Lending a car to someone you know is built on trust. The app had to make invites, booking dates and the hand-over checklist simple enough that nobody needs a phone call.",
    phases: [
      { phase: "Assess", text: "Mapped how people lend cars informally today and where it breaks: dates, keys, fuel and damage." },
      { phase: "Architect", text: "Designed a community model: owners invite friends, friends request dates, both see the trip status." },
      { phase: "Implement", text: "Designed onboarding, invitations, booking, trip checklists, car location and notifications." },
    ],
    results: [
      { value: "5 months", label: "design engagement" },
      { value: "Custom UI", label: "friendly, high-contrast system" },
      { value: "Invite to return", label: "the whole lending loop in one app" },
    ],
    gallery: [
      { src: "/img/work/p/showcase/ldma1.webp", alt: "LDMA onboarding and invitations", wide: true },
      { src: "/img/work/p/showcase/ldma2.webp", alt: "LDMA community, booking and trip", wide: true },
    ],
    metaDescription: "Leih dir mein Auto: mobile product design for a peer car-sharing community app, by Cognixlab.",
  },
  {
    slug: "studylity",
    client: "StudyLity",
    title: "StudyLity",
    headline: "A study planner that breaks big goals into small, trackable steps",
    industry: "Education",
    service: "Product & UX",
    status: "Product design",
    timeline: "3 months",
    cover: "",
    coverAlt: "StudyLity app screens: sign in, book list, goal selection and messages",
    visual: { kind: "phones", ground: "#1e5a55", screens: ["/img/work/p/studylity/s1.webp", "/img/work/p/studylity/s2.webp", "/img/work/p/studylity/s3.webp", "/img/work/p/studylity/s4.webp", "/img/work/p/studylity/s5.webp", "/img/work/p/studylity/s6.webp"] },
    metric: { value: "3 months", label: "design engagement" },
    summary: "StudyLity helps students manage study schedules, track progress and stay motivated, with goals broken into small tasks and a calm, distraction-free interface.",
    challenge: "Students get overwhelmed by large goals. The app had to add structure without adding cognitive load.",
    phases: [
      { phase: "Assess", text: "Looked at where study plans fall apart: vague goals, no feedback, too many tools." },
      { phase: "Architect", text: "Designed a goal-first structure with clear progress indicators and light gamification." },
      { phase: "Implement", text: "Designed sign-up, goal selection, reading lists, study records, messaging and notifications." },
    ],
    results: [
      { value: "3 months", label: "design engagement" },
      { value: "Custom UI", label: "calm, distraction-free system" },
      { value: "Goal to record", label: "plan, study and log in one flow" },
    ],
    gallery: [
      { src: "/img/work/p/showcase/studylity1.webp", alt: "StudyLity onboarding and home", wide: true },
      { src: "/img/work/p/showcase/studylity2.webp", alt: "StudyLity progress and leaderboard", wide: true },
    ],
    metaDescription: "StudyLity: mobile product design for a student study planner, by Cognixlab.",
  },
  {
    slug: "dr-kibria-seo",
    oldSlug: "google-rankings-in-4-months",
    client: "Dr. S. M. G. Kibria",
    title: "Dr. Kibria",
    headline: "Page one on Google and top of Maps for a consultant surgeon, in four months",
    industry: "Healthcare practices",
    service: "SEO & Growth",
    status: "Complete",
    timeline: "4 months",
    cover: "/img/work/kibria-cover.webp",
    coverAlt: "Rapid Google search and Maps ranking success cover",
    metric: { value: "150%+", label: "organic traffic growth" },
    flagship: true,
    summary: "Search, Maps and AI Overview visibility for a British-trained consultant general, vascular and laparoscopic surgeon with 38+ years of experience.",
    challenge: "Despite a strong offline reputation, the website didn't rank for high-intent keywords in a competitive medical niche. On-page SEO lacked structure, Maps visibility was weak and social channels were underused, which limited how many patients found him.",
    phases: [
      { phase: "Assess", text: "Full digital and technical SEO audit, keyword and intent mapping for patient searches." },
      { phase: "Architect", text: "Restructured service pages around patient intent and planned local SEO and authority work." },
      { phase: "Implement", text: "Fixed technical issues, rewrote content for clarity and medical accuracy, optimized Maps, earned medical backlinks and aligned social branding." },
      { phase: "Optimize", text: "Monitored rankings, AI Overview mentions and patient inquiries; iterated content." },
    ],
    results: [
      { value: "150%+", label: "organic traffic growth" },
      { value: "10+", label: "high-intent keywords on page one" },
      { value: "#1", label: "Google Maps position for “best vascular surgeon in Bangladesh”" },
    ],
    gallery: [
      { src: "/img/work/kibria-search.webp", alt: "Google search results showing Dr. Kibria on page one" },
      { src: "/img/work/kibria-maps.webp", alt: "Google Maps listing for Dr. Kibria" },
      { src: "/img/work/kibria-result.webp", alt: "Analytics review of organic traffic growth", wide: true },
    ],
    metaDescription: "SEO case study: 150%+ organic traffic and page-one rankings for 10+ keywords for a consultant surgeon in four months, plus top Google Maps position.",
  },
  {
    slug: "phc-aesthetic",
    oldSlug: "social-media-visibility-growth",
    client: "PHC Aesthetic & Derma Care",
    title: "PHC Aesthetic",
    headline: "Local Facebook search visibility for a dermatologist-led clinic",
    industry: "Healthcare practices",
    service: "SEO & Growth",
    status: "Ongoing",
    cover: "/img/work/phc-cover.webp",
    coverAlt: "Social media visibility growth cover for PHC Aesthetic",
    summary: "Treatment-led, location-focused social content that put a Banani clinic in front of patients searching Facebook for specific treatments.",
    challenge: "The clinic's Facebook presence didn't appear in local searches. Competitors dominated treatment queries and content wasn't written for location-driven intent.",
    phases: [
      { phase: "Assess", text: "Reviewed local search behavior on Facebook for treatment names and neighborhoods." },
      { phase: "Architect", text: "Built a location-focused content strategy around high-intent treatment keywords." },
      { phase: "Implement", text: "Before-and-after visuals, doctor-led educational videos, Facebook Live sessions and consistent branded posting." },
      { phase: "Optimize", text: "Tracked which formats surfaced in search and drove Messenger inquiries." },
    ],
    results: [
      { value: "Found", label: "for “PRP Treatment in Banani” in Facebook search" },
      { value: "Consistent", label: "post discovery for “Aesthetic care in Banani”" },
      { value: "More", label: "Messenger inquiries and video watch time" },
    ],
    gallery: [
      { src: "/img/work/phc-a.webp", alt: "PHC Aesthetic social content examples" },
      { src: "/img/work/phc-b.webp", alt: "PHC Aesthetic Facebook search presence" },
    ],
    metaDescription: "Social visibility case study: location-focused Facebook content that put PHC Aesthetic & Derma Care in local treatment searches in Banani, Dhaka.",
  },
  {
    slug: "jvs-management",
    oldSlug: "jvs-management",
    client: "JVS Management",
    title: "JVS Management",
    headline: "A clearer digital presence for an agile coaching and consulting firm",
    industry: "Professional services",
    service: "Product & UX",
    status: "Complete",
    cover: "/img/work/jvs-cover.webp",
    coverAlt: "JVS Management cover with team at a planning wall",
    summary: "JVS Management helps companies adopt Scrum and Agile properly, through coaching, training and leadership support.",
    challenge: "JVS needed to explain a nuanced consulting offer (coaching, training and organizational transformation) to leaders who have often seen Agile adopted badly before.",
    phases: [
      { phase: "Assess", text: "Clarified who JVS serves and the objections leaders raise about Agile transformations." },
      { phase: "Architect", text: "Structured the offer around coaching, training and transformation support." },
      { phase: "Implement", text: "Designed the brand presentation and content that explains each engagement." },
      { phase: "Optimize", text: "Refined messaging with JVS after early prospect conversations." },
    ],
    results: [],
    gallery: [
      { src: "/img/work/jvs-a.webp", alt: "JVS Management coaching session" },
      { src: "/img/work/jvs-b.webp", alt: "JVS Management team planning" },
    ],
    metaDescription: "JVS Management: positioning and digital presence for an agile coaching and organizational transformation consultancy.",
  },
  {
    slug: "landing-pages",
    client: "Landing pages",
    title: "Landing pages",
    headline: "Single-purpose landing pages for crypto, fintech, retail and fashion brands",
    industry: "Marketing sites",
    service: "Product & UX",
    status: "Product design",
    timeline: "2 to 8 weeks each",
    cover: "",
    coverAlt: "Landing pages for Capital Coin, Prospera and Silk Route scrolling in browser windows",
    visual: { kind: "pages", ground: "#121316", pages: [{ src: "/img/work/p/landing/capital-coin.webp", title: "Capital Coin" }, { src: "/img/work/p/landing/prospera.webp", title: "Prospera" }, { src: "/img/work/p/landing/silk-route.webp", title: "Silk Route" }] },
    metric: { value: "11 pages", label: "shown in the portfolio" },
    summary: "Eleven landing pages, each with one job: earn a decision. Capital Coin (crypto exchange), Prospera (financial planning), Silk Route (fashion), Budget Now (personal finance), MaxShelf (retail SaaS), Polock Interior, QProco, Kina Becha, Revexia and a personal brand page for Jeff Sutherland.",
    challenge: "A landing page gets seconds. Each one had to explain the offer, build trust for its audience and lead to one clear action.",
    phases: [
      { phase: "Assess", text: "Started from the one decision each page has to win and who makes it." },
      { phase: "Architect", text: "Ordered every page as an argument: promise, proof, detail, action." },
      { phase: "Implement", text: "Designed full pages in each brand's own style, from dark Web3 to editorial fashion, ready for development." },
    ],
    results: [
      { value: "11 pages", label: "shown in the portfolio" },
      { value: "2 to 8 weeks", label: "per page" },
      { value: "6 sectors", label: "crypto, fintech, retail, fashion, interiors, personal brand" },
    ],
    gallery: [
      { src: "/img/work/p/landing/budget-now.webp", alt: "Budget Now landing page", wide: true },
      { src: "/img/work/p/landing/maxshelf.webp", alt: "MaxShelf Retail landing page", wide: true },
      { src: "/img/work/p/landing/polock.webp", alt: "Polock Interior landing page", wide: true },
    ],
    metaDescription: "Landing page design for crypto, fintech, retail and fashion brands by Cognixlab.",
  },
  {
    slug: "live-sites",
    client: "Sites built and shipped",
    title: "Sites built and shipped",
    headline: "Designed and built in code, live today: legal, surgical, mobility and SaaS sites",
    industry: "Websites",
    service: "AI & Software",
    status: "Live",
    timeline: "Shipped",
    cover: "",
    coverAlt: "Live sites for Edge Surgical, Argos Legal Group and FacilityFlow in browser windows",
    visual: { kind: "pages", ground: "#202328", pages: [{ src: "/img/work/p/sites/edge.webp", url: "edgesurgical.vercel.app", reach: 0.35 }, { src: "/img/work/p/sites/argos.webp", url: "argos-legal-group.vercel.app", reach: 0.25 }, { src: "/img/work/p/sites/facilityflow.webp", url: "facilityflow.dk", reach: 0.35 }] },
    metric: { value: "12 sites", label: "live in the portfolio" },
    summary: "Sites designed and built directly in code, with AI-assisted development directed by a designer: Edge Surgical, Argos Legal Group, FacilityFlow, HopOn, MLJ Digital, Noma, AixAi and more.",
    challenge: "Design files are not the product. These projects went from design to live, responsive sites without a separate hand-off.",
    phases: [
      { phase: "Architect", text: "Designed each site's structure and system before any code." },
      { phase: "Implement", text: "Built in HTML, CSS and canvas with AI-assisted development, reviewed and refined line by line, then shipped live." },
    ],
    results: [
      { value: "12 sites", label: "live in the portfolio" },
      { value: "Design to code", label: "one person, no hand-off" },
      { value: "HTML, CSS, Canvas", label: "the stack" },
    ],
    gallery: [
      { src: "/img/work/p/sites/hopon.webp", alt: "HopOn ride and delivery site", wide: true },
      { src: "/img/work/p/sites/mlj.webp", alt: "MLJ Digital studio site", wide: true },
      { src: "/img/work/p/sites/aixai.webp", alt: "AixAi building intelligence site", wide: true },
    ],
    metaDescription: "Live websites designed and built in code by Cognixlab: legal, surgical, mobility and SaaS.",
  },
  {
    slug: "mindcare",
    oldSlug: "mind-care",
    client: "Product design sample",
    title: "MindCare",
    headline: "A calm, low-pressure mindfulness and mood-tracking app",
    industry: "Wellness",
    service: "Product & UX",
    status: "Design sample",
    sample: true,
    cover: "/img/work/mindcare-cover.webp",
    coverAlt: "MindCare app screens with meditation and anxiety tracking",
    visual: { kind: "phones", ground: "#1d1a4d", dark: true, screens: ["/img/work/p/mindcare/s1.webp", "/img/work/p/mindcare/s2.webp", "/img/work/p/mindcare/s3.webp", "/img/work/p/mindcare/s4.webp", "/img/work/p/mindcare/s5.webp", "/img/work/p/mindcare/s6.webp"] },
    summary: "Guided meditation, mood tracking and reflection prompts designed to feel supportive rather than demanding.",
    challenge: "Wellness apps often feel clinical or overwhelming, and users drop off. The design had to lower cognitive load and feel emotionally safe.",
    phases: [
      { phase: "Assess", text: "Reviewed why people abandon wellness apps: pressure, guilt and complexity." },
      { phase: "Architect", text: "Defined a gentle habit loop: check in, breathe, reflect." },
      { phase: "Implement", text: "Mobile-first UI with soft visuals, generous spacing and calm transitions." },
      { phase: "Optimize", text: "Prototype testing on onboarding and daily check-in." },
    ],
    results: [],
    gallery: [
      { src: "/img/work/p/showcase/mindcare1.webp", alt: "MindCare onboarding: welcome, age group and content preferences", wide: true },
      { src: "/img/work/p/showcase/mindcare2.webp", alt: "MindCare home, breathing session and mood check-in", wide: true },
      { src: "/img/work/p/showcase/mindcare3.webp", alt: "MindCare anxiety test and results", wide: true },
    ],
    metaDescription: "MindCare product design sample: a calm mindfulness and mood-tracking app designed by Cognixlab.",
  },
  {
    slug: "muscle-locker",
    oldSlug: "muscle-locker",
    client: "Product design sample",
    title: "Muscle Locker",
    headline: "Workout logging and coaching that doesn't interrupt the workout",
    industry: "Fitness",
    service: "Product & UX",
    status: "Design sample",
    sample: true,
    cover: "/img/work/muscle-locker-cover.webp",
    coverAlt: "Muscle Locker app screens with coaching and training plans",
    visual: { kind: "phones", ground: "#2a2408", dark: true, screens: ["/img/work/p/muscle-locker/s1.webp", "/img/work/p/muscle-locker/s2.webp", "/img/work/p/muscle-locker/s3.webp", "/img/work/p/muscle-locker/s4.webp", "/img/work/p/muscle-locker/s5.webp", "/img/work/p/muscle-locker/s6.webp"] },
    summary: "A training platform connecting athletes with coaches, with quick workout logging and clear progress tracking.",
    challenge: "Fitness apps that demand attention mid-set get abandoned. Logging had to be fast enough to use between reps.",
    phases: [
      { phase: "Assess", text: "Studied how people log workouts in the gym and where existing apps get in the way." },
      { phase: "Architect", text: "Separated in-session logging from planning and coach communication." },
      { phase: "Implement", text: "One-thumb logging, progress at a glance and coach messaging." },
      { phase: "Optimize", text: "Prototype testing with lifters on logging speed." },
    ],
    results: [],
    gallery: [
      { src: "/img/work/muscle-locker-a.webp", alt: "Muscle Locker onboarding screens" },
      { src: "/img/work/muscle-locker-b.webp", alt: "Muscle Locker training plan screens", wide: true },
    ],
    metaDescription: "Muscle Locker product design sample: a coaching and workout-tracking app designed by Cognixlab.",
  },
];

export const tiers = [
  {
    name: "Workflow Review",
    price: "Free",
    unit: "45 minutes",
    who: "Problem-aware. You know something is slow, not yet what to fix.",
    items: [
      "We map one workflow with you on the call",
      "Honest view on whether AI, automation or nothing is the fix",
      "No slides, no pitch",
    ],
    cta: "Book a Workflow Review",
    href: "booking",
  },
  {
    name: "Workflow Assessment",
    price: "$4,500",
    unit: "fixed · about 2 weeks",
    who: "Ready to scope. You want a plan and a number before you build.",
    items: [
      "Process map with the cost of each manual step",
      "Data readiness report",
      "Working proof of concept on your data",
      "ROI estimate and recommended stack",
      "Go / no-go with a scoped pilot",
    ],
    cta: "Scope your assessment",
    href: "/contact?intent=assessment",
    recommended: true,
  },
  {
    name: "AI Pilot",
    price: "from $12,000",
    unit: "4–6 weeks",
    who: "Ready to build. One workflow, automated and measured.",
    items: [
      "One production automation or AI agent",
      "Private retrieval over your documents",
      "Integrations with your existing tools",
      "Personal-data masking and access controls",
      "Monitoring dashboard and handover",
    ],
    cta: "Request a proposal",
    href: "/contact?intent=pilot",
  },
  {
    name: "Implementation",
    price: "from $35,000",
    unit: "3–6 months",
    who: "Scaling. Several workflows, custom software, team adoption.",
    items: [
      "Multiple workflows automated end to end",
      "Data pipelines and custom software where needed",
      "Team training and adoption support",
      "Continuous improvement after launch",
    ],
    cta: "Request a proposal",
    href: "/contact?intent=implementation",
  },
];

export const team = [
  { name: "Zakaria Mahmud", role: "Co-founder", photo: "/img/team/zakaria-mahmud.webp" },
  { name: "AR Tanveer", role: "Co-founder", photo: "/img/team/ar-tanveer.webp" },
  { name: "Art Prutsalis", role: "Senior Vice President of Sales", photo: "/img/team/art-prutsalis.webp" },
  { name: "Stanley Chatman", role: "Fractional CTO", photo: "/img/team/stanley-chatman.webp" },
];

export const testimonials = [
  {
    text: "Beyond the outstanding quality of the product (in my case, a redesigned Figma prototype), they communicated every step of the way and even finished the job earlier.",
    name: "Elijah Buford",
    title: "CEO, Paperade AI",
    service: "Product & UX",
  },
  {
    text: "Cognixlab is an authority on UX/UI. They have provided valuable guidance which is critical at this initial design phase of the project.",
    name: "Sherry D'Costa",
    title: "Sales Force Manager",
    service: "Product & UX",
  },
  {
    text: "The final product was an insightful blend of intuitive, clean and efficient design elements that demonstrated a deep understanding of user interface and user experience principles.",
    name: "J Davidson",
    title: "CEO & Founder, BudgetNow",
    service: "Product & UX",
  },
];

export const method = [
  {
    phase: "Assess",
    what: "We audit your operations, data flow, team workflows and AI readiness.",
    youGet: "Process map, data readiness report, list of what to fix first",
    prevents: ["Automating broken processes", "Guessing where inefficiencies exist", "Buying tools you don't need"],
  },
  {
    phase: "Architect",
    what: "We design the right system before building anything.",
    youGet: "Architecture, scoped pilot, fixed budget and timeline",
    prevents: ["Feature overload", "Platform confusion", "Costly rework"],
  },
  {
    phase: "Implement",
    what: "We build, integrate and test in stages, with a demo every two weeks.",
    youGet: "Working software in your tools, measured against the baseline",
    prevents: ["Disconnected solutions", "Adoption resistance", "Scalability bottlenecks"],
  },
  {
    phase: "Optimize",
    what: "We refine, monitor and extend what works.",
    youGet: "Monitoring, handover, and a roadmap for the next workflow",
    prevents: ["Stagnation", "Tool fatigue", "Falling behind"],
  },
];

export const homeFaqs = [
  { q: "What does a first project cost?", a: "Most clients start with a Workflow Assessment at a fixed $4,500, about two weeks. Pilots start from $12,000. The Workflow Review call is free." },
  { q: "How long until something is running?", a: "The assessment ends with a working proof of concept on your data. A production pilot typically takes four to six weeks after that." },
  { q: "How do you handle our data?", a: "NDA before discovery, least-privilege access, personal data masked before it reaches a model, and no training on client data. Details are on our data handling page." },
  { q: "What if AI isn't the answer?", a: "We'll tell you. Many manual steps disappear with a better integration or a simple rule, which is cheaper to build and run." },
  { q: "Do you only work in Boston and New York?", a: "We're based in Cambridge, MA and focus on Boston and New York, but we work remotely with clients elsewhere in the US and abroad." },
];

export function getCase(slug: string) {
  return cases.find((c) => c.slug === slug);
}
export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
