"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Copy, Mail, MessageCircleMore, Phone, X } from "lucide-react";
import { site } from "@/content/site";

const digits = site.phoneHref.replace(/\D/g, "");
const whatsappHref = `https://wa.me/${digits}?text=${encodeURIComponent("Hi Cognixlab, I found you through the website.")}`;

/** WhatsApp mark (Simple Icons, CC0). Brand marks are shown only for the real service they link to. */
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

type View = "menu" | "form";
type Status = "idle" | "sending" | "sent" | "error";

/**
 * Floating "talk to us" button. Opens a small panel with three ways in: WhatsApp, a phone call (with the number
 * shown in full and a copy button, since many people copy it into their own phone or dialer), or a short message
 * form that goes through /api/lead like the main contact form.
 */
export function ContactBubble() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("menu");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [emailErr, setEmailErr] = useState("");
  const [scrolled, setScrolled] = useState(false);
  // Section tone behind the button: lime on dark sections, black on light or lime ones so it never disappears.
  const [onLight, setOnLight] = useState(false);
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const shownAt = useRef(0);
  const panelId = useId();
  const titleId = useId();

  const close = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) toggle.current?.focus();
  }, []);

  // On scroll: fold the label on phones (CSS limits that to small screens) and read the section tone under the button.
  useEffect(() => {
    const lightAt = () => {
      const r = toggle.current?.getBoundingClientRect();
      if (!r) return false;
      for (const el of document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)) {
        if (el.closest(".cb, header, nav.dock, #mobile-menu")) continue;
        return !!el.closest(".tone-light, .on-paper, .tone-lime");
      }
      return false;
    };
    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 480);
        setOnLight(lightAt());
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

  // Escape closes; a press outside closes without stealing focus.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && close(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close]);

  // Move focus into the panel when it opens or switches view.
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      const target = view === "form" ? panel.current?.querySelector<HTMLElement>("input[name=email]") : panel.current?.querySelector<HTMLElement>("[data-autofocus]");
      target?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open, view]);

  function onToggle() {
    if (open) return close();
    if (status === "sent") setStatus("idle");
    setView("menu");
    setOpen(true);
  }

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(site.phone);
    } catch {
      // Older browsers: select the visible number so the visitor can copy it by hand.
      const el = panel.current?.querySelector("[data-number]");
      if (el) window.getSelection()?.selectAllChildren(el);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function openForm() {
    shownAt.current = Date.now();
    setEmailErr("");
    setView("form");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (!/^\S+@\S+\.\S+$/.test(data.email || "")) {
      setEmailErr("Enter an email we can reply to.");
      e.currentTarget.querySelector<HTMLInputElement>("input[name=email]")?.focus();
      return;
    }
    setEmailErr("");
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, mode: "quick", intent: "bubble", page: window.location.pathname, t: shownAt.current }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div ref={root} className="cb" data-open={open || undefined} data-scrolled={scrolled || undefined} data-on-light={onLight || undefined}>
      <div
        ref={panel}
        id={panelId}
        role="dialog"
        aria-labelledby={titleId}
        className="cb-panel"
        inert={!open}
      >
        <div className="cb-head">
          <div className="min-w-0">
            <p id={titleId}>
              <span className="sr-only">Talk to Cognixlab</span>
              {/* eslint-disable-next-line @next/next/no-img-element -- same white wordmark as the header */}
              <img src="/brand/cognixlab-logo.webp" alt="" width={1000} height={202} className="cb-logo" />
            </p>
            <p className="cb-role mt-2">Call, WhatsApp or send us a note</p>
          </div>
          <button type="button" className="cb-x" onClick={() => close()} aria-label="Close">
            <X />
          </button>
        </div>

        {view === "menu" ? (
          <div className="cb-body">
            <div className="cb-number">
              <div className="min-w-0">
                <p className="cb-label">Call or WhatsApp us</p>
                <p data-number="" className="cb-digits tnum">
                  {site.phone}
                </p>
              </div>
              <button type="button" className="cb-copy" onClick={copyNumber} aria-label={copied ? "Number copied" : `Copy ${site.phone}`}>
                {copied ? <Check /> : <Copy />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Phone number copied" : ""}
              </span>
            </div>

            <div className="cb-actions">
              <a data-autofocus="" href={whatsappHref} target="_blank" rel="noopener" className="cb-act cb-act-wa">
                <WhatsAppIcon />
                WhatsApp
              </a>
              <a href={site.phoneHref} className="cb-act">
                <Phone />
                Call
              </a>
            </div>

            <div className="cb-or" aria-hidden="true">
              <span>or</span>
            </div>

            <button type="button" className="cb-msg" onClick={openForm}>
              <span className="cb-msg-icon">
                <Mail />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-[15px] text-[var(--ink)]">Send a message</span>
                <span className="block text-[13px] text-[var(--ink-3)]">We reply within one business day</span>
              </span>
              <ArrowRight className="cb-msg-arrow" />
            </button>
          </div>
        ) : status === "sent" ? (
          <div className="cb-body" role="status">
            <p className="flex items-center gap-2.5 text-[17px] text-[var(--ink)]">
              <span className="cb-done">
                <Check />
              </span>
              Thanks. We’ve got it.
            </p>
            <p className="mt-2 text-[14.5px] text-[var(--ink-2)]">You’ll get a reply by email within one business day.</p>
            <button type="button" className="cb-back mt-5" onClick={() => setView("menu")}>
              <ArrowLeft /> Back
            </button>
          </div>
        ) : (
          <form className="cb-body relative" onSubmit={onSubmit} noValidate>
            <button type="button" className="cb-back" onClick={() => setView("menu")}>
              <ArrowLeft /> Back
            </button>
            <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label>
                Leave this empty
                <input name="_hp" tabIndex={-1} autoComplete="off" defaultValue="" />
              </label>
            </div>
            <label className="cb-field">
              Your email
              <input name="email" type="email" autoComplete="email" aria-invalid={!!emailErr} aria-describedby={emailErr ? "cb-email-err" : undefined} />
            </label>
            {emailErr && (
              <p id="cb-email-err" className="-mt-2 text-[13.5px] text-[var(--warn)]">
                {emailErr}
              </p>
            )}
            <label className="cb-field">
              <span>
                Message <span className="text-[var(--ink-3)]">(optional)</span>
              </span>
              <textarea name="fix" rows={3} placeholder="What should we know before we reply?" />
            </label>
            <button type="submit" className="cb-send" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send message"}
              <ArrowRight />
            </button>
            <p className="text-center text-[12.5px] text-[var(--ink-3)]">We never share or sell your details.</p>
            {status === "error" && (
              <p role="alert" className="text-[13.5px] text-[var(--warn)]">
                That didn’t send. Email{" "}
                <a className="underline" href={`mailto:${site.email}`}>
                  {site.email}
                </a>{" "}
                instead.
              </p>
            )}
          </form>
        )}
      </div>

      <button
        ref={toggle}
        type="button"
        className="cb-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close contact options" : "Call, WhatsApp or message us"}
        onClick={onToggle}
      >
        {/* A chat mark and a visible label, not a phone: the button opens options, it never dials. */}
        <span className="cb-icons" aria-hidden="true">
          <MessageCircleMore className="cb-ic cb-ic-chat" />
          <X className="cb-ic cb-ic-x" />
        </span>
        <span className="cb-label-text" aria-hidden="true">
          Talk to us
        </span>
      </button>
    </div>
  );
}
