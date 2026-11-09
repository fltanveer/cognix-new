"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { BookButton } from "@/components/booking/Booking";
import { useLenis } from "@/components/motion/SmoothScroll";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

export function Header() {
  const pathname = usePathname();
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lenis = useLenis();

  // Hide on scroll down, reveal on scroll up; solid background once past the top.
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        setScrolled(self.scroll() > 40);
        if (prefersReducedMotion()) return;
        const hide = self.direction === 1 && self.scroll() > 400;
        gsap.to(el, { yPercent: hide ? -110 : 0, duration: 0.45, ease: "power3.out", overwrite: true });
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const m = menu.current;
    if (!m) return;
    const items = m.querySelectorAll("[data-mi]");
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      m.style.visibility = "visible";
      if (!prefersReducedMotion()) {
        gsap.fromTo(m, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "expo.inOut" });
        gsap.fromTo(items, { yPercent: 120 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.05, delay: 0.25 });
      } else m.style.clipPath = "none";
      (m.querySelector("a") as HTMLElement | null)?.focus();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
      if (prefersReducedMotion()) {
        m.style.visibility = "hidden";
        return;
      }
      gsap.to(m, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.5,
        ease: "expo.inOut",
        onComplete: () => {
          m.style.visibility = "hidden";
        },
      });
    }
  }, [open, lenis]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-[var(--canvas)]">
        Skip to content
      </a>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || open ? "border-b border-[var(--line)] bg-[color-mix(in_oklch,var(--canvas)_82%,transparent)] backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-6">
          <Logo className="relative z-[60]" />
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={isActive(n.href) ? "page" : undefined}
                    className={`relative whitespace-nowrap rounded-full px-2.5 py-2 text-[15px] transition-colors xl:px-3.5 ${
                      isActive(n.href) ? "text-[var(--ink)]" : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {n.label}
                    {isActive(n.href) && <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-[var(--ink)]" />}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <div
              className={`hidden transition-[opacity,transform] duration-300 sm:block ${
                scrolled || pathname !== "/" ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
              }`}
              inert={!scrolled && pathname === "/"}
            >
              <BookButton className="btn btn-primary btn-sm" source="header" />
            </div>
            <button
              ref={toggle}
              type="button"
              className="relative z-[60] grid h-11 w-11 place-items-center rounded-full border border-[var(--line-strong)] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <Icon name={open ? "close" : "menu"} size={22} />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        className="fixed inset-0 z-40 flex flex-col bg-[var(--canvas)] px-[var(--gutter)] pb-8 pt-28 lg:hidden"
        style={{ visibility: "hidden", clipPath: "inset(0 0 100% 0)" }}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {[{ label: "Home", href: "/" }, ...nav, { label: "Contact", href: "/contact" }].map((n) => (
              <li key={n.href} className="overflow-hidden">
                <Link
                  data-mi=""
                  href={n.href}
                  tabIndex={open ? 0 : -1}
                  className="block py-1.5 text-[40px] leading-[1.1] tracking-[-0.03em] text-[var(--ink)]"
                  aria-current={pathname === n.href ? "page" : undefined}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto overflow-hidden">
          <div data-mi="">
            <BookButton className="btn btn-primary w-full justify-center" source="mobile-menu" />
          </div>
        </div>
      </div>
    </>
  );
}
