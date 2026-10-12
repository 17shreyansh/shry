import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell SHRY what you need. We'll help you understand the right technical approach.",
  alternates: { canonical: "/contact" },
};

const NEXT = ["You send us a few details.", "We reply to arrange a conversation.", "We follow with a written summary and a suggested approach."];

export default function Page() {
  const details = [["Email", SITE.email, SITE.email && `mailto:${SITE.email}`], ["Phone", SITE.phone, SITE.phone && `tel:${SITE.phone}`], ["Location", SITE.location, ""]].filter(([, v]) => v);
  return (
    <>
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} eyebrow="Start a conversation" lines={["Have something", "important to build?"]} lead="Tell us what your business needs. We'll help you understand the right technical approach." visual="contact" />
      <section className="section-pad">
        <div className="container grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7"><Suspense fallback={null}><ContactForm /></Suspense></div>
          <aside className="space-y-12 lg:col-span-4 lg:col-start-9">
            <div>
              <p className="label">What happens next</p>
              <ol className="mt-5 space-y-4">{NEXT.map((t, n) => <li key={t} className="flex gap-4 border-t hairline pt-4"><span className="font-mono text-accent">0{n + 1}</span><span>{t}</span></li>)}</ol>
            </div>
            {details.length > 0 && (
              <dl className="space-y-4">
                {details.map(([k, v, h]) => <div key={k}><dt className="label">{k}</dt><dd className="mt-1 text-lg">{h ? <a className="underline-offset-4 hover:underline" href={h}>{v}</a> : v}</dd></div>)}
              </dl>
            )}
            <p className="text-sm text-mute">{SITE.reach}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
