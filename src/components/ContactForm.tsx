"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  Loader2,
  Mail,
  Phone,
  Building2,
  User,
  Copy,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "error" | "unconfigured";

const TOPICS = [
  { id: "Websites & Software", label: "Websites & Software", desc: "Website, Web App or Mobile App" },
  { id: "AI & Automation", label: "AI & Automation", desc: "Workflows & Process Automation" },
  { id: "Integrations & APIs", label: "Integrations & APIs", desc: "Connecting Tools & Systems" },
  { id: "Maintenance & Support", label: "Maintenance & Support", desc: "Ongoing Updates, Hosting & Care" },
  { id: "Consulting", label: "Consulting", desc: "Architecture & Advisory" },
];

const TIMELINES = [
  { id: "Immediate", label: "Immediate (< 1 mo)" },
  { id: "1-3 Months", label: "1 – 3 months" },
  { id: "Flexible", label: "Flexible / Exploring" },
];

export function ContactForm() {
  const params = useSearchParams();
  const initialTopic = params.get("topic") ?? "";

  const [selectedTopic, setSelectedTopic] = React.useState("Websites & Software");
  const [selectedTimeline, setSelectedTimeline] = React.useState("1-3 Months");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [status, setStatus] = React.useState<Status>("idle");
  const [msg, setMsg] = React.useState("");
  const [copiedEmail, setCopiedEmail] = React.useState(false);
  const [copiedEnquiry, setCopiedEnquiry] = React.useState(false);

  // Sync if topic in query changes
  React.useEffect(() => {
    if (initialTopic) {
      const t = initialTopic.toLowerCase();
      if (t.includes("build") || t.includes("website") || t.includes("software")) {
        setSelectedTopic("Websites & Software");
      } else if (t.includes("connect") || t.includes("integrat") || t.includes("api")) {
        setSelectedTopic("Integrations & APIs");
      } else if (t.includes("operate") || t.includes("support") || t.includes("maint")) {
        setSelectedTopic("Maintenance & Support");
      } else if (t.includes("ai") || t.includes("auto")) {
        setSelectedTopic("AI & Automation");
      } else {
        setSelectedTopic(initialTopic);
      }
    }
  }, [initialTopic]);

  const dev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");

    // Client-side quick checks
    if (!formData.name.trim()) {
      setMsg("Please enter your name.");
      setStatus("error");
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMsg("Please enter a valid work email address.");
      setStatus("error");
      return;
    }
    if (formData.message.trim().length < 10) {
      setMsg("Please tell us a little more about your project (at least 10 characters).");
      setStatus("error");
      return;
    }

    const payload = {
      ...formData,
      topic: selectedTopic || "General Project",
      timeline: selectedTimeline,
    };

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("sent");
        return;
      }

      const j = (await res.json().catch(() => ({}))) as { error?: string; message?: string; debug?: string };

      if (j.error === "not_configured") {
        setStatus("unconfigured");
        return;
      }

      setMsg(j.message ?? "Something went wrong sending your enquiry. Please check the details and try again.");
      setStatus("error");
    } catch {
      setMsg("We couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  function handleCopyEmail() {
    const targetEmail = SITE.email || "hello@shry.in";
    navigator.clipboard.writeText(targetEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  }

  function handleCopyEnquiry() {
    const text = [
      `Enquiry for SHRY:`,
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      formData.phone && `Phone: ${formData.phone}`,
      formData.company && `Company: ${formData.company}`,
      `Topic: ${selectedTopic || "General"}`,
      `Timeline: ${selectedTimeline}`,
      `Message:`,
      formData.message,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(text);
    setCopiedEnquiry(true);
    setTimeout(() => setCopiedEnquiry(false), 2500);
  }

  function handleReset() {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    });
    setStatus("idle");
    setMsg("");
  }

  // Success State
  if (status === "sent") {
    return (
      <div
        role="status"
        className="relative overflow-hidden rounded-3xl border border-accent/40 bg-surface/90 p-8 shadow-2xl backdrop-blur-xl md:p-12"
      >
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
        
        <div className="relative z-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-obsidian shadow-[0_0_25px_rgba(191,234,90,0.35)]">
            <Check size={28} className="stroke-[2.5]" />
          </div>

          <h3 className="h3 mt-6 text-ink">
            Thanks {formData.name ? formData.name.split(" ")[0] : ""}, we&apos;ve got your details.
          </h3>
          
          <p className="mt-3 max-w-lg text-[1.05rem] leading-relaxed text-mute">
            Your enquiry regarding <span className="font-medium text-accent">{selectedTopic || "your project"}</span> has
            been received. A confirmation has been dispatched to{" "}
            <span className="font-mono text-ink">{formData.email}</span>.
          </p>

          <div className="mt-8 rounded-2xl border border-line bg-surface-2/60 p-5">
            <p className="label text-[0.7rem] text-accent">Next Steps</p>
            <div className="mt-4 grid gap-3 text-sm text-mute sm:grid-cols-3">
              <div className="rounded-xl border border-line/60 bg-obsidian/40 p-3">
                <span className="font-mono text-xs text-accent">01. REVIEW</span>
                <p className="mt-1 text-xs text-ink/80">Systems team reviews requirements within 24 hours.</p>
              </div>
              <div className="rounded-xl border border-line/60 bg-obsidian/40 p-3">
                <span className="font-mono text-xs text-accent">02. DISCOVERY</span>
                <p className="mt-1 text-xs text-ink/80">Direct technical alignment call to clarify goals.</p>
              </div>
              <div className="rounded-xl border border-line/60 bg-obsidian/40 p-3">
                <span className="font-mono text-xs text-accent">03. BLUEPRINT</span>
                <p className="mt-1 text-xs text-ink/80">Proposed architecture, timelines, and execution plan.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button onClick={handleReset} variant="ghost" size="md">
              Send another enquiry
            </Button>
            {SITE.email && (
              <a
                href={`mailto:${SITE.email}`}
                className="text-xs text-mute transition-colors hover:text-ink underline underline-offset-4"
              >
                Or email {SITE.email} directly
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8" aria-label="Project enquiry form" noValidate>
      {/* 1. Area of Need / Topic Chips */}
      <div>
        <label className="label block mb-3">01. What do you need to build or optimize?</label>
        <div className="flex flex-wrap gap-2.5">
          {TOPICS.map((t) => {
            const isSelected = selectedTopic === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTopic(isSelected ? "" : t.id)}
                className={`group flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left text-xs transition-all duration-200 ${
                  isSelected
                    ? "border-accent bg-accent/15 text-ink shadow-[0_0_15px_rgba(191,234,90,0.15)] ring-1 ring-accent"
                    : "border-line bg-surface/60 text-mute hover:border-line hover:bg-surface hover:text-ink"
                }`}
              >
                <Sparkles
                  size={14}
                  className={`transition-colors ${isSelected ? "text-accent" : "text-mute/60 group-hover:text-ink"}`}
                />
                <span className="font-medium">{t.label}</span>
                <span className="hidden text-[0.7rem] text-mute/60 sm:inline">&bull; {t.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Timeline Selector */}
      <div>
        <label className="label block mb-3">02. Expected Timeline</label>
        <div className="flex flex-wrap gap-2.5">
          {TIMELINES.map((tl) => {
            const isSelected = selectedTimeline === tl.id;
            return (
              <button
                key={tl.id}
                type="button"
                onClick={() => setSelectedTimeline(tl.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-mono transition-all ${
                  isSelected
                    ? "border-accent bg-accent text-obsidian font-semibold"
                    : "border-line bg-surface/50 text-mute hover:border-line hover:text-ink"
                }`}
              >
                <Clock size={13} className={isSelected ? "text-obsidian" : "text-mute"} />
                <span>{tl.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Core Contact Details (2x2 Grid) */}
      <div>
        <div className="label mb-3">03. Your Contact Details</div>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="group rounded-2xl border border-line bg-surface/50 p-3.5 transition-all focus-within:border-accent focus-within:bg-surface/80 focus-within:ring-1 focus-within:ring-accent/30">
            <label htmlFor="cf-name" className="flex items-center justify-between text-[0.7rem] font-mono uppercase tracking-wider text-mute group-focus-within:text-accent">
              <span>Your Name *</span>
              <User size={13} className="text-mute/60 group-focus-within:text-accent" />
            </label>
            <input
              id="cf-name"
              name="name"
              required
              autoComplete="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 w-full bg-transparent text-[0.98rem] text-ink placeholder:text-mute/40 focus:outline-none"
              placeholder="e.g. Rahul Sharma"
            />
          </div>

          {/* Email */}
          <div className="group rounded-2xl border border-line bg-surface/50 p-3.5 transition-all focus-within:border-accent focus-within:bg-surface/80 focus-within:ring-1 focus-within:ring-accent/30">
            <label htmlFor="cf-email" className="flex items-center justify-between text-[0.7rem] font-mono uppercase tracking-wider text-mute group-focus-within:text-accent">
              <span>Work Email *</span>
              <Mail size={13} className="text-mute/60 group-focus-within:text-accent" />
            </label>
            <input
              id="cf-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 w-full bg-transparent text-[0.98rem] text-ink placeholder:text-mute/40 focus:outline-none"
              placeholder="you@company.com"
            />
          </div>

          {/* Company */}
          <div className="group rounded-2xl border border-line bg-surface/50 p-3.5 transition-all focus-within:border-accent focus-within:bg-surface/80 focus-within:ring-1 focus-within:ring-accent/30">
            <label htmlFor="cf-company" className="flex items-center justify-between text-[0.7rem] font-mono uppercase tracking-wider text-mute group-focus-within:text-accent">
              <span>Company / Project (Optional)</span>
              <Building2 size={13} className="text-mute/60 group-focus-within:text-accent" />
            </label>
            <input
              id="cf-company"
              name="company"
              autoComplete="organization"
              value={formData.company}
              onChange={handleInputChange}
              className="mt-1 w-full bg-transparent text-[0.98rem] text-ink placeholder:text-mute/40 focus:outline-none"
              placeholder="e.g. Acme Innovations"
            />
          </div>

          {/* Phone / WhatsApp */}
          <div className="group rounded-2xl border border-line bg-surface/50 p-3.5 transition-all focus-within:border-accent focus-within:bg-surface/80 focus-within:ring-1 focus-within:ring-accent/30">
            <label htmlFor="cf-phone" className="flex items-center justify-between text-[0.7rem] font-mono uppercase tracking-wider text-mute group-focus-within:text-accent">
              <span>Phone / WhatsApp (Optional)</span>
              <Phone size={13} className="text-mute/60 group-focus-within:text-accent" />
            </label>
            <input
              id="cf-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 w-full bg-transparent text-[0.98rem] text-ink placeholder:text-mute/40 focus:outline-none"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
      </div>

      {/* 4. Project Details & Message */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="cf-message" className="label">
            04. Tell us about the project & goals *
          </label>
          <span className="font-mono text-[0.68rem] text-mute">
            {formData.message.length} / 5000 chars {formData.message.length >= 10 && <CheckCircle2 size={12} className="inline ml-1 text-accent" />}
          </span>
        </div>
        <div className="group rounded-2xl border border-line bg-surface/50 p-4 transition-all focus-within:border-accent focus-within:bg-surface/80 focus-within:ring-1 focus-within:ring-accent/30">
          <textarea
            id="cf-message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full resize-none bg-transparent text-[0.98rem] leading-relaxed text-ink placeholder:text-mute/40 focus:outline-none"
            placeholder="What are you aiming to build or solve? Mention any technical preferences, target launch dates, or key features. A few lines is plenty."
          />
        </div>
      </div>

      {/* Honeypot for bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Dynamic Error State */}
      {status === "error" && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
          <div className="flex-1">
            <p className="font-medium">{msg}</p>
          </div>
        </div>
      )}

      {/* Unconfigured State (e.g. before user sets Hostinger SMTP password) */}
      {status === "unconfigured" && (
        <div role="status" className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-mute">
          <div className="flex items-center gap-2 text-ink font-medium">
            <AlertCircle size={16} className="text-amber-400" />
            <span>Direct Email Ready</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-mute">
            SMTP delivery is being connected. You can copy your filled enquiry or email us directly at{" "}
            <a className="text-ink underline underline-offset-4" href={`mailto:${SITE.email || "hello@shry.in"}`}>
              {SITE.email || "hello@shry.in"}
            </a>
            .
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyEnquiry}
              className="text-xs"
            >
              <Copy size={13} />
              {copiedEnquiry ? "Enquiry Copied!" : "Copy Enquiry"}
            </Button>
            <a
              href={`mailto:${SITE.email || "hello@shry.in"}?subject=${encodeURIComponent(
                `Project Enquiry: ${selectedTopic || "General"}`
              )}&body=${encodeURIComponent(
                `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nCompany: ${formData.company}\nTopic: ${selectedTopic}\nTimeline: ${selectedTimeline}\n\nMessage:\n${formData.message}`
              )}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-4 py-2 text-xs text-ink hover:border-accent"
            >
              Open in Mail App <ArrowUpRight size={13} />
            </a>
          </div>

          {dev && (
            <div className="mt-4 border-t border-line/60 pt-3 text-[0.72rem] font-mono text-mute/80">
              <span className="font-bold text-accent">Developer Setup:</span> Add Hostinger credentials to{" "}
              <code className="text-ink">.env.local</code>:
              <pre className="mt-1.5 overflow-x-auto rounded-lg bg-obsidian p-2 text-[0.7rem] text-ink/90">
                {`SMTP_HOST=smtp.hostinger.com\nSMTP_PORT=465\nSMTP_USER=hello@shry.in\nSMTP_PASS=your_hostinger_password\nCONTACT_TO=hello@shry.in`}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Submit Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
        <Button
          type="submit"
          size="lg"
          disabled={status === "sending"}
          className="w-full sm:w-auto min-w-[200px]"
        >
          {status === "sending" ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Sending Enquiry…</span>
            </>
          ) : (
            <>
              <span>Send Enquiry</span>
              <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </>
          )}
        </Button>

        <div className="flex items-center gap-2 text-xs text-mute">
          <span>Prefer direct email?</span>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1 font-mono text-ink underline underline-offset-4 hover:text-accent transition-colors"
          >
            {SITE.email || "hello@shry.in"}
            <Copy size={11} className="opacity-70" />
          </button>
          {copiedEmail && <span className="text-[0.68rem] text-accent font-mono animate-fade">Copied!</span>}
        </div>
      </div>
    </form>
  );
}
