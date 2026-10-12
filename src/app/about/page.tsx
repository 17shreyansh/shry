import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Sectors } from "@/components/Sectors";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "About",
  description: "SHRY is an emerging technology company that builds, connects and manages the systems businesses depend on.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  ["Plain language", "You shouldn't need to speak software to make good technology decisions."],
  ["Built to last", "Systems that can be maintained, understood and improved over time."],
  ["Honest scope", "We say what's realistic, and what isn't, before work begins."],
];

export default function Page() {
  return (
    <>
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "About" }]} eyebrow="About SHRY" lines={["Technology should", "work in the", "real world."]} lead="SHRY is an emerging technology company. We build, connect and manage the systems businesses depend on." visual="about" />
      <section className="section-pad" aria-labelledby="story">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4"><p className="label">Our approach</p><h2 id="story" className="h2 mt-5 max-w-[10ch]">Engineering, built around your business.</h2></div>
          <div className="space-y-6 text-lg leading-relaxed text-ink/85 lg:col-span-7 lg:col-start-6">
            <p>We started SHRY because most businesses don&apos;t need more software. They need the right software, connected to the rest of what they use, and someone who keeps it working.</p>
            <p>So we work across the whole life of a system: building it, connecting it to your other tools, and operating it after launch. One partner, one understanding of how your business runs.</p>
            <p>We&apos;re a young company, and we&apos;d rather show you real work and plain scope than make big claims.</p>
          </div>
        </div>
      </section>
      <section className="border-y hairline bg-surface" aria-label="Principles">
        <Reveal as="ul" stagger={0.1} className="container grid gap-px py-20 md:grid-cols-3 md:gap-12 md:py-28">
          {PRINCIPLES.map(([t, d], n) => (
            <li key={t} className="border-t hairline pt-6"><span className="label text-accent">0{n + 1}</span><p className="mt-4 font-display text-3xl font-extrabold tracking-tight">{t}</p><p className="mt-3 text-mute">{d}</p></li>
          ))}
        </Reveal>
      </section>
      <section className="section-pad" aria-label="Technology">
        <div className="container">
          <p className="label">What we build with</p>
          <ul className="mt-6 flex flex-wrap gap-2">{["Next.js", "React", "TypeScript", "Tailwind CSS"].map((t) => <li key={t} className="rounded-full border hairline px-5 py-2 font-mono text-sm">{t}</li>)}</ul>
        </div>
      </section>
      <Sectors />
      <CTABand />
    </>
  );
}
