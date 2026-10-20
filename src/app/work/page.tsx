import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Sketch } from "@/components/Sketch";
import { Sectors } from "@/components/Sectors";
import { CTABand } from "@/components/CTABand";
import { PROJECTS } from "@/content/site";

export const metadata: Metadata = {
  title: "Client Work & Case Studies — Software & Websites",
  description:
    "Explore case studies and software built by SHRY: accommodation management web apps, high-converting business websites, and tailored digital platforms.",
  alternates: { canonical: "/work" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://shry.in/" },
    { "@type": "ListItem", position: 2, name: "Work", item: "https://shry.in/work" },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "Work" }]} eyebrow="Selected work" lines={["Real software,", "built and shipped."]} lead="A look at what we've built and the problems behind it." visual="work" />
      <section aria-label="Projects">
        {PROJECTS.map((p, i) => (
          <Link key={p.id} href={`/work/${p.id}`} data-cursor="Open" className="group block border-b hairline transition-colors duration-500 hover:bg-surface">
            <div className="container grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <p className="label"><span className="text-accent">0{i + 1}</span> · {p.kind} · {p.platform}</p>
                <h2 className="display mt-4 text-[clamp(3.4rem,9vw,9rem)] transition-transform duration-500 group-hover:translate-x-3">{p.name}</h2>
                <p className="mt-5 max-w-md text-mute">{p.product}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm text-accent underline-offset-8 group-hover:underline">Read case study <ArrowUpRight size={16} /></span>
              </div>
              <div className="lg:col-span-6">
                <div className="overflow-hidden rounded-2xl border hairline bg-surface"><div className="aspect-[8/5]">{p.image ? <img src={p.image} alt={`${p.name} interface`} loading="lazy" className="h-full w-full object-cover object-top" /> : <Sketch variant={p.variant} />}</div></div>
              </div>
            </div>
          </Link>
        ))}
      </section>
      <Sectors />
      <CTABand title="Your project could be next." />
    </>
  );
}
