import { SECTORS } from "@/content/site";
import { Reveal } from "@/components/Reveal";

export function Sectors({ title = "Sectors we've worked in" }: { title?: string }) {
  return (
    <section aria-label="Sectors" className="section-pad border-t hairline">
      <div className="container">
        <p className="label">{title}</p>
        <Reveal as="ul" stagger={0.07} className="mt-10 divide-y border-y hairline hairline">
          {SECTORS.map((s) => (
            <li key={s} className="group flex items-center justify-between gap-6 py-5 transition-colors duration-300 hover:bg-bone hover:text-obsidian md:px-4">
              <span className="font-display text-[clamp(2.1rem,6.4vw,6rem)] font-extrabold leading-none tracking-[-0.045em] transition-transform duration-500 group-hover:translate-x-3">{s}</span>
              <span aria-hidden className="hidden h-3 w-3 rotate-45 bg-accent transition-colors group-hover:bg-obsidian sm:block" />
            </li>
          ))}
        </Reveal>
        <p className="mt-8 max-w-md text-sm text-mute">Our work so far spans these sectors. Every business is different, so we start by learning how yours works.</p>
      </div>
    </section>
  );
}
