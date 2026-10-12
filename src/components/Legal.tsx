import { PageHero } from "@/components/PageHero";

export function Legal({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: title }]} lines={[title]} lead={`Last updated ${updated}.`} />
      <section className="section-pad">
        <div className="container max-w-3xl space-y-6 text-[1.05rem] leading-relaxed text-ink/85 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_a]:text-accent [&_a]:underline">
          {children}
        </div>
      </section>
    </>
  );
}
