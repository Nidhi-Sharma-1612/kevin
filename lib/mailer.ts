import "server-only";

import nodemailer from "nodemailer";
import { getSiteSettings } from "@/lib/cms";

const FALLBACK_TO_EMAIL = "Contact@laconciergeriedelsol.com";

// Distinct from a real SMTP failure (auth rejected, host unreachable,
// etc.) — this means the deployment itself is missing an env var, which
// `.env.local` being gitignored makes easy to forget when setting up a new
// hosting environment.
export class MissingConfigError extends Error {}

export function smtpTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !port || !user || !pass) {
    throw new MissingConfigError(
      "SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASSWORD must all be set"
    );
  }
  return nodemailer.createTransport({
    host,
    port: Number(port),
    // 465 is SMTP-over-TLS from the start; every other port (587, 25, …)
    // starts plain and upgrades via STARTTLS, which Nodemailer handles on
    // its own when `secure` is false.
    secure: Number(port) === 465,
    auth: { user, pass },
  });
}

// Same recipient the contact page itself displays (settings.email from the
// CMS, falling back to the same default) — one source of truth for "where
// do enquiries go," not a separately hardcoded address that could drift.
export async function conciergeEmail(): Promise<string> {
  const settings = await getSiteSettings().catch(() => null);
  return settings?.email || FALLBACK_TO_EMAIL;
}

export function senderEmail(): string | undefined {
  return process.env.SMTP_FROM || process.env.SMTP_USER;
}

export type BookingFailureAlert = {
  stripeSessionId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  guestName: string;
  guestEmail: string;
  amountPaid: string;
  reason: string;
};

// A paid stay that didn't reach Lodgify is still open on every channel
// until someone blocks it by hand, so the concierge team has to hear about
// it right away rather than it sitting in a server log.
export async function sendBookingFailureAlert(alert: BookingFailureAlert) {
  await smtpTransport().sendMail({
    from: senderEmail(),
    to: await conciergeEmail(),
    subject: `ACTION NEEDED: paid booking missing from Lodgify — ${alert.propertyName}`,
    text: [
      "A guest paid on the website, but the reservation could not be created in Lodgify.",
      "These dates may still be open on other channels. Please add the booking by hand.",
      "",
      `Property: ${alert.propertyName}`,
      `Stay: ${alert.checkIn} to ${alert.checkOut}`,
      `Guests: ${alert.guests}`,
      `Guest: ${alert.guestName} <${alert.guestEmail}>`,
      `Amount paid: ${alert.amountPaid}`,
      `Stripe session: ${alert.stripeSessionId}`,
      `Reason: ${alert.reason}`,
    ].join("\n"),
  });
}
