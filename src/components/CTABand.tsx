import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/Magnetic";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";

/** Closing call to action used at the bottom of inner pages. */
export function CTABand({
  title = "Have something important to build?",
  text = "Tell us what your business needs. We'll help you understand the right technical approach.",
  topic,
  label = "Discuss a project",
}: { title?: string; text?: string; topic?: string; label?: string }) {
  return (
    <section aria-label="Contact" className="bg-bone text-obsidian">
      <div className="container py-24 md:py-36">
        <Reveal stagger={0.1}>
          <p className="label !text-obsidian/65">Start a conversation</p>
          <h2 className="display mt-6 max-w-[16ch] text-[clamp(3rem,9.5vw,10rem)]">{title}</h2>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-8">
            <p className="max-w-md text-xl leading-snug tracking-tight text-obsidian/80">{text}</p>
            <Magnetic strength={0.4}>
              <Button asChild size="lg" variant="dark" className="h-20 px-12 text-lg">
                <Link href={topic ? `/contact?topic=${encodeURIComponent(topic)}` : "/contact"} data-cursor="Talk">
                  {label} <ArrowUpRight size={22} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Link>
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </div>
      <Marquee tone="paper" />
    </section>
  );
}
