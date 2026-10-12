import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Light in-memory rate limit: 5 enquiries per IP per 10 minutes. Use a shared store if you scale out.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let raw: unknown;
  try { raw = await req.json(); } catch { return NextResponse.json({ error: "bad_request", message: "Invalid request." }, { status: 400 }); }
  const b = (raw ?? {}) as Record<string, unknown>;

  if (str(b.website, 200)) return NextResponse.json({ ok: true }); // honeypot: pretend success

  const name = str(b.name, 120), email = str(b.email, 200), phone = str(b.phone, 40);
  const company = str(b.company, 160), topic = str(b.topic, 40), message = str(b.message, 4000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return NextResponse.json({ error: "invalid", message: "Please add your name, a valid email and a few lines about what you need." }, { status: 422 });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(ip)) return NextResponse.json({ error: "rate_limited", message: "Too many enquiries from this connection. Please try again later." }, { status: 429 });

  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO;
  if (!key || !to) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const text = [
    `Name: ${name}`, `Email: ${email}`, phone && `Phone: ${phone}`, company && `Company: ${company}`, `Area: ${topic || "Not sure yet"}`, "", message,
  ].filter(Boolean).join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "SHRY Website <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `New enquiry: ${topic || "General"} (${name})`,
        text,
      }),
    });
    if (!res.ok) return NextResponse.json({ error: "send_failed", message: "We couldn't send your enquiry. Please try again." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "send_failed", message: "We couldn't send your enquiry. Please try again." }, { status: 502 });
  }
}
