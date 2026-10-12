import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { WorkflowLog } from "@/components/WorkflowLog";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { AI_PAGE } from "@/content/services";
import { AI_FAQ } from "@/content/faq";

export const metadata: Metadata = {
  title: "AI & Automation",
  description: "Practical AI and automation that removes repetitive work, with a person reviewing the output where it matters.",
  alternates: { canonical: "/ai-automation" },
};

export default function Page() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "AI & Automation" }]}
        eyebrow="Practical AI"
        lines={["Less repetitive work.", "Better-connected", "systems."]}
        lead="We use AI where it genuinely helps: on frequent, consistent, tedious work, inside the software you already use."
        visual="automation"
      />

      <section className="section-pad" aria-labelledby="ex">
        <div className="container">
          <p className="label">Where it helps</p>
          <h2 id="ex" className="h2 mt-5 max-w-[14ch]">Four places to start.</h2>
          <Reveal as="ul" stagger={0.1} className="mt-14 grid gap-px overflow-hidden rounded-2xl border hairline bg-line md:grid-cols-2">
            {AI_PAGE.examples.map((e, n) => (
              <li key={e.title} className="bg-obsidian p-8 md:p-10">
                <span className="label">0{n + 1}</span>
                <h3 className="mt-4 font-display text-2xl font-bold leading-tight tracking-tight">{e.title}</h3>
                <p className="mt-4 text-mute">{e.how}</p>
                <p className="mt-5 border-t hairline pt-4 text-sm"><span className="text-accent">Where a person stays in charge — </span>{e.person}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-y hairline bg-surface" aria-labelledby="log">
        <div className="container grid items-center gap-12 py-24 md:py-32 lg:grid-cols-2">
          <div><p className="label">One workflow, step by step</p><h2 id="log" className="h2 mt-5 max-w-[12ch]">A human in the loop.</h2><p className="lead mt-6 max-w-md">Automation does the repetitive part. A person approves anything that matters before it goes out.</p></div>
          <WorkflowLog />
        </div>
      </section>

      <section className="section-pad" aria-labelledby="ap">
        <div className="container">
          <p className="label">Approach</p>
          <h2 id="ap" className="h2 mt-5">How we introduce it.</h2>
          <Reveal as="ol" stagger={0.1} className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {AI_PAGE.steps.map((s, n) => (
              <li key={s.title} className="border-t hairline pt-6">
                <span className="outline-text display text-6xl">0{n + 1}</span>
                <h3 className="mt-4 font-display text-xl font-bold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-sm text-mute">{s.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-bone text-obsidian" aria-labelledby="wont">
        <div className="container grid gap-12 py-24 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-4"><p className="label !text-obsidian/60">Our limits</p><h2 id="wont" className="h2 mt-5 max-w-[8ch]">What we won&apos;t do.</h2></div>
          <Reveal as="ul" stagger={0.1} className="space-y-6 lg:col-span-8">
            {AI_PAGE.wont.map((w) => <li key={w} className="border-t border-obsidian/20 pt-6 text-[clamp(1.4rem,2.8vw,2.4rem)] font-medium leading-tight tracking-tight">{w}</li>)}
          </Reveal>
        </div>
      </section>

      <section className="section-pad" aria-labelledby="ahead">
        <div className="container max-w-3xl">
          <p className="label">Looking ahead</p>
          <h2 id="ahead" className="h2 mt-5">Where this could go.</h2>
          <p className="lead mt-6">Longer term, we&apos;d like to build a platform that coordinates AI agents on behalf of businesses. That&apos;s a direction we&apos;re working toward, not a product you can buy today. What we offer now is the practical work above.</p>
        </div>
      </section>

      <FAQ items={AI_FAQ} />
      <CTABand topic="AI & automation" title="Have a repetitive process?" text="Describe it and we'll tell you honestly whether automation or AI is worth it." />
    </>
  );
}
