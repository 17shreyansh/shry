import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Visual } from "@/components/Visuals";
import { Reveal } from "@/components/Reveal";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { SERVICES } from "@/content/services";
import { GENERAL_FAQ } from "@/content/faq";

export const metadata: Metadata = {
  title: "Services",
  description: "Build, Connect and Operate: websites and software, integrations and automation, and ongoing technical support.",
  alternates: { canonical: "/services" },
};

const TONE = {
  dark: { cls: "bg-surface2 text-ink", sub: "text-mute", invert: false },
  lime: { cls: "bg-[#1f232b] text-ink", sub: "text-mute", invert: false },
  bone: { cls: "bg-bone text-obsidian", sub: "text-obsidian/65", invert: true },
} as const;

export default function Page() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        eyebrow="What SHRY does"
        lines={["Build it.", "Connect it.", "Keep it running."]}
        lead="One technology partner for the whole life of your systems: from the first version to the connections between tools to the day-to-day care."
        visual="build"
      />
      <section aria-label="Services">
        {SERVICES.map((s) => {
          const t = TONE[s.tone];
          return (
            <Link key={s.slug} href={`/services/${s.slug}`} data-cursor="Open" className={`group relative block overflow-hidden ${t.cls}`}>
              <div aria-hidden className="absolute inset-y-0 right-0 w-full opacity-30 transition-opacity duration-700 group-hover:opacity-70 lg:w-1/2 lg:opacity-60"><Visual kind={s.visual} invert={t.invert} /></div>
              <div className="container relative grid gap-8 py-16 md:py-24 lg:grid-cols-12">
                <p className="label !text-current opacity-60 lg:col-span-1">{s.no}</p>
                <div className="lg:col-span-7">
                  <h2 className="display text-[clamp(4.5rem,15vw,14rem)]">{s.name}</h2>
                  <p className="mt-4 text-2xl tracking-tight">{s.tagline}</p>
                  <p className={`mt-4 max-w-lg ${t.sub}`}>{s.intro}</p>
                  <ul className="mt-8 flex flex-wrap gap-2">
                    {s.includes.map((i) => <li key={i.title} className="rounded-full border border-current/30 px-4 py-1.5 text-sm">{i.title}</li>)}
                  </ul>
                  <span className="mt-10 inline-flex items-center gap-2 text-sm font-medium underline-offset-8 group-hover:underline">Explore {s.name} <ArrowUpRight size={16} /></span>
                </div>
              </div>
            </Link>
          );
        })}
        <Link href="/ai-automation" data-cursor="Open" className="group relative block overflow-hidden bg-obsidian">
          <div aria-hidden className="absolute inset-y-0 right-0 w-full opacity-30 transition-opacity duration-700 group-hover:opacity-70 lg:w-1/2 lg:opacity-60"><Visual kind="automation" /></div>
          <div className="container relative grid gap-8 py-16 md:py-24 lg:grid-cols-12">
            <p className="label lg:col-span-1">+</p>
            <div className="lg:col-span-7">
              <h2 className="display text-[clamp(2.8rem,8vw,8rem)]">AI &amp; automation</h2>
              <p className="mt-4 text-2xl tracking-tight">Less repetitive work. Better-connected systems.</p>
              <p className="mt-4 max-w-lg text-mute">Practical AI inside workflows you already run, with a person reviewing the output where it matters.</p>
              <span className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-8 group-hover:underline">See how we approach it <ArrowUpRight size={16} /></span>
            </div>
          </div>
        </Link>
      </section>
      <FAQ items={GENERAL_FAQ} />
      <CTABand />
    </>
  );
}
