import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { PROCESS_PAGE } from "@/content/services";
import { PROCESS_FAQ } from "@/content/faq";

export const metadata: Metadata = {
  title: "Process",
  description: "How a SHRY project runs: Understand, Plan, Build and connect, Support and improve.",
  alternates: { canonical: "/process" },
};

export default function Page() {
  return (
    <>
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "Process" }]} eyebrow="How we work" lines={["Four steps.", "No surprises."]} lead="A clear process, so you always know what's happening, what you'll get and what we need from you." visual="process" />
      <section aria-label="Phases">
        {PROCESS_PAGE.map((p, n) => (
          <article key={p.title} className={`border-b hairline ${n % 2 ? "bg-surface" : ""}`}>
            <div className="container grid gap-10 py-16 md:py-24 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <span className="outline-text display text-[clamp(6rem,16vw,14rem)] leading-[0.8]">0{n + 1}</span>
                <h2 className="display mt-4 text-[clamp(2.6rem,6vw,5.5rem)]">{p.title}</h2>
                <p className="mt-4 max-w-sm text-lg text-mute">{p.lead}</p>
              </div>
              <Reveal as="dl" stagger={0.1} className="divide-y border-y hairline lg:col-span-7">
                {[["What happens", p.happens], ["What you get", p.get], ["What we need from you", p.need]].map(([k, v]) => (
                  <div key={k} className="grid gap-2 py-6 md:grid-cols-[11rem_1fr] md:gap-8"><dt className="label pt-1 text-accent">{k}</dt><dd className="leading-relaxed">{v}</dd></div>
                ))}
              </Reveal>
            </div>
          </article>
        ))}
      </section>
      <FAQ items={PROCESS_FAQ} />
      <CTABand />
    </>
  );
}
