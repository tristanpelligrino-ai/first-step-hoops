import { Resend } from "resend";

type BookingConfirmation = {
  to: string;
  parentName: string;
  playerName: string;
  sessionDate: string;
  sessionTime: string;
  durationMin: number;
  location: string;
};

const DEFAULT_FROM = "bookings@firststep-hoops.com";

/**
 * Sends the post-payment booking confirmation email via Resend.
 * Best-effort: if Resend isn't configured or the send fails, this logs and
 * returns — it never throws, so a mail problem can't fail a paid booking.
 */
export async function sendBookingConfirmationEmail(
  b: BookingConfirmation,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping booking confirmation email");
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `First Step Hoops <${from}>`,
      to: b.to,
      subject: `Session confirmed — ${b.sessionDate}`,
      text: confirmationText(b),
      html: confirmationHtml(b),
    });
    if (error) {
      console.error("Resend error sending confirmation email:", error);
    }
  } catch (err) {
    console.error("Failed to send booking confirmation email:", err);
  }
}

function confirmationText(b: BookingConfirmation): string {
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
    `Need to make a change? Just reply to this email.`,
    ``,
    `See you on the court,`,
    `First Step Hoops`,
  ].join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function confirmationHtml(b: BookingConfirmation): string {
  const parentName = escapeHtml(b.parentName);
  const playerName = escapeHtml(b.playerName);
  const location = escapeHtml(b.location);
  const sessionDate = escapeHtml(b.sessionDate);
  const sessionTime = escapeHtml(b.sessionTime);

  return `<!doctype html>
<html>
  <body style="margin:0;background:#0a0e1a;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:2px;overflow:hidden;">
      <div style="background:#0a0e1a;padding:20px 24px;">
        <span style="color:#ffffff;font-size:18px;font-weight:bold;">first<span style="color:#3b82f6;">_</span>step hoops</span>
      </div>
      <div style="padding:24px;">
        <h1 style="margin:0 0 8px;font-size:20px;color:#0a0e1a;">Session confirmed</h1>
        <p style="margin:0 0 16px;font-size:14px;color:#444444;line-height:1.5;">
          Hi ${parentName}, ${playerName}'s training session is booked. Here are the details:
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#0a0e1a;">
          <tr><td style="padding:6px 0;color:#888888;width:90px;">Date</td><td style="padding:6px 0;">${sessionDate}</td></tr>
          <tr><td style="padding:6px 0;color:#888888;">Time</td><td style="padding:6px 0;">${sessionTime} &middot; ${b.durationMin} min</td></tr>
          <tr><td style="padding:6px 0;color:#888888;">Location</td><td style="padding:6px 0;">${location}</td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:14px;color:#444444;line-height:1.5;">
          Please arrive a few minutes early &mdash; bring a basketball, water, and court shoes.
        </p>
        <p style="margin:16px 0 0;font-size:14px;color:#444444;line-height:1.5;">
          Need to make a change? Just reply to this email.
        </p>
      </div>
      <div style="padding:16px 24px;background:#f4f4f5;font-size:12px;color:#999999;">
        First Step Hoops &middot; Youth basketball training
      </div>
    </div>
  </body>
</html>`;
}
