import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { FoundersSection } from "@/components/FoundersSection";
import { TeamSection } from "@/components/TeamSection";
import { Sectors } from "@/components/Sectors";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "About SHRY — Technology Partner for Growing Businesses",
  description:
    "SHRY is a technology partner that builds websites, custom software and AI automations for businesses. Meet the team, learn our approach, and see how we work.",
  alternates: { canonical: "/about" },
};

const METRICS = [
  { value: "Direct", label: "Engineering Access", sub: "You speak directly with the engineers who build your software." },
  { value: "Full", label: "Project Lifecycle", sub: "We build, connect and support — one team for the whole journey." },
  { value: "India", label: "Service Reach", sub: "Working with businesses across India, remotely and on-site." },
  { value: "Open", label: "Honest Scope", sub: "We agree scope, timeline and cost in writing before work starts." },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://shry.in/" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://shry.in/about" },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {/* Page Hero */}
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="ABOUT SHRY"
        lines={["Technology partner", "for growing", "businesses."]}
        lead="SHRY brings software development, systems integration, AI automation and ongoing technical support together — so businesses have one technology partner instead of managing multiple vendors."
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

      {/* Key Facts */}
      <section aria-label="Key facts" className="border-b hairline bg-surface2">
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
              Built around your business, not the other way around.
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-ink/80 lg:col-span-7">
            <p className="text-xl font-medium text-ink">
              We started SHRY because most businesses don&apos;t need more software for the sake of software. They need the <strong className="text-accent font-semibold">right software</strong> — connected to the tools they use every day, and backed by people who keep it working when it counts.
            </p>
            <p>
              We deliberately work as a small, senior team. You collaborate directly with the engineers designing your databases, writing your APIs, and maintaining your infrastructure — not through layers of account managers.
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
        lead="Our core team brings together software development, practical AI engineering, and interface design under one unified standard."
      />

      {/* Sectors We Serve */}
      <Sectors title="Industries we've worked in" />

      {/* Closing Call to Action */}
      <CTABand
        title="Have a project in mind?"
        text="Whether you need a business website, custom software, AI automation, or ongoing technical support — tell us what your business needs."
        label="Discuss your project"
      />
    </>
  );
}
