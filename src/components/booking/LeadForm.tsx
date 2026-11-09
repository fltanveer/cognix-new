"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "error";
const budgets = ["Not sure yet", "Under $5k", "$5k–$15k", "$15k–$50k", "$50k+"];

/** The one lead form used site-wide: name, work email, website, what to fix, optional budget. */
export function LeadForm({ intent = "general", compact }: { intent?: string; compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const errs: Record<string, string> = {};
    if (!data.name?.trim()) errs.name = "Tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(data.email || "")) errs.email = "Enter a work email we can reply to.";
    if (!data.fix?.trim() || data.fix.trim().length < 10) errs.fix = "A sentence or two is enough.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      (form.querySelector(`[name="${Object.keys(errs)[0]}"]`) as HTMLElement | null)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, intent, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card p-8" role="status">
        <div className="flex items-center gap-3 text-[20px]">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" /> Thanks. We’ve got it.
        </div>
        <p className="mt-3 max-w-[50ch] text-[var(--ink-2)]">
          We reply within one business day. While you wait, the{" "}
          <Link className="link-u text-[var(--ink)]" href="/case-studies/auto-inspect">
            Auto Inspect
          </Link>{" "}
          and{" "}
          <Link className="link-u text-[var(--ink)]" href="/case-studies/dr-kibria-seo">
            Dr. Kibria
          </Link>{" "}
          case studies show how we work.
        </p>
      </div>
    );
  }

  const field = "mt-2 block w-full rounded-[8px] border bg-[var(--canvas)] px-4 py-3 text-[16px] text-[var(--ink)] placeholder:text-[var(--ink-3)] transition-colors focus:border-[var(--ink-2)] focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--accent)]";
  const border = (k: string) => (errors[k] ? "border-[var(--warn)]" : "border-[var(--line-strong)]");
  const Err = ({ k }: { k: string }) =>
    errors[k] ? (
      <p id={`${k}-err`} className="mt-2 flex items-center gap-1.5 text-[14px] text-[var(--warn)]">
        <Icon name="alert" size={15} /> {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className={`card space-y-5 ${compact ? "p-5" : "p-6 md:p-8"}`}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-[14.5px] text-[var(--ink-2)]">
          Name
          <input name="name" autoComplete="name" className={`${field} ${border("name")}`} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
          <Err k="name" />
        </label>
        <label className="block text-[14.5px] text-[var(--ink-2)]">
          Work email
          <input name="email" type="email" autoComplete="email" className={`${field} ${border("email")}`} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
          <Err k="email" />
        </label>
      </div>
      <label className="block text-[14.5px] text-[var(--ink-2)]">
        Company website <span className="text-[var(--ink-3)]">(optional)</span>
        <input name="website" type="url" inputMode="url" placeholder="https://" className={`${field} ${border("website")}`} />
      </label>
      <label className="block text-[14.5px] text-[var(--ink-2)]">
        What are you trying to fix?
        <textarea
          name="fix"
          rows={4}
          placeholder="e.g. Our ops team re-keys every order from email into the ERP and the CRM."
          className={`${field} ${border("fix")} resize-y`}
          aria-invalid={!!errors.fix}
          aria-describedby={errors.fix ? "fix-err" : undefined}
        />
        <Err k="fix" />
      </label>
      <fieldset>
        <legend className="text-[14.5px] text-[var(--ink-2)]">
          Budget range <span className="text-[var(--ink-3)]">(optional)</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {budgets.map((b) => (
            <label key={b} className="cursor-pointer">
              <input type="radio" name="budget" value={b} className="peer sr-only" />
              <span className="inline-block rounded-full border border-[var(--line-strong)] px-3.5 py-2 text-[14px] text-[var(--ink-2)] transition-colors peer-checked:border-[var(--ink)] peer-checked:bg-[var(--ink)] peer-checked:text-[var(--canvas)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--accent)]">
                {b}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send"}
          <Icon name="arrowRight" size={18} className="arrow" />
        </button>
        <p className="text-[13.5px] text-[var(--ink-3)]">
          We reply within one business day. See our <Link className="link-u" href="/privacy">privacy policy</Link>.
        </p>
      </div>
      {status === "error" && (
        <p role="alert" className="text-[14.5px] text-[var(--warn)]">
          That didn’t send. Please email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a> and we’ll pick it up.
        </p>
      )}
    </form>
  );
}
