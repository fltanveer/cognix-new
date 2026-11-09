"use client";

import { useRef } from "react";
import { team } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion, release } from "@/lib/gsap";

/** Team grid. One consistent treatment (square crop, grayscale) across mixed source photos. */
export function Team({ title = "The people you’ll actually work with." }: { title?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-member]");
      if (prefersReducedMotion()) return cards.forEach(release);
      cards.forEach((c, i) => {
        const img = c.querySelector("img");
        gsap.set(c, { autoAlpha: 1 });
        gsap.set(img, { clipPath: "inset(100% 0 0 0)", scale: 1.25 });
        release(c);
        gsap.to(img, { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 1.4, ease: "expo.out", delay: i * 0.1, scrollTrigger: { trigger: c, start: "top 85%", once: true } });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="section" aria-labelledby="team-title">
      <div className="container-x">
        <h2 id="team-title" className="t-d2 max-w-[16ch]">
          {title}
        </h2>
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {team.map((m) => (
            <li key={m.name} data-member="" data-pending="" className="group">
              <div className="media-frame aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.photo}
                  alt={`${m.name}, ${m.role}, Cognixlab`}
                  loading="lazy"
                  className="transition-[filter] duration-500 [filter:contrast(1.05)_brightness(0.92)] group-hover:[filter:contrast(1.1)_brightness(1)]"
                />
              </div>
              <div className="mt-4 text-[18px] tracking-[-0.015em]">{m.name}</div>
              <div className="text-[14.5px] text-[var(--ink-2)]">{m.role}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
