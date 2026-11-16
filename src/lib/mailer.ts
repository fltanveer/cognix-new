import nodemailer, { type Transporter } from "nodemailer";

/**
 * Outgoing mail through Zoho (cognixlab.co's mail host). Server-only.
 *
 * Env (set in Vercel and in .env.local, never committed):
 *   SMTP_USER  the Zoho mailbox that sends, e.g. zak@cognixlab.co
 *   SMTP_PASS  an app-specific password for that mailbox (Zoho: My Account → Security → App Passwords)
 *   SMTP_HOST  optional, defaults to smtp.zoho.com (smtppro.zoho.com refuses this account with "554 Access Restricted")
 *   SMTP_PORT  optional, defaults to 465 (SSL)
 */
let cached: Transporter | null = null;

export function mailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function transporter() {
  if (cached) return cached;
  const port = Number(process.env.SMTP_PORT || 465);
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.zoho.com",
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return cached;
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Strips line breaks so user input can't add mail headers. */
export const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
