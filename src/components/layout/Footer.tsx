"use client";

import Link from "next/link";
import { useRef } from "react";
import { site, services, industries } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export function Footer() {
  const word = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = word.current;
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el.querySelectorAll("span"),
      { yPercent: 100 },
      {
        yPercent: 0,
        ease: "expo.out",
        duration: 1.4,
        stagger: 0.045,
        scrollTrigger: { trigger: el, start: "top 95%", once: true },
      }
    );
  });

  const col = (title: string, links: { label: string; href: string; ext?: boolean }[]) => (
    <div>
      <h2 className="text-[13px] font-normal tracking-normal text-[var(--ink-3)]">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            {l.ext ? (
              <a href={l.href} className="link-u text-[15px] text-[var(--ink-2)] hover:text-[var(--ink)]" target="_blank" rel="noopener">
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="link-u text-[15px] text-[var(--ink-2)] hover:text-[var(--ink)]">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)] pt-20">
      <div className="container-x grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div className="max-w-[34ch]">
          <p className="text-[18px] leading-[1.45] text-[var(--ink)]">
            We modernize operations with structured AI and connected systems, for growing companies in Boston and New York.
          </p>
          <address className="mt-6 space-y-1 text-[15px] not-italic text-[var(--ink-2)]">
            <div>
              {site.address.street}, {site.address.city}, {site.address.region} {site.address.zip}
            </div>
            <div>
              <a className="link-u" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
            <div>
              <a className="link-u" href={site.phoneHref}>
                {site.phone}
              </a>
            </div>
          </address>
        </div>
        {col("Services", services.map((s) => ({ label: s.name, href: `/services/${s.slug}` })))}
        {col("Industries", industries.map((s) => ({ label: s.name, href: `/industries/${s.slug}` })))}
        {col("Company", [
          { label: "Work", href: "/work" },
          { label: "Pricing", href: "/pricing" },
          { label: "About", href: "/about" },
          { label: "Insights", href: "/insights" },
          { label: "Contact", href: "/contact" },
        ])}
        {col("Follow", [
          { label: "LinkedIn", href: site.social.linkedin, ext: true },
          { label: "X", href: site.social.x, ext: true },
          { label: "Instagram", href: site.social.instagram, ext: true },
          { label: "Facebook", href: site.social.facebook, ext: true },
        ])}
      </div>

      <div ref={word} aria-hidden="true" className="container-x mt-20 flex select-none overflow-hidden text-[clamp(64px,19.5vw,300px)] font-medium leading-[0.82] tracking-[-0.06em] text-[var(--surface-2)]">
        {"Cognixlab".split("").map((c, i) => (
          <span key={i} className="inline-block">
            {c}
          </span>
        ))}
      </div>

      <div className="container-x flex flex-col gap-4 border-t border-[var(--line)] py-6 text-[13px] text-[var(--ink-3)] md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {site.legalName}. Registered in Massachusetts.</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li><Link className="link-u hover:text-[var(--ink)]" href="/privacy">Privacy policy</Link></li>
          <li><Link className="link-u hover:text-[var(--ink)]" href="/terms">Terms</Link></li>
          <li><Link className="link-u hover:text-[var(--ink)]" href="/data-handling">How we handle your data</Link></li>
          <li><Link className="link-u hover:text-[var(--ink)]" href="/accessibility">Accessibility</Link></li>
        </ul>
      </div>
    </footer>
  );
}
