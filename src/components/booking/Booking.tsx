"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "@/components/motion/SmoothScroll";
import { Icon } from "@/components/ui/Icon";

export const calendlySrc = () => {
  const u = new URL(site.booking.url);
  u.searchParams.set("embed_type", "Inline");
  u.searchParams.set("hide_gdpr_banner", "1");
  u.searchParams.set("background_color", "171a13");
  u.searchParams.set("text_color", "eef1e8");
  u.searchParams.set("primary_color", "c9f31d");
  return u.toString();
};

const Ctx = createContext<{ open: (source?: string) => void }>({ open: () => {} });
export const useBooking = () => useContext(Ctx);

/** One booking surface for the whole site: a dialog with the calendar, so every "Book" CTA books. */
export function BookingProvider({ children }: { children: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const lenis = useLenis();

  const open = useCallback(
    (source?: string) => {
      const d = dialog.current;
      if (!d) return;
      setLoaded(true);
      d.showModal();
      lenis?.stop();
      if (source) d.dataset.source = source;
      if (!prefersReducedMotion() && panel.current) {
        gsap.fromTo(panel.current, { y: 40, autoAlpha: 0, scale: 0.98 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out" });
      }
    },
    [lenis]
  );

  const close = useCallback(() => {
    const d = dialog.current;
    if (!d) return;
    const done = () => {
      d.close();
      lenis?.start();
    };
    if (prefersReducedMotion() || !panel.current) return done();
    gsap.to(panel.current, { y: 24, autoAlpha: 0, duration: 0.25, ease: "power2.in", onComplete: done });
  }, [lenis]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      close();
    };
    d.addEventListener("cancel", onCancel);
    return () => d.removeEventListener("cancel", onCancel);
  }, [close]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialog}
        aria-labelledby="booking-title"
        className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-black/80"
        onClick={(e) => e.target === dialog.current && close()}
      >
        <div className="flex min-h-full items-end justify-center p-3 md:items-center md:p-8" onClick={(e) => e.target === e.currentTarget && close()}>
          <div ref={panel} className="card relative w-full max-w-[1040px] overflow-hidden">
            <div className="flex items-start justify-between gap-6 border-b border-[var(--line)] p-5 md:p-7">
              <div>
                <h2 id="booking-title" className="text-[22px] md:text-[26px]">
                  Book a Workflow Review
                </h2>
                <p className="mt-1 max-w-[60ch] text-[15px] text-[var(--ink-2)]">
                  {site.booking.minutes} minutes, no slides, no pitch. We map one workflow with you and tell you honestly whether AI is the
                  right fix. We reply within one business day if no slot suits you.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--line-strong)] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
                aria-label="Close booking"
              >
                <Icon name="close" size={22} />
              </button>
            </div>
            <div className="relative h-[min(72vh,700px)] bg-[var(--surface)]">
              {loaded && !ready && (
                <div className="absolute inset-0 grid place-items-center text-[15px] text-[var(--ink-3)]">
                  <span className="flex items-center gap-3">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" /> Loading calendar
                  </span>
                </div>
              )}
              {loaded && (
                <iframe
                  title="Cognixlab booking calendar"
                  src={calendlySrc()}
                  onLoad={() => setReady(true)}
                  className="relative h-full w-full"
                  style={{ opacity: ready ? 1 : 0, transition: "opacity .4s" }}
                />
              )}
            </div>
            <p className="border-t border-[var(--line)] px-5 py-4 text-[14px] text-[var(--ink-3)] md:px-7">
              Prefer email? <a className="link-u text-[var(--ink-2)]" href={`mailto:${site.email}`}>{site.email}</a> · Calendar won’t load?{" "}
              <a className="link-u text-[var(--ink-2)]" href={site.booking.url} target="_blank" rel="noopener">
                Open it in a new tab
              </a>
            </p>
          </div>
        </div>
      </dialog>
    </Ctx.Provider>
  );
}

/** Primary CTA. Works without JS (links to the contact page calendar), opens the dialog with JS. */
export function BookButton({
  children = site.booking.label,
  className = "btn btn-primary",
  source,
}: {
  children?: React.ReactNode;
  className?: string;
  source?: string;
}) {
  const { open } = useBooking();
  return (
    <a
      href="/contact#book"
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        open(source);
      }}
    >
      {children}
      <Icon name="arrowRight" size={18} className="arrow" />
    </a>
  );
}
