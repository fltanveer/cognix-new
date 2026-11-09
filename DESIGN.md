# Cognixlab — design spec

Source of truth for the redesign. Built from the October 2026 website audit and a full crawl of cognixlab.co.

```
DIRECTION: Monochrome Lightwork (+ borrowed move: "a 3D/data object carries the data" from Signal Ops, applied to the Auto Inspect run panel)
PRODUCT / USER / JOB: Cognixlab, a Cambridge MA studio that modernizes operations with AI and connected systems
                      / founders, CEOs, COOs and ops leads of growing companies in Boston and New York
                      / make a sceptical operator book a Workflow Review
MOOD IN 3 WORDS: exacting, calm, operational
BASE MODE: dark (existing brand: near-black + lime, audit says keep it) with a paper-light reading surface for
           long-form (case-study bodies, insights articles) because 2,000-word articles read better on paper
PALETTE:
  canvas    oklch(0.155 0.006 125)  near-black, faint olive tint pulled from the lime
  surface   oklch(0.195 0.007 125)
  surface-2 oklch(0.235 0.008 125)
  line      oklch(0.92 0.02 125 / 0.11)
  ink       oklch(0.955 0.01 120)   ink-2 = 66%   ink-3 = 44%
  accent    #c9f31d (sampled from the Cognixlab mark) — accent-ink #0e1104
  paper     oklch(0.975 0.004 110)  graphite ink oklch(0.24 0.01 125)
  accent hue derived from: the Cognixlab chevron mark, read as a "route is live" signal light.
  Rationed: primary CTA, "connected / live" states, one lane of the hero field. Never body text on light.
TYPE: display Onest 500, tracking -0.03em, lh 1.02–1.08 · text Onest 400 17/1.6 (marketing) 15/1.55 (UI)
      label/mono Geist Mono — only for run logs, timers, IDs, timestamps, prices meta
      scale 13/15/17/20/26/36/52/76/clamp(56,9vw,128) · numerals tabular
SPACE: base 4 · container 1240 · section gap 128 (desktop) / 88 (mobile)
RADIUS SCALE: 8 (inputs, chips) / 14 (cards) / 22 (media frames) / 999 (CTA pills)
DEPTH MODEL: hairlines + frosted top edge. No drop shadows on dark.
LAYOUT CONCEPT: left-weighted editorial grid. Hero claim sits bottom-left over a living signal field;
                proof line pinned directly under the CTA.
SIGNATURE MOVE: "Rewire" — tangled lines straighten into lit lanes. Hero WebGL field resolves from noise to order
                as you scroll; the pinned problem section re-routes real tool nodes (inbox, spreadsheet, CRM, PDFs)
                into one connected flow. Remove it and the site loses its argument.
MOTIF: lanes / routing. Rendering: 1px hairline lanes, lime only on the live lane.
MOTION: one orchestrated moment per page (home: hero intro + Rewire pin). Elsewhere: word-by-word heading reveals,
        clip-path media reveals, scrubbed parallax, horizontal case-study rail, marquee, magnetic CTAs, scramble-in
        metrics (no count-ups), curtain route transition, cursor label on case cards. Reduced motion = final states.
COPY VOICE: plain, operator-to-operator, sentence case. Problem → outcome → method → technology.
            BANNED: supercharge, unlock, seamless, empower, elevate, dominate, elite, 10x, cutting-edge, revolutionize
CONTENT PLAN (home): hero + proof line → Rewire problem section → services (4, linked) → flagship work rail
            → method (Assess/Architect/Implement/Optimize with deliverables) → who we help (3 industries)
            → engagement & pricing snapshot → team + testimonial → FAQ → closing CTA band
```

## Honesty rules applied
- No client logos until written permission exists. No review counts. No unverifiable counters.
- Only metrics present in Cognixlab material: Auto Inspect (4 views, 3 findings, 1 min 47 s, 6-page PDF report,
  two assessment modes, five-stage pipeline), Dr. Kibria SEO (150%+ organic traffic, page 1 for 10+ keywords).
- PKNail 2.0 efficiency figures are not shown; status is stated instead.
- Testimonials are the three existing ones, with names and titles as published.

## Open items for Cognixlab to confirm
See README.md → "Before launch".
