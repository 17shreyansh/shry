import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { SERVICES } from "@/content/services";

export function generateStaticParams() { return SERVICES.map((s) => ({ slug: s.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = SERVICES.find((x) => x.slug === params.slug);
  if (!s) return {};
  return { title: s.name, description: s.intro, alternates: { canonical: `/services/${s.slug}` } };
}

export default function Page({ params }: { params: { slug: string } }) {
  const i = SERVICES.findIndex((x) => x.slug === params.slug);
  if (i < 0) notFound();
  const s = SERVICES[i];
  const next = SERVICES[(i + 1) % SERVICES.length];
  const prev = SERVICES[(i + SERVICES.length - 1) % SERVICES.length];
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: s.name }]}
        eyebrow={`${s.no} / 03 — ${s.name}`}
        lines={s.headline}
        lead={s.intro}
        visual={s.visual}
      />

      <section className="section-pad" aria-labelledby="inc">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4"><p className="label">What&apos;s included</p><h2 id="inc" className="h2 mt-5 max-w-[10ch]">The work, in detail.</h2></div>
          <Reveal as="ul" stagger={0.08} className="divide-y border-y hairline lg:col-span-8">
            {s.includes.map((x, n) => (
              <li key={x.title} className="grid gap-2 py-7 md:grid-cols-[3rem_1fr_1.4fr] md:gap-6">
                <span className="label">0{n + 1}</span>
                <h3 className="font-display text-2xl font-bold tracking-tight">{x.title}</h3>
                <p className="text-mute">{x.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-bone text-obsidian" aria-labelledby="fit">
        <div className="container grid gap-12 py-24 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-4"><p className="label !text-obsidian/60">Is this for you?</p><h2 id="fit" className="h2 mt-5 max-w-[9ch]">A good fit when…</h2></div>
          <Reveal as="ul" stagger={0.1} className="space-y-6 lg:col-span-8">
            {s.fit.map((f) => <li key={f} className="border-t border-obsidian/20 pt-6 text-[clamp(1.4rem,2.8vw,2.4rem)] font-medium leading-tight tracking-tight">{f}</li>)}
          </Reveal>
        </div>
      </section>

      <section className="section-pad" aria-labelledby="how">
        <div className="container">
          <p className="label">How it works</p>
          <h2 id="how" className="h2 mt-5">Three steps, no surprises.</h2>
          <Reveal as="ol" stagger={0.12} className="mt-14 grid gap-px overflow-hidden rounded-2xl border hairline bg-line md:grid-cols-3">
            {s.steps.map((x, n) => (
              <li key={x.title} className="bg-obsidian p-8 md:p-10">
                <span className="outline-text display text-7xl">0{n + 1}</span>
                <h3 className="mt-6 font-display text-2xl font-bold tracking-tight">{x.title}</h3>
                <p className="mt-3 text-mute">{x.text}</p>
              </li>
            ))}
          </Reveal>
          {s.stack && (
            <div className="mt-14">
              <p className="label">Tools we commonly build with</p>
              <ul className="mt-5 flex flex-wrap gap-2">{s.stack.map((t) => <li key={t} className="rounded-full border hairline px-5 py-2 font-mono text-sm">{t}</li>)}</ul>
            </div>
          )}
        </div>
      </section>

      <FAQ items={s.faq} />

      <nav aria-label="More services" className="grid border-t hairline md:grid-cols-2">
        {[prev, next].map((x, n) => (
          <Link key={x.slug} href={`/services/${x.slug}`} data-cursor="Open" className={`group p-8 transition-colors hover:bg-bone hover:text-obsidian md:p-14 ${n ? "md:text-right md:border-l hairline" : ""}`}>
            <p className="label !text-current opacity-60">{n ? "Next" : "Previous"}</p>
            <p className="display mt-3 flex items-center gap-3 text-[clamp(3rem,8vw,7rem)] md:justify-[inherit]">{x.name}<ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></p>
          </Link>
        ))}
      </nav>
      <CTABand topic={s.name} label={`Discuss ${s.name.toLowerCase()}`} />
    </>
  );
}
