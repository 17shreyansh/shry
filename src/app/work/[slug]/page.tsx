import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Sketch } from "@/components/Sketch";
import { Reveal } from "@/components/Reveal";
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
    description: `${p.product} Built by SHRY.`,
    alternates: { canonical: `/work/${p.id}` },
    openGraph: {
      title: `${title} | SHRY`,
      description: p.product,
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
        actions={p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-obsidian">Visit {p.name} <ArrowUpRight size={16} /></a> : undefined}
      />
      <section className="section-pad">
        <div className="container">
          <div className="overflow-hidden rounded-2xl border hairline bg-surface shadow-[0_40px_120px_-30px_rgba(191,234,90,0.18)]">
            <div className="flex gap-1.5 border-b hairline px-4 py-3" aria-hidden><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /></div>
            <div className="aspect-[8/5]">{p.image ? <img src={p.image} alt={`${p.name} interface`} className="h-full w-full object-cover object-top" /> : <Sketch variant={p.variant} />}</div>
          </div>
          {!p.image && <p className="label mt-3 text-[0.65rem]">Illustrative interface — project screenshots coming soon</p>}
        </div>
      </section>
      <section className="border-y hairline">
        <Reveal stagger={0.12} className="container grid gap-px py-20 md:py-28 lg:grid-cols-3 lg:gap-14">
          {[["The problem", p.problem], ["The product", p.product], ["What SHRY did", p.contribution]].map(([k, v]) => (
            <div key={k} className="border-t hairline pt-6"><p className="label text-accent">{k}</p><p className="mt-4 text-[clamp(1.3rem,2.2vw,1.9rem)] leading-snug tracking-tight">{v}</p></div>
          ))}
        </Reveal>
      </section>
      <section className="section-pad">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4"><p className="label">Our role</p></div>
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
