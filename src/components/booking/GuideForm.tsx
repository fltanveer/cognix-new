"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

/** Lowest rung of the offer ladder: email-only guide download. */
export function GuideForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (!fd.name?.trim()) return setErr("Tell us your name.");
    if (!/^\S+@\S+\.\S+$/.test(fd.email || "")) return setErr("Enter a valid work email.");
    setErr("");
    setState("sending");
    const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...fd, intent: "guide", page: location.pathname }) }).catch(() => null);
    setState(r?.ok ? "done" : "error");
  }

  if (state === "done")
    return (
      <div className="card p-7" role="status">
        <p className="text-[19px]">Here’s your copy.</p>
        <a href="/guides/agentic-enterprise-blueprint.pdf" className="btn btn-primary mt-5" download>
          Download the PDF <Icon name="download" size={18} />
        </a>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="card grid gap-4 p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <label className="text-[14px] text-[var(--ink-2)]">
        Name
        <input name="name" autoComplete="name" className="mt-2 block w-full rounded-[8px] border border-[var(--line-strong)] bg-[var(--canvas)] px-4 py-3 text-[16px] text-[var(--ink)]" />
      </label>
      <label className="text-[14px] text-[var(--ink-2)]">
        Work email
        <input name="email" type="email" autoComplete="email" className="mt-2 block w-full rounded-[8px] border border-[var(--line-strong)] bg-[var(--canvas)] px-4 py-3 text-[16px] text-[var(--ink)]" />
      </label>
      <button className="btn btn-primary" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Get the guide"}
      </button>
      {(err || state === "error") && (
        <p role="alert" className="text-[14px] text-[var(--warn)] sm:col-span-3">
          {err || "Something went wrong. Try again in a moment."}
        </p>
      )}
    </form>
  );
}
