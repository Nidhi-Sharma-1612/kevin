import { NextRequest, NextResponse } from "next/server";
import {
  conciergeEmail,
  MissingConfigError,
  senderEmail,
  smtpTransport,
} from "@/lib/mailer";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, email, phone, dates, message } = (body ?? {}) as {
    name?: string;
    email?: string;
    phone?: string;
    dates?: string;
    message?: string;
  };

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email and message are required" },
      { status: 400 }
    );
  }
  // A minimal shape check — real validation (does this inbox exist) only
  // ever happens by actually trying to send, which is what the call below
  // does.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That doesn't look like a valid email address" },
      { status: 400 }
    );
  }

  const toEmail = await conciergeEmail();
  const fromEmail = senderEmail();

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone?.trim() ? `Phone: ${phone}` : null,
    dates?.trim() ? `Dates of stay: ${dates}` : null,
    "",
    message,
  ].filter((line): line is string => line !== null);

  const htmlRows = [
    ["Name", name],
    ["Email", email],
    phone?.trim() ? ["Phone", phone] : null,
    dates?.trim() ? ["Dates of stay", dates] : null,
  ].filter((row): row is [string, string] => row !== null);

  try {
    await smtpTransport().sendMail({
      from: fromEmail,
      to: toEmail,
      // Replying to this email goes straight to the guest, not back to
      // the site's own inbox — the concierge team doesn't have to copy
      // their address out of the message body first.
      replyTo: email,
      subject: `New enquiry from ${name} — La Conciergerie Del Sol`,
      text: lines.join("\n"),
      html: `
        <table style="font-family:sans-serif;font-size:14px;color:#23272a">
          ${htmlRows
            .map(
              ([label, value]) =>
                `<tr><td style="padding:4px 12px 4px 0;color:#5a6364"><strong>${escapeHtml(label)}</strong></td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`
            )
            .join("")}
        </table>
        <p style="margin-top:16px;white-space:pre-wrap;font-family:sans-serif;font-size:14px;color:#23272a">${escapeHtml(message)}</p>
      `,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof MissingConfigError) {
      console.error("Contact form is not configured on this deployment:", error.message);
      return NextResponse.json(
        {
          error:
            "Sending isn't available right now — please email or call us directly using the details above.",
        },
        { status: 503 }
      );
    }
    console.error("Failed to send contact form email", error);
    return NextResponse.json(
      { error: "Could not send your message — please try again or contact us directly." },
      { status: 502 }
    );
  }
}
