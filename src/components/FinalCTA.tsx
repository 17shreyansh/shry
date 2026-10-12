"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/Magnetic";
import { Marquee } from "@/components/Marquee";
import Link from "next/link";
import { gsap, MOTION_OK } from "@/lib/gsap";

export function FinalCTA() {
  const root = React.useRef<HTMLElement>(null);
  const flood = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      // The paper floods in from the bottom centre as the section arrives.
      gsap.fromTo(flood.current, { clipPath: "circle(0% at 50% 100%)" }, {
        clipPath: "circle(150% at 50% 100%)", ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 92%", end: "top 8%", scrub: true },
      });
      gsap.from("[data-cta]", { y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 35%", once: true } });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="contact" ref={root} aria-labelledby="cta-h" className="relative bg-obsidian">
      <div ref={flood} className="bg-bone text-obsidian">
        <div className="container flex min-h-[100svh] flex-col justify-center py-28">
          <p data-cta className="label !text-obsidian/65">Start a conversation</p>
          <h2 id="cta-h" data-cta className="display mt-8 text-[clamp(3.4rem,12.5vw,13rem)]">Have something important to build?</h2>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-8">
            <p data-cta className="max-w-md text-xl leading-snug tracking-tight text-obsidian/80">Tell us what your business needs. We'll help you understand the right technical approach.</p>
            <div data-cta>
              <Magnetic strength={0.4}>
                <Button size="lg" variant="dark" asChild data-cursor="Talk" className="h-20 px-12 text-lg"><Link href="/contact">
                  Discuss a project <ArrowUpRight size={22} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link></Button>
              </Magnetic>
            </div>
          </div>
        </div>
        <Marquee tone="paper" />
      </div>
    </section>
  );
}
