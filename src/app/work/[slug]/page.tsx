import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Sketch } from "@/components/Sketch";
import { Reveal } from "@/components/Reveal";
import { Gallery } from "@/components/Gallery";
import { TiltIn } from "@/components/TiltIn";
import { CTABand } from "@/components/CTABand";
import { PROJECTS } from "@/content/site";
import { SERVICES } from "@/content/services";

export function generateStaticParams() { return PROJECTS.map((p) => ({ slug: p.id })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = PROJECTS.find((x) => x.id === params.slug);
  if (!p) return {};
  const title = `${p.name} — ${p.kind}`;
  return {
    title,
    description: p.ownedBy ? `${p.product} A product of ${p.ownedBy.name}, built by Shreyansh (SHRY).` : `${p.product} Built by SHRY.`,
    alternates: { canonical: `/work/${p.id}` },
    openGraph: {
      title: `${title} | SHRY`,
      description: p.product,
      ...(p.image ? { images: [{ url: p.image, width: 1440, height: 900, alt: `${p.name} screenshot` }] } : {}),
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const i = PROJECTS.findIndex((x) => x.id === params.slug);
  if (i < 0) notFound();
  const p = PROJECTS[i];
  const next = PROJECTS[(i + 1) % PROJECTS.length];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://shry.in/" },
      { "@type": "ListItem", position: 2, name: "Work", item: "https://shry.in/work" },
      { "@type": "ListItem", position: 3, name: p.name, item: `https://shry.in/work/${p.id}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Work", href: "/work" }, { label: p.name }]}
        eyebrow={`${p.kind} · ${p.platform}`}
        lines={[p.name]}
        lead={p.product}
        visual="work"
        tint={p.tint}
        actions={(p.url || p.links?.length) ? (
          <>
            {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-obsidian transition-colors hover:bg-ink">Visit {p.name} <ArrowUpRight size={16} /></a>}
            {p.links?.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border hairline px-6 py-3 text-sm transition-colors hover:border-accent hover:text-accent">{l.label} <ArrowUpRight size={16} /></a>
            ))}
          </>
        ) : undefined}
      />
      <section aria-label="Project facts" className="border-b hairline">
        <dl className="container grid grid-cols-2 gap-px py-8 md:grid-cols-4">
          {([
            p.ownedBy ? ["Product of", p.ownedBy.name] : p.client ? ["Client", p.client] : ["Built by", "SHRY"],
            p.ownedBy ? ["Built by", "Shreyansh"] : ["Type", p.kind],
            ["Platform", p.platform],
            ["Status", p.url ? "Live" : "Delivered"],
          ] as [string, string][]).map(([k, v]) => (
            <div key={k} className="py-3 pr-4">
              <dt className="label">{k}</dt>
              <dd className="mt-2 flex items-center gap-2 text-[0.95rem]">{k === "Status" && p.url && <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_#BFEA5A]" aria-hidden />}{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      {p.ownedBy && (
        <section aria-label="Ownership" className="border-b hairline bg-surface">
          <div className="container flex flex-col gap-3 py-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-3xl text-[0.95rem] leading-relaxed text-ink/90"><span className="label mr-3 text-accent">Credit</span>{p.ownedBy.note}</p>
            {p.ownedBy.href && <a href={p.ownedBy.href} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 text-sm text-accent underline-offset-8 hover:underline">About {p.ownedBy.name} <ArrowUpRight size={16} /></a>}
          </div>
        </section>
      )}
      <section className="section-pad">
        <div className="container">
          <TiltIn glow={p.tint} className="lg:pr-24">
            <div className="overflow-hidden rounded-2xl border hairline bg-surface shadow-[0_60px_160px_-40px_rgba(0,0,0,0.9)]">
              <div className="flex gap-1.5 border-b hairline px-4 py-3" aria-hidden><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /></div>
              <div className="aspect-[8/5]">{p.image ? <img src={p.image} alt={`${p.name} — desktop screenshot`} className="h-full w-full object-cover object-top" /> : <Sketch variant={p.variant} />}</div>
            </div>
            {p.mobile && (
              <div className="absolute -bottom-10 right-0 hidden w-[19%] min-w-[180px] max-w-[260px] rounded-[2.2rem] border-[6px] border-surface2 bg-obsidian p-1 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-line lg:block">
                <div className="overflow-hidden rounded-[1.7rem]"><img src={p.mobile} alt={`${p.name} — mobile screenshot`} loading="lazy" className="aspect-[390/780] w-full object-cover object-top" /></div>
              </div>
            )}
          </TiltIn>
          {!p.image && <p className="label mt-3 text-[0.65rem]">Illustrative interface — project screenshots coming soon</p>}
        </div>
      </section>
      {p.stats && p.stats.length > 0 && (
        <section aria-label="Key facts" className="border-t hairline">
          <Reveal stagger={0.08} className="container grid gap-px py-16 sm:grid-cols-2 md:py-20 lg:grid-cols-4">
            {p.stats.map((st) => (
              <div key={st.label} className="border-t hairline py-6 pr-6">
                <p className="display text-[clamp(3rem,6vw,5.5rem)] text-accent">{st.value}</p>
                <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-mute">{st.label}</p>
              </div>
            ))}
          </Reveal>
        </section>
      )}
      <section className="border-y hairline">
        <Reveal stagger={0.12} className="container grid gap-px py-20 md:py-28 lg:grid-cols-3 lg:gap-14">
          {[["The problem", p.problem], ["The product", p.product], [p.contributionLabel ?? "What SHRY did", p.contribution]].map(([k, v]) => (
            <div key={k} className="border-t hairline pt-6"><p className="label text-accent">{k}</p><p className="mt-4 text-[clamp(1.3rem,2.2vw,1.9rem)] leading-snug tracking-tight">{v}</p></div>
          ))}
        </Reveal>
      </section>
      {p.story && p.story.length > 0 && (
        <section className="section-pad" aria-labelledby="overview-h">
          <div className="container grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4"><p id="overview-h" className="label">Overview</p></div>
            <Reveal stagger={0.1} className="space-y-6 lg:col-span-8">
              {p.story.map((para) => <p key={para.slice(0, 32)} className="text-[clamp(1.1rem,1.6vw,1.4rem)] leading-relaxed text-ink/90">{para}</p>)}
            </Reveal>
          </div>
        </section>
      )}
      {p.gallery && p.gallery.length > 0 && (
        <section className="section-pad border-t hairline" aria-labelledby="gallery-h">
          <div className="container">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="label">Inside the product</p>
                <h2 id="gallery-h" className="h2 mt-5">Screens from {p.name}.</h2>
              </div>
              <p className="label">Real screenshots · click to enlarge</p>
            </div>
            <Gallery name={p.name} shots={p.gallery.filter((g) => g.src !== p.image)} />
          </div>
        </section>
      )}
      <section className="section-pad border-t hairline">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4"><p className="label">{p.ownedBy ? "My role" : "Our role"}</p></div>
          <ul className="flex flex-wrap gap-2 lg:col-span-8">{p.role.map((r) => <li key={r} className="rounded-full border hairline px-5 py-2 text-sm">{r}</li>)}</ul>
          {p.highlights && p.highlights.length > 0 && (
            <>
              <div className="lg:col-span-4"><p className="label">Highlights</p></div>
              <ul className="space-y-3 lg:col-span-8">{p.highlights.map((h) => <li key={h} className="border-t hairline pt-3">{h}</li>)}</ul>
            </>
          )}
          {p.relatedServices && p.relatedServices.length > 0 && (
            <>
              <div className="lg:col-span-4"><p className="label">Services involved</p></div>
              <div className="flex flex-wrap gap-3 lg:col-span-8">
                {p.relatedServices.map((slug) => {
                  const s = SERVICES.find((x) => x.slug === slug);
                  if (!s) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/services/${slug}`}
                      className="group/s inline-flex items-center gap-2 rounded-full border hairline bg-surface px-5 py-2 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      <span>{s.name}</span>
                      <ArrowUpRight size={14} className="text-mute transition-transform group-hover/s:-translate-y-0.5 group-hover/s:translate-x-0.5 group-hover/s:text-accent" />
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
      <Link href={`/work/${next.id}`} data-cursor="Open" className="group block border-t hairline p-8 transition-colors hover:bg-bone hover:text-obsidian md:p-14">
        <p className="label !text-current opacity-60">Next project</p>
        <p className="display mt-3 flex items-center gap-4 text-[clamp(3rem,10vw,9rem)]">{next.name}<ArrowUpRight className="transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" /></p>
      </Link>
      <CTABand />
    </>
  );
}
