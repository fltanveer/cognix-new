"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { BookButton } from "@/components/booking/Booking";
import { useLenis } from "@/components/motion/SmoothScroll";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { Home, Layers, BarChart3, Building2, Wallet, Menu, X, type LucideIcon } from "lucide-react";

/**
 * Pill nav with a "tubelight": a lime lamp that slides to the hovered item and rests on the current
 * section. CSS transition with a slight overshoot stands in for a spring (no animation library needed).
 */
function TubeNav({ isActive }: { isActive: (href: string) => boolean }) {
  const list = useRef<HTMLUListElement>(null);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeIndex = nav.findIndex((n) => isActive(n.href));
  const [hover, setHover] = useState<number | null>(null);
  const [lamp, setLamp] = useState({ x: 0, w: 0, on: false });
  const target = hover ?? activeIndex;

  useEffect(() => {
    const place = () => {
      const el = target >= 0 ? links.current[target] : null;
      // Measure the <li> (positioned) against the pill, not the link against its own <li>.
      const li = el?.parentElement;
      setLamp((l) => (li ? { x: li.offsetLeft, w: li.offsetWidth, on: true } : { ...l, on: false }));
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [target]);

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul ref={list} className="tube-nav" onMouseLeave={() => setHover(null)} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHover(null)}>
        <li aria-hidden="true" className="tube-lamp" data-on={lamp.on || undefined} style={{ transform: `translateX(${lamp.x}px)`, width: lamp.w }}>
          <span className="tube-bulb" />
        </li>
        {nav.map((n, i) => (
          <li key={n.href} className="relative">
            <Link
              ref={(el) => void (links.current[i] = el)}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              className={`tube-link ${isActive(n.href) || hover === i ? "is-lit" : ""}`}
            >
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const dock: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Services", href: "/services", icon: Layers },
  { label: "Work", href: "/work", icon: BarChart3 },
  { label: "Industries", href: "/industries", icon: Building2 },
  { label: "Pricing", href: "/pricing", icon: Wallet },
];

export function Header() {
  const pathname = usePathname();
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Tone of the section under the header (top) and under the mobile dock (bottom).
  const [tone, setTone] = useState<"dark" | "light" | "lime">("dark");
  const [dockTone, setDockTone] = useState<"dark" | "light" | "lime">("dark");
  const lenis = useLenis();

  // The nav stays put; past the top it only gains a soft backdrop so it reads over content.
  useEffect(() => {
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => setScrolled(self.scroll() > 40) });
    return () => st.kill();
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const toneAt = (y: number) => {
      for (const el of document.elementsFromPoint(window.innerWidth / 2, y)) {
        if (el.closest("header, nav.dock, #mobile-menu")) continue;
        const sec = el.closest(".tone-light, .on-paper, .tone-lime");
        return sec ? (sec.classList.contains("tone-lime") ? "lime" : "light") : "dark";
      }
      return "dark";
    };
    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setTone(toneAt(36));
        setDockTone(toneAt(window.innerHeight - 36));
      });
    };
    check();
    const late = window.setTimeout(check, 400); // after the route's content settles
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(late);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [pathname]);
  const toneClass = (t: string) => (t === "light" ? "tokens-light" : t === "lime" ? "tokens-lime" : "");

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
        className={`site-header fixed inset-x-0 top-0 z-50 text-[var(--ink)] ${scrolled && !open ? "is-scrolled" : ""} ${open ? "" : toneClass(tone)}`}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-6">
          <Logo className="relative z-[60]" />
          <TubeNav isActive={isActive} />
          <div className="flex items-center gap-2">
            <div
              className={`hidden transition-[opacity,transform] duration-300 sm:block ${
                scrolled || pathname !== "/" ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
              }`}
              inert={!scrolled && pathname === "/"}
            >
              <BookButton className="btn btn-primary btn-sm" source="header" />
            </div>
          </div>
        </div>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        data-lenis-prevent=""
        className="fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-[var(--canvas)] px-[var(--gutter)] pb-28 pt-28 lg:hidden"
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

      {/* Mobile and tablet: a floating dock with the main sections and the full menu. */}
      <nav aria-label="Quick" className={`dock lg:hidden ${open ? "" : toneClass(dockTone)}`}>
        <ul className="dock-pill">
          {dock.map((d) => {
            const on = !open && (d.href === "/" ? pathname === "/" : isActive(d.href));
            const I = d.icon;
            return (
              <li key={d.href}>
                <Link href={d.href} aria-label={d.label} aria-current={on ? "page" : undefined} className={`dock-item ${on ? "is-on" : ""}`}>
                  <I size={19} strokeWidth={2.2} aria-hidden="true" />
                  {on && <span className="dock-lamp" aria-hidden="true" />}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              ref={toggle}
              type="button"
              className={`dock-item ${open ? "is-on" : ""}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={19} strokeWidth={2.2} aria-hidden="true" /> : <Menu size={19} strokeWidth={2.2} aria-hidden="true" />}
              {open && <span className="dock-lamp" aria-hidden="true" />}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
