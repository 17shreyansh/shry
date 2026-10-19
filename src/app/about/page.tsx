import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { FoundersSection } from "@/components/FoundersSection";
import { TeamSection } from "@/components/TeamSection";
import { Sectors } from "@/components/Sectors";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "About Us | SHRY — Engineering & Digital Systems",
  description:
    "SHRY is an emerging technology and engineering studio. We build, connect, and manage the resilient systems and AI-powered workflows businesses depend on.",
  alternates: { canonical: "/about" },
};

const METRICS = [
  { value: "100%", label: "Direct Engineering", sub: "Zero outsourced layers. You speak directly with builders." },
  { value: "99.9%", label: "Production Uptime", sub: "Fault-tolerant architecture built for continuous operations." },
  { value: "3-in-1", label: "Full Lifecycle", sub: "We build systems, connect workflows, and operate post-launch." },
  { value: "< 24h", label: "Direct SLA", sub: "Rapid response directly with senior technical leads." },
];

export default function AboutPage() {
  return (
    <>
      {/* Page Hero */}
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="ABOUT SHRY · THE ENGINEERING STUDIO"
        lines={["Engineering systems", "built to survive the", "real world."]}
        lead="SHRY is an engineering-first technology studio. We build reliable software, orchestrate AI-driven workflows, and operate digital systems businesses depend on."
        visual="about"
        actions={
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#founder"
              className="rounded-full bg-accent px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-obsidian transition-colors hover:bg-ink"
            >
              The Founder
            </a>
            <a
              href="#team"
              className="rounded-full border hairline bg-surface px-6 py-3 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
            >
              The Team
            </a>
          </div>
        }
      />

      {/* High-Impact Metrics Ribbon */}
      <section aria-label="Key Metrics" className="border-b hairline bg-surface2">
        <div className="container">
          <div className="grid divide-y hairline md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.label} className="p-8 lg:p-10">
                <span className="font-display text-4xl font-extrabold tracking-tight text-accent lg:text-5xl">
                  {m.value}
                </span>
                <p className="mt-3 font-display text-lg font-bold text-ink">
                  {m.label}
                </p>
                <p className="mt-1 text-xs text-mute">
                  {m.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Approach Section */}
      <section className="section-pad relative overflow-hidden bg-obsidian" aria-labelledby="approach-heading">
        <div className="container relative z-10 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="label flex items-center gap-3">
              <span className="h-px w-8 bg-accent" aria-hidden />
              Our Approach
            </p>
            <h2 id="approach-heading" className="h2 mt-5">
              Engineering, built around your business.
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-ink/80 lg:col-span-7">
            <p className="text-xl font-medium text-ink">
              We started SHRY because most businesses don&apos;t need more software for the sake of software. They need the <strong className="text-accent font-semibold">right software</strong>—connected to the tools they use every day, and backed by people who keep it operating when it counts.
            </p>
            <p>
              We deliberately operate as a senior engineering studio. You collaborate directly with the engineers designing your databases, writing your APIs, and maintaining your cloud infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Dedicated Founder Section */}
      <FoundersSection />

      {/* Dedicated Team Section */}
      <TeamSection
        variant="full"
        eyebrow="02 / THE CORE TEAM"
        title="The core team."
        lead="Our core team brings together systems architecture, practical AI engineering, and interface craft under one unified standard."
      />

      {/* Sectors We Serve */}
      <Sectors title="Industries we build & operate for" />

      {/* Closing Call to Action */}
      <CTABand
        title="Ready to build software that actually lasts?"
        text="Whether you need a full-scale web application, custom automation, or long-term operational support, speak directly with our engineering team."
        label="Start an engineering inquiry"
      />
    </>
  );
}
