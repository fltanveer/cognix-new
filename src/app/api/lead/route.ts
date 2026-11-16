import { NextResponse } from "next/server";
import { escapeHtml, mailConfigured, oneLine, transporter } from "@/lib/mailer";

export const runtime = "nodejs";

/**
 * Lead intake for the contact form and the guide form. Validates, filters bots, then emails the lead to
 * LEAD_TO (default zak@cognixlab.co) from the Zoho mailbox in SMTP_USER, with Reply-To set to the visitor.
 * LEAD_WEBHOOK_URL, if set, also receives the lead as JSON (HubSpot, Zapier, Slack…).
 * If no delivery route is configured in production, the request fails so the form shows the email fallback
 * instead of silently dropping the lead.
 */

const MIN_FILL_MS = 3000; // humans take longer than this to fill the form
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>(); // per-instance, best effort

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const intentLabel: Record<string, string> = {
  general: "Contact form",
  bubble: "Website chat bubble",
  guide: "Guide download",
  implementation: "Implementation enquiry",
  pilot: "AI Pilot enquiry",
  assessment: "Workflow Assessment enquiry",
};

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const str = (k: string, max = 2000) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, max) : "");

  // Bots: a filled hidden field or an instant submit. Answer "ok" so they don't retry, and drop it.
  const startedAt = Number(body.t);
  if (str("_hp") || (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS)) {
    return NextResponse.json({ ok: true });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  const lead = {
    name: oneLine(str("name", 200)),
    email: oneLine(str("email", 200)),
    website: oneLine(str("website", 300)),
    fix: str("fix", 4000),
    budget: oneLine(str("budget", 50)),
    intent: oneLine(str("intent", 50)) || "general",
    page: oneLine(str("page", 300)),
    // "quick": the visitor only left an email and wants us to get back to them
    mode: str("mode", 10) === "quick" ? "quick" : "full",
    receivedAt: new Date().toISOString(),
  };
  const emailOk = /^\S+@\S+\.\S+$/.test(lead.email);
  const fullOk = lead.mode === "quick" || (lead.name && (lead.intent === "guide" || lead.fix.length >= 10));
  if (!emailOk || !fullOk) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 422 });
  }

  const hook = process.env.LEAD_WEBHOOK_URL;
  if (!mailConfigured() && !hook) {
    if (process.env.NODE_ENV === "production") {
      console.error("[lead] No delivery configured: set SMTP_USER/SMTP_PASS (or LEAD_WEBHOOK_URL)");
      return NextResponse.json({ ok: false, error: "Not configured" }, { status: 503 });
    }
    console.info("[lead] dev: mail not configured; lead logged only", { ...lead, email: lead.email.replace(/(.).+@/, "$1***@") });
    return NextResponse.json({ ok: true });
  }

  let delivered = false;

  if (mailConfigured()) {
    const quick = lead.mode === "quick";
    const label = quick
      ? lead.intent === "bubble" ? "Message from chat bubble" : "Callback request"
      : (intentLabel[lead.intent] ?? `Enquiry (${lead.intent})`);
    // Quick leads may still carry a short note (the chat bubble's optional message).
    const note = quick
      ? lead.fix ? `Their message:\n${lead.fix}` : "They only left an email and asked us to get back to them."
      : lead.intent === "guide" ? "Downloaded the guide." : `What they want to fix:\n${lead.fix}`;
    const who = lead.name || lead.email;
    const rows: [string, string][] = [
      ["Name", lead.name || "-"],
      ["Email", lead.email],
      ["Website", lead.website || "-"],
      ["Budget", lead.budget || "-"],
      ["Form", label],
      ["Page", lead.page || "-"],
      ["Received", new Date(lead.receivedAt).toUTCString()],
    ];
    const text = [
      ...rows.map(([k, v]) => `${k}: ${v}`),
      "",
      note,
      "",
      "Reply to this email to answer them directly.",
    ].join("\n");
    const html = `<div style="font:15px/1.55 -apple-system,Segoe UI,Arial,sans-serif;color:#16180f;max-width:620px">
  <p style="margin:0 0 16px;font-size:17px"><strong>${escapeHtml(label)}</strong> from the Cognixlab website</p>
  <table style="border-collapse:collapse;width:100%">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6b6f63;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0">${escapeHtml(v)}</td></tr>`
    )
    .join("")}</table>
  ${
    quick && !lead.fix
      ? `<p style="margin:18px 0 0">They only left an email and asked us to get back to them.</p>`
      : quick
      ? `<p style="margin:18px 0 6px;color:#6b6f63">Their message</p><p style="margin:0;white-space:pre-wrap;padding:12px 14px;background:#f3f5ee;border-radius:8px">${escapeHtml(lead.fix)}</p>`
      : lead.intent === "guide"
      ? `<p style="margin:18px 0 0">Downloaded the guide.</p>`
      : `<p style="margin:18px 0 6px;color:#6b6f63">What they want to fix</p><p style="margin:0;white-space:pre-wrap;padding:12px 14px;background:#f3f5ee;border-radius:8px">${escapeHtml(lead.fix)}</p>`
  }
  <p style="margin:20px 0 0;color:#6b6f63;font-size:13px">Reply to this email to answer ${escapeHtml(who)} directly.</p>
</div>`;
    try {
      await transporter().sendMail({
        from: { name: "Cognixlab website", address: process.env.SMTP_USER! },
        to: process.env.LEAD_TO || "zak@cognixlab.co",
        replyTo: lead.name ? { name: lead.name, address: lead.email } : lead.email,
        subject: `${label}: ${who}${lead.budget ? ` · ${lead.budget}` : ""}`,
        text,
        html,
      });
      delivered = true;
    } catch (e) {
      console.error("[lead] mail failed", e instanceof Error ? e.message : e);
    }
  }

  if (hook) {
    const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) }).catch(() => null);
    if (r?.ok) delivered = true;
    else console.error("[lead] webhook failed", r?.status);
  }

  return delivered ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
}
