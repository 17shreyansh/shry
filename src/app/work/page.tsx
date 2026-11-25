import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Work } from "@/components/Work";
import { Sectors } from "@/components/Sectors";
import { CTABand } from "@/components/CTABand";
import { PROJECTS } from "@/content/site";

export const metadata: Metadata = {
  title: "Client Work & Case Studies — Software & Websites",
  description:
    "Case studies of software built by SHRY: MyCloudPG accommodation management, the Nirmanveda construction-materials app, and Leadora (an Affobe Digitals product built by Shreyansh).",
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
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
        eyebrow={`Selected work · ${String(PROJECTS.length).padStart(2, "0")} products live`}
        lines={["Real software,", "shipped."]}
        lead="Products we designed, built and launched — each one running in production today. Scroll through, or open a case study for the full story."
        visual="work"
      />
      <Work intro={false} outro={false} />
      <Sectors />
      <CTABand title="Your product could be next." />
    </>
  );
}
