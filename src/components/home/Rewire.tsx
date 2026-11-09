"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import "./rewire-iso.css";

/**
 * "Something in your operations isn't working": an isometric patch bay (anatomy iso kit, generated
 * at build time into rewire-figure.ts). Six tool modules start joined by loose hand-patched cords,
 * the manual hand-offs. Scrolling pulls the cords, wires every module back to the backplane bus,
 * lights the bus and each module's status light, then a signal runs along the bus.
 */
export function Rewire({ art }: { art: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const art = root.current!.querySelector<HTMLElement>(".rw-iso")!;
      const tangle = q(".rw-tangle");
      const wires = [...q('[data-part="back-wires"] .rw-wire'), ...q(".rw-wire--a"), ...q(".rw-wire--b")];
      const bus = q(".rw-bus");
      const leds = q(".rw-led");

      const connected = (on: boolean) => {
        leds.forEach((el) => (on ? el.setAttribute("data-on", "") : el.removeAttribute("data-on")));
        if (on) art.setAttribute("data-live", "");
        else art.removeAttribute("data-live");
      };

      if (prefersReducedMotion()) {
        art.setAttribute("data-rw", "after");
        gsap.set(q("[data-state='before']"), { autoAlpha: 0 });
        gsap.set(q("[data-state='after']"), { autoAlpha: 1 });
        return;
      }

      // The scrub owns every stroke from here.
      art.setAttribute("data-rw", "before");
      gsap.set(tangle, { strokeDashoffset: 0 });
      gsap.set([...wires, ...bus], { strokeDashoffset: 1 });
      gsap.set(q("[data-state='after']"), { autoAlpha: 0 });

      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 960px)", mobile: "(max-width: 959px)" }, (ctx) => {
        const desktop = ctx.conditions?.desktop;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: desktop
            ? { trigger: root.current, start: "top top", end: "+=130%", pin: true, scrub: 0.8, invalidateOnRefresh: true }
            : { trigger: art, start: "top 75%", end: "bottom 40%", scrub: 0.8, invalidateOnRefresh: true },
          onUpdate() {
            connected(this.progress() > 0.78);
          },
        });
        // 1. the hand-patched cords come out, one by one
        tl.to(tangle, { strokeDashoffset: 1, duration: 0.34, ease: "power2.in", stagger: 0.04 }, 0.04)
          .to(q("[data-state='before']"), { autoAlpha: 0, duration: 0.1 }, 0.3)
          // 2. each module is wired back to the backplane: up from its jack, along the aisle, through the gap
          .to(wires, { strokeDashoffset: 0, duration: 0.3, ease: "power1.inOut", stagger: 0.035 }, 0.36)
          // 3. the bus lights end to end
          .to(bus, { strokeDashoffset: 0, duration: 0.18, ease: "power2.out" }, 0.66)
          .to(q("[data-state='after']"), { autoAlpha: 1, duration: 0.1 }, 0.76)
          .to({}, { duration: 0.16 });
        return () => {
          tl.scrollTrigger?.kill();
          connected(false);
        };
      });

      // The signal on the bus only runs while the section is on screen.
      const vis = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (s) => art.toggleAttribute("data-onscreen", s.isActive),
      });
      return () => {
        vis.kill();
        mm.revert();
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden lg:h-[100svh]" aria-labelledby="rewire-title">
      <div className="container-x grid h-full items-center gap-10 py-[var(--section)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-6 lg:py-0">
        <div className="max-w-[520px]">
          <h2 id="rewire-title" className="t-d2">
            Something in your operations isn’t working.
          </h2>
          <div className="mt-6 space-y-4 text-[var(--ink-2)]">
            <p>
              If your team still relies on manual work, disconnected tools and complicated workflows, the problem isn’t effort. It’s
              infrastructure.
            </p>
            <p>
              Most growing companies reach a point where their technology can’t keep up with how the business actually operates. We assess
              your operations, redesign the workflows that leak time, and connect the tools your team depends on.
            </p>
          </div>
          <p className="mt-8 border-l border-[var(--accent)] pl-4 text-[19px] leading-snug text-[var(--ink)]">
            The result: a business that runs faster, cleaner, and with far less friction.
          </p>
        </div>

        {/* No card: the rack sits straight on the page and fades into it at the edges. */}
        <figure className="relative lg:-mr-[calc(var(--gutter)+2vw)]">
          <div className="flex flex-col gap-1.5 text-[13px] sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:pr-[calc(var(--gutter)+2vw)]">
            <span className="shrink-0 text-[var(--ink-3)]">Fig 1 · Your tools today</span>
            <span className="relative h-5 w-full whitespace-nowrap font-mono text-[12px] sm:w-auto sm:min-w-[250px] sm:text-right">
              <span data-state="before" className="absolute inset-0 text-[var(--ink-2)]">
                6 hand-offs patched by people
              </span>
              <span data-state="after" className="absolute inset-0 flex items-center gap-2 text-[var(--ink)] sm:justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> 0 hand-offs · one connected bus
              </span>
            </span>
          </div>
          {art}
          <figcaption className="mt-1 text-[13px] text-[var(--ink-3)] lg:pr-[calc(var(--gutter)+2vw)]">
            Illustrative. Inbox, spreadsheets, team chat, forms, ledger and CRM, patched together by hand, then wired to one bus.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
