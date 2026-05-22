import { Resend } from "resend";

/** Business inbox — receives booking notifications and parent cancel/reschedule replies. */
export const CONTACT_EMAIL = "tpelligrino@firststep-hoops.com";

const DEFAULT_FROM = "bookings@firststep-hoops.com";

export type BookingEmailInfo = {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  playerName: string;
  sessionDate: string;
  sessionTime: string;
  durationMin: number;
  location: string;
};

function getResendClient(): { resend: Resend; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email send");
    return null;
  }
  return {
    resend: new Resend(apiKey),
    from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
  };
}

/**
 * Confirmation email to the parent after a successful payment.
 * Best-effort: never throws, so a mail problem can't fail a paid booking.
 */
export async function sendBookingConfirmationEmail(
  b: BookingEmailInfo,
): Promise<void> {
  const client = getResendClient();
  if (!client) return;
  try {
    const { error } = await client.resend.emails.send({
      from: `First Step Hoops <${client.from}>`,
      to: b.parentEmail,
      replyTo: CONTACT_EMAIL,
      subject: `Session confirmed — ${b.sessionDate}`,
      text: confirmationText(b),
      html: confirmationHtml(b),
    });
    if (error) console.error("Resend error (confirmation email):", error);
  } catch (err) {
    console.error("Failed to send booking confirmation email:", err);
  }
}

/**
 * Internal notification to the business inbox that a booking came in.
 * Best-effort: never throws.
 */
export async function sendBookingNotificationEmail(
  b: BookingEmailInfo,
): Promise<void> {
  const client = getResendClient();
  if (!client) return;
  try {
    const { error } = await client.resend.emails.send({
      from: `First Step Hoops <${client.from}>`,
      to: CONTACT_EMAIL,
      replyTo: b.parentEmail,
      subject: `New booking — ${b.playerName}, ${b.sessionDate}`,
      text: notificationText(b),
      html: notificationHtml(b),
    });
    if (error) console.error("Resend error (notification email):", error);
  } catch (err) {
    console.error("Failed to send booking notification email:", err);
  }
}

// -------------------- content --------------------

function confirmationText(b: BookingEmailInfo): string {
  return [
    `Hi ${b.parentName},`,
    ``,
    `${b.playerName}'s training session with First Step Hoops is confirmed.`,
    ``,
    `  Date:     ${b.sessionDate}`,
    `  Time:     ${b.sessionTime} (${b.durationMin} minutes)`,
    `  Location: ${b.location}`,
    ``,
    `Please arrive a few minutes early. Bring a basketball, water, and court shoes.`,
    ``,
    `Need to cancel or reschedule? Reply to this email at least 48 hours before`,
    `your session.`,
    ``,
    `See you on the court,`,
    `First Step Hoops`,
  ].join("\n");
}

function notificationText(b: BookingEmailInfo): string {
  return [
    `New booking on First Step Hoops.`,
    ``,
    `  Player:   ${b.playerName}`,
    `  Session:  ${b.sessionDate} at ${b.sessionTime} (${b.durationMin} min)`,
    `  Location: ${b.location}`,
    ``,
    `Parent / guardian:`,
    `  ${b.parentName}`,
    `  ${b.parentEmail}`,
    `  ${b.parentPhone}`,
    ``,
    `Reply to this email to message the parent directly.`,
  ].join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function detailRow(label: string, value: string): string {
  return `<tr><td style="padding:6px 0;color:#888888;width:90px;vertical-align:top;">${label}</td><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`;
}

function emailShell(
  heading: string,
  intro: string,
  rows: string,
  footer: string,
): string {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#0a0e1a;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:2px;overflow:hidden;">
      <div style="background:#0a0e1a;padding:20px 24px;">
        <span style="color:#ffffff;font-size:18px;font-weight:bold;">first<span style="color:#3b82f6;">_</span>step hoops</span>
      </div>
      <div style="padding:24px;">
        <h1 style="margin:0 0 8px;font-size:20px;color:#0a0e1a;">${heading}</h1>
        <p style="margin:0 0 16px;font-size:14px;color:#444444;line-height:1.5;">${intro}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#0a0e1a;">${rows}</table>
        ${footer}
      </div>
      <div style="padding:16px 24px;background:#f4f4f5;font-size:12px;color:#999999;">
        First Step Hoops &middot; Youth basketball training
      </div>
    </div>
  </body>
</html>`;
}

function confirmationHtml(b: BookingEmailInfo): string {
  const rows =
    detailRow("Date", b.sessionDate) +
    detailRow("Time", `${b.sessionTime} · ${b.durationMin} min`) +
    detailRow("Location", b.location);
  const footer = `
        <p style="margin:16px 0 0;font-size:14px;color:#444444;line-height:1.5;">
          Please arrive a few minutes early &mdash; bring a basketball, water, and court shoes.
        </p>
        <p style="margin:16px 0 0;font-size:14px;color:#444444;line-height:1.5;">
          Need to cancel or reschedule? Reply to this email at least <strong>48 hours</strong> before your session.
        </p>`;
  return emailShell(
    "Session confirmed",
    `Hi ${escapeHtml(b.parentName)}, ${escapeHtml(b.playerName)}'s training session is booked. Here are the details:`,
    rows,
    footer,
  );
}

function notificationHtml(b: BookingEmailInfo): string {
  const rows =
    detailRow("Player", b.playerName) +
    detailRow("Date", b.sessionDate) +
    detailRow("Time", `${b.sessionTime} · ${b.durationMin} min`) +
    detailRow("Location", b.location) +
    detailRow("Parent", b.parentName) +
    detailRow("Email", b.parentEmail) +
    detailRow("Phone", b.parentPhone);
  const footer = `
        <p style="margin:16px 0 0;font-size:14px;color:#444444;line-height:1.5;">
          Reply to this email to message the parent directly.
        </p>`;
  return emailShell(
    "New booking",
    `A session was just booked and paid for.`,
    rows,
    footer,
  );
}
