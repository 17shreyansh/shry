import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Light in-memory rate limit: 5 enquiries per IP per 10 minutes.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request", message: "Invalid request payload." }, { status: 400 });
  }

  const b = (raw ?? {}) as Record<string, unknown>;

  // Honeypot spam defense: pretend success if bot filled hidden field
  if (str(b.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = str(b.name, 120);
  const email = str(b.email, 200);
  const phone = str(b.phone, 40);
  const company = str(b.company, 160);
  const topic = str(b.topic, 80);
  const timeline = str(b.timeline, 60);
  const message = str(b.message, 5000);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return NextResponse.json(
      {
        error: "invalid",
        message: "Please include your name, a valid email address, and a short message (at least 10 characters).",
      },
      { status: 422 }
    );
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(ip)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many enquiries from this connection. Please try again in 10 minutes." },
      { status: 429 }
    );
  }

  // Hostinger SMTP configuration
  const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const contactTo = process.env.CONTACT_TO || smtpUser || "hello@shry.in";
  const contactFrom = process.env.CONTACT_FROM || (smtpUser ? `"SHRY Website" <${smtpUser}>` : `"SHRY Website" <hello@shry.in>`);

  const resendKey = process.env.RESEND_API_KEY;

  if (!smtpUser && !resendKey) {
    return NextResponse.json(
      {
        error: "not_configured",
        message: "Email delivery credentials are not configured yet.",
      },
      { status: 503 }
    );
  }

  const submittedAt = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "Not provided");
  const safeCompany = escapeHtml(company || "Not specified");
  const safeTopic = escapeHtml(topic || "General Project");
  const safeTimeline = escapeHtml(timeline || "Flexible");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  const plainTextAdmin = [
    `NEW ENQUIRY RECEIVED (SHRY.IN)`,
    `========================================`,
    `Name:     ${name}`,
    `Email:    ${email}`,
    phone && `Phone:    ${phone}`,
    company && `Company:  ${company}`,
    `Area:     ${topic || "General Project"}`,
    timeline && `Timeline: ${timeline}`,
    `Date:     ${submittedAt} (IST)`,
    `IP:       ${ip}`,
    `========================================`,
    `Message:`,
    message,
    `========================================`,
  ]
    .filter(Boolean)
    .join("\n");

  const htmlAdmin = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #08090b; color: #f5f5f0; margin: 0; padding: 24px; }
    .card { max-width: 620px; margin: 0 auto; background-color: #111318; border: 1px solid rgba(245,245,240,0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { padding: 28px 32px; border-bottom: 1px solid rgba(245,245,240,0.12); background-color: #15181f; }
    .badge { display: inline-block; background-color: #bfea5a; color: #08090b; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; margin-bottom: 12px; }
    .title { font-size: 22px; font-weight: 700; margin: 0; color: #f5f5f0; letter-spacing: -0.02em; }
    .meta-time { font-size: 13px; color: #a5a7ae; margin-top: 6px; }
    .content { padding: 32px; }
    .grid { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    .grid td { padding: 10px 0; border-bottom: 1px solid rgba(245,245,240,0.08); font-size: 14px; }
    .grid .label { color: #a5a7ae; width: 130px; font-weight: 500; font-family: ui-monospace, SFMono-Regular, monospace; font-size: 12px; text-transform: uppercase; }
    .grid .val { color: #f5f5f0; font-weight: 500; }
    .grid .val a { color: #bfea5a; text-decoration: none; }
    .message-box { background-color: #0d0f13; border: 1px solid rgba(245,245,240,0.1); border-radius: 12px; padding: 20px; font-size: 15px; line-height: 1.6; color: #e9e6dc; white-space: pre-wrap; word-break: break-word; }
    .action { margin-top: 28px; text-align: center; }
    .btn { display: inline-block; background-color: #bfea5a; color: #08090b; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 999px; text-decoration: none; }
    .footer { padding: 20px 32px; border-top: 1px solid rgba(245,245,240,0.08); font-size: 12px; color: #6b6d74; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">New Enquiry</span>
      <h1 class="title">Project Inquiry: ${safeTopic}</h1>
      <p class="meta-time">${submittedAt} IST &bull; IP: ${ip}</p>
    </div>
    <div class="content">
      <table class="grid">
        <tr><td class="label">Client Name</td><td class="val"><strong>${safeName}</strong></td></tr>
        <tr><td class="label">Email</td><td class="val"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
        <tr><td class="label">Phone</td><td class="val">${phone ? `<a href="tel:${safePhone}">${safePhone}</a>` : '<span style="color:#6b6d74;">Not provided</span>'}</td></tr>
        <tr><td class="label">Company</td><td class="val">${company ? safeCompany : '<span style="color:#6b6d74;">Not specified</span>'}</td></tr>
        <tr><td class="label">Area of Need</td><td class="val"><strong style="color: #bfea5a;">${safeTopic}</strong></td></tr>
        <tr><td class="label">Timeline</td><td class="val">${safeTimeline}</td></tr>
      </table>

      <div style="font-family: ui-monospace, SFMono-Regular, monospace; font-size: 11px; text-transform: uppercase; color: #a5a7ae; margin-bottom: 8px; letter-spacing: 0.05em;">Message Details</div>
      <div class="message-box">${safeMessage}</div>

      <div class="action">
        <a class="btn" href="mailto:${safeEmail}?subject=Re:%20Your%20enquiry%20with%20SHRY&body=Hi%20${encodeURIComponent(name)},%0D%0A%0D%0AThank%20you%20for%20reaching%20out%20to%20SHRY.%0D%0A">Reply to ${safeName} &rarr;</a>
      </div>
    </div>
    <div class="footer">
      Delivered directly via Hostinger SMTP &bull; SHRY Systems Engine
    </div>
  </div>
</body>
</html>
`;

  // Hostinger SMTP transport
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // SSL for 465, TLS/STARTTLS for 587
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: true,
        },
      });

      // 1. Send notification to admin/Hostinger inbox
      await transporter.sendMail({
        from: contactFrom,
        to: contactTo,
        replyTo: `"${name}" <${email}>`,
        subject: `New Enquiry: ${topic || "General"} — ${name}`,
        text: plainTextAdmin,
        html: htmlAdmin,
      });

      // 2. Send professional auto-acknowledgment to prospective client
      try {
        await transporter.sendMail({
          from: contactFrom,
          to: email,
          subject: `We've received your enquiry — SHRY`,
          text: `Hi ${name},\n\nThank you for reaching out to SHRY.\n\nWe have received your enquiry regarding "${topic || "your project"}" and our engineering team is reviewing it. We typically respond within 24 business hours to discuss the next steps.\n\nBest regards,\nSHRY Team\nhttps://shry.in`,
          html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #08090b; color: #f5f5f0; padding: 28px;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #111318; border: 1px solid rgba(245,245,240,0.12); border-radius: 14px; padding: 32px;">
    <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; color: #f5f5f0;">Thank you for contacting SHRY, ${safeName}.</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #a5a7ae;">
      We have safely received your project details regarding <strong style="color: #bfea5a;">${safeTopic}</strong>.
    </p>
    <p style="font-size: 15px; line-height: 1.6; color: #a5a7ae;">
      Every enquiry is reviewed directly by our systems team. We will review your requirements and reach back out within 24 business hours to talk through the right technical approach.
    </p>
    <div style="margin-top: 24px; padding: 16px; background-color: #0d0f13; border-radius: 8px; border: 1px solid rgba(245,245,240,0.08); font-size: 13px; color: #8e9097;">
      <strong style="color: #f5f5f0;">Your submission summary:</strong><br/>
      Area: ${safeTopic}<br/>
      Timeline: ${safeTimeline}<br/>
    </div>
    <p style="font-size: 14px; line-height: 1.6; color: #6b6d74; margin-top: 24px; margin-bottom: 0;">
      Warm regards,<br/>
      <strong style="color: #f5f5f0;">SHRY</strong> &bull; <a href="https://shry.in" style="color: #bfea5a; text-decoration: none;">shry.in</a>
    </p>
  </div>
</div>
          `,
        });
      } catch (clientAckError) {
        console.warn("Client acknowledgment email could not be sent:", clientAckError);
      }

      return NextResponse.json({ ok: true });
    } catch (err: unknown) {
      console.error("Hostinger SMTP send error:", err);
      const errMsg = err instanceof Error ? err.message : "SMTP transport failure";
      return NextResponse.json(
        {
          error: "send_failed",
          message: "We encountered a temporary issue sending your enquiry. Please reach out directly or try again in a moment.",
          debug: process.env.NODE_ENV !== "production" ? errMsg : undefined,
        },
        { status: 502 }
      );
    }
  }

  // Fallback to Resend API if configured
  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM ?? "SHRY Website <onboarding@resend.dev>",
          to: [contactTo],
          reply_to: email,
          subject: `New enquiry: ${topic || "General"} (${name})`,
          text: plainTextAdmin,
          html: htmlAdmin,
        }),
      });

      if (!res.ok) {
        return NextResponse.json({ error: "send_failed", message: "We couldn't send your enquiry. Please try again." }, { status: 502 });
      }
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ error: "send_failed", message: "We couldn't send your enquiry. Please try again." }, { status: 502 });
    }
  }

  return NextResponse.json({ error: "not_configured" }, { status: 503 });
}
