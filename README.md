# cognixlab.co — rebuild

Next.js 15 (App Router, TypeScript) · Tailwind CSS v4 · GSAP 3 + ScrollTrigger · Lenis · Three.js (hero only).
Design spec: [DESIGN.md](DESIGN.md). Built from the October 2026 website audit.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Environment:

| Variable | Purpose |
|---|---|
| `LEAD_WEBHOOK_URL` | Optional. Every form submission is POSTed here as JSON (HubSpot workflow, Zapier, Make, Slack). Without it, leads are only logged by the server. |

## Where things live

| What | File |
|---|---|
| Services, industries, case studies, pricing, team, testimonials, FAQs, booking URL | `src/content/site.ts` |
| Blog posts (migrated from WordPress, sanitized, images localized) | `src/content/posts.ts` |
| 301s from every old WordPress URL | `next.config.ts` |
| Design tokens | `src/app/globals.css` (`:root`) |
| Motion primitives (split headings, reveals, magnetic, marquee, parallax, scramble, cursor label) | `src/components/motion/` |
| Hero shader | `src/components/hero/SignalField.tsx` |
| Booking dialog + inline calendar + lead form | `src/components/booking/` |
| Lead API | `src/app/api/lead/route.ts` |

## Motion system
- Lenis is the only smooth-scroll engine; it drives ScrollTrigger through the GSAP ticker.
- `prefers-reduced-motion: reduce` disables Lenis, pinning, scrubbing and the WebGL shader and shows every final state.
- Reveal targets start hidden only when JS runs (`html.js [data-pending]`); a 4-second failsafe shows them if hydration fails. Verified: 0 hidden text elements with JS off and with reduced motion.
- The hero shader is lazy-loaded (home first-load JS 188 kB), DPR-capped, paused offscreen and when the tab is hidden, and falls back to static CSS lanes.
- Rule: never put a CSS `transition` on a property GSAP animates on the same element.

## Before launch — Cognixlab to confirm
**Booking**
- [ ] Create a 30-minute "Workflow Review" Calendly event and update `site.booking.url` and `site.booking.minutes` (currently the existing 45-min event).
- [ ] Set `LEAD_WEBHOOK_URL` and test a form submission end to end.

**Permissions and facts**
- [ ] Written permission to name: Auto Inspect, PKNail, Paperade AI, BudgetNow, Dr. S. M. G. Kibria, PHC Aesthetic & Derma Care, JVS Management (proof marquee + case studies).
- [ ] Auto Inspect: confirm the five stage names in `InspectRun.tsx` and deployment status "Live".
- [ ] PKNail 2.0: confirm status text "Revit 2026 add-in live" and supply real screenshots (point cloud → plan → Revit model) to replace the generated diagram if wanted.
- [ ] Testimonials: the three existing quotes are used as published (lightly trimmed).
- [ ] Home testimonial rows: 9 **sample** quotes in `src/content/sample-testimonials.ts` fill the layout in dev only (badged "Sample", dropped from production builds). Replace with real, permissioned quotes; do not set `NEXT_PUBLIC_SHOW_SAMPLE_TESTIMONIALS=1` on the live site. Ask Auto Inspect and Dr. Kibria's team for outcome quotes with photo.
- [ ] Short bios for each team member (audit 4.5) — not invented here.
- [ ] Industries chosen from where proof exists: insurance & inspections, AEC, healthcare practices. Change in `site.ts` if your target buyers differ.

**Portfolio items (from ar-tanveer-portfolio.vercel.app + Figma "Design Demo Files")**
- [ ] Permission to name and show: Drive, Revexia, Flowcite, DOME, TMS, Leih dir mein Auto, StudyLity, and the landing-page brands (Capital Coin, Prospera, Silk Route, Budget Now, MaxShelf, Polock Interior, QProco, Kina Becha, Revexia, Jeff Sutherland).
- [ ] Live sites shown with real URLs (edgesurgical, argos-legal-group, facilityflow.dk and the rest in `/case-studies/live-sites`): confirm each client is happy to be shown. the-cafe-mu.vercel.app was unreachable when captured.
- [ ] Claims in the portfolio that were **not** published, pending proof: Mind Care "HIPAA-compliant" and "intake from 15 min to under 3"; DRIVE "sub-second interactions"; the aggregate stats (engagement +40%, conversions +25%, retention doubled). Case results use only facts stated per project (timeline, design system, scope).
- [ ] Two portfolio write-ups contradict their own screens and were rewritten from the screens: Auto Inspect (portfolio says factory-floor QA; screens and the existing case are vehicle inspection) and LDMA (portfolio says corporate data; screens are "Leih dir mein Auto", peer car sharing).
- Covers are staged with the Stageshow kit (`src/stageshow/kit`, MIT, vendored unmodified; `src/components/work/CaseVisual.tsx`). Its film gate reports two host-specific false positives: "kit override" (Next bundles the kit's layered CSS, the checker expects a `/kit/` URL) and "empty pane" (panes hold real screens as images, not DOM rows).

**Copy we wrote that states a policy — check it's true**
- [ ] Pricing FAQ: third-party costs paid directly, support as a monthly retainer.
- [ ] Data handling page: NDA before discovery, least-privilege access, PII masking, no training on client data, deletion at the end.
- [ ] Privacy policy, terms, accessibility statement: plain-language baselines. **Have counsel review.** Add a cookie banner if GA4/GTM or ad pixels are re-added (the old site ran GTM-N23XT3XZ).

**Not yet done**
- [ ] Analytics: GA4 + Search Console + Clarity, with events for booking, form submit, guide download, pricing view.
- [ ] Professional team photography (current photos are normalized to square grayscale for consistency).
- [ ] Named blog authors (posts currently credit Cognixlab).
- [ ] Image generation: the Magnific account has 0 credits (stock costs 40 credits/item) and no Gemini API key was available, so no new imagery was generated. All images are Cognixlab's own.
