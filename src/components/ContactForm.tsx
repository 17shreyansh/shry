"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/content/site";

const field = "w-full border-b border-line bg-transparent py-3.5 text-[1.02rem] text-ink transition-colors placeholder:text-mute/50 focus:border-accent focus:outline-none";
type Status = "idle" | "sending" | "sent" | "error" | "unconfigured";

export function ContactForm() {
  const params = useSearchParams();
  const topic = params.get("topic") ?? "";
  const [status, setStatus] = React.useState<Status>("idle");
  const [msg, setMsg] = React.useState("");
  const dev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    setStatus("sending"); setMsg("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { setStatus("sent"); form.reset(); return; }
      const j = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (j.error === "not_configured") { setStatus("unconfigured"); return; }
      setMsg(j.message ?? "Something went wrong. Please check the details and try again.");
      setStatus("error");
    } catch {
      setMsg("We couldn't reach the server. Please try again in a moment.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-accent/40 bg-accent/5 p-8 md:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-obsidian"><Check size={22} /></span>
        <h3 className="h3 mt-6">Thanks, we've got it.</h3>
        <p className="mt-3 max-w-md text-mute">We'll reply by email to talk through what you need and how we can help.</p>
        <button onClick={() => setStatus("idle")} className="mt-6 text-sm text-mute underline underline-offset-4 hover:text-ink">Send another enquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7" aria-label="Project enquiry">
      <div className="grid gap-7 sm:grid-cols-2">
        <label htmlFor="cf-name" className="block"><span className="label">Name</span><input id="cf-name" name="name" required autoComplete="name" className={field} placeholder="Your name" /></label>
        <label htmlFor="cf-email" className="block"><span className="label">Email</span><input id="cf-email" name="email" type="email" required autoComplete="email" className={field} placeholder="you@company.com" /></label>
        <label htmlFor="cf-company" className="block"><span className="label">Company (optional)</span><input id="cf-company" name="company" autoComplete="organization" className={field} placeholder="Company name" /></label>
        <label htmlFor="cf-phone" className="block"><span className="label">Phone or WhatsApp (optional)</span><input id="cf-phone" name="phone" type="tel" autoComplete="tel" className={field} placeholder="+91" /></label>
      </div>
      <label htmlFor="cf-topic" className="block">
        <span className="label">What do you need?</span>
        <select id="cf-topic" name="topic" defaultValue={topic} className={`${field} appearance-none`}>
          <option value="" className="bg-surface">Not sure yet</option>
          <option value="Build" className="bg-surface">Build: website, app or software</option>
          <option value="Connect" className="bg-surface">Connect: integrations and automation</option>
          <option value="Operate" className="bg-surface">Operate: maintenance and support</option>
          <option value="AI & Automation" className="bg-surface">AI and automation</option>
        </select>
      </label>
      <label htmlFor="cf-message" className="block">
        <span className="label">Tell us about it</span>
        <textarea id="cf-message" name="message" required minLength={10} rows={5} className={`${field} resize-none`} placeholder="A few lines is plenty. We'll ask the rest." />
      </label>
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>

      {status === "error" && <p role="alert" className="rounded-lg border border-red-400/40 p-3 text-sm text-red-300">{msg}</p>}
      {status === "unconfigured" && (
        <p role="status" className="rounded-lg border border-line p-3 text-sm text-mute">
          Sending isn't available right now.{" "}
          {SITE.email ? <>Please email us at <a className="text-ink underline underline-offset-4" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</> : "Please try again shortly."}
          {dev && <span className="mt-2 block text-xs">Developer note: set RESEND_API_KEY and CONTACT_TO in .env.local to enable delivery (see .env.example).</span>}
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
        {status === "sending" ? "Sending…" : <>Send enquiry <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></>}
      </Button>
    </form>
  );
}
