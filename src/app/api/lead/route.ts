import { NextResponse } from "next/server";

/**
 * Lead intake. Validates, then forwards to LEAD_WEBHOOK_URL if set (HubSpot workflow, Zapier, Make, Slack…).
 * Records the source page so you can see which pages produce meetings.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const str = (k: string, max = 2000) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, max) : "");
  const lead = {
    name: str("name", 200),
    email: str("email", 200),
    website: str("website", 300),
    fix: str("fix"),
    budget: str("budget", 50),
    intent: str("intent", 50) || "general",
    page: str("page", 300),
    receivedAt: new Date().toISOString(),
  };
  if (!lead.name || !/^\S+@\S+\.\S+$/.test(lead.email) || (lead.intent !== "guide" && lead.fix.length < 10)) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 422 });
  }

  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) }).catch(() => null);
    if (!r || !r.ok) return NextResponse.json({ ok: false, error: "Upstream failed" }, { status: 502 });
  } else {
    console.info("[lead] LEAD_WEBHOOK_URL not set; lead logged only", { ...lead, email: lead.email.replace(/(.).+@/, "$1***@") });
  }
  return NextResponse.json({ ok: true });
}
