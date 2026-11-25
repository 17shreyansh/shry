"use client";

import * as React from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/Magnetic";
import { HeroScene } from "@/components/HeroScene";
import { PROJECTS } from "@/content/site";
import { boot } from "@/lib/boot";
import { gsap, MOTION_OK } from "@/lib/gsap";

export function Hero() {
  const root = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({ delay: boot.done ? 0.35 : 0.75, defaults: { ease: "power4.out" } });
      tl.from("[data-line] > span", { yPercent: 118, rotate: 2, duration: 1.25, stagger: 0.1 })
        .from("[data-fade]", { y: 18, opacity: 0, duration: 0.9, stagger: 0.07 }, "-=0.85")
        .from("[data-credit]", { y: 14, opacity: 0, duration: 0.7, stagger: 0.06 }, "-=0.6");

      // Scroll: the copy drifts up and dims while the camera dollies into the scene.
      gsap.to("[data-copy]", {
        yPercent: -18, opacity: 0, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="top" ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-obsidian">
      <HeroScene />
      {/* legibility: darken behind the copy, not over the object */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,11,0.82)_0%,rgba(8,9,11,0.35)_45%,transparent_70%)] max-md:bg-[linear-gradient(0deg,rgba(8,9,11,0.95)_25%,rgba(8,9,11,0.4)_70%,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian to-transparent" />

      <div data-copy className="container relative z-10 flex flex-1 flex-col justify-end pb-12 pt-36 md:pb-16">
        <p data-fade className="label mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-accent" aria-hidden /> SHRY — Software studio · India
        </p>
        <h1 className="display max-w-[15ch] text-[clamp(3rem,8.2vw,8.6rem)]">
          <span data-line className="mask"><span>We engineer the</span></span>
          <span data-line className="mask"><span>software <em className="serif text-accent">businesses</em></span></span>
          <span data-line className="mask"><span>run on.</span></span>
        </h1>

        <div className="mt-10 grid items-end gap-8 lg:grid-cols-12">
          <p data-fade className="lead lg:col-span-5">
            Websites, apps, SaaS platforms and AI automation — designed, built and kept running by one senior team.
          </p>
          <div data-fade className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-7 lg:justify-end">
            <Magnetic>
              <Button size="lg" asChild data-cursor="Talk"><Link href="/contact">
                Start a project <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link></Button>
            </Magnetic>
            <Link href="#work" className="group inline-flex items-center gap-2 text-[0.95rem] text-mute transition-colors hover:text-ink">
              See the work <ArrowDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Credits strip: real, shipped products */}
      <div className="relative z-10 border-t hairline bg-obsidian/60 backdrop-blur-md">
        <div className="container flex flex-wrap items-center gap-x-10 gap-y-3 py-5">
          <p data-credit className="label">Recently shipped</p>
          {PROJECTS.map((p, i) => (
            <Link key={p.id} data-credit href={`/work/${p.id}`} className="group flex items-baseline gap-3">
              <span className="font-mono text-[0.7rem] text-accent">0{i + 1}</span>
              <span className="font-display text-lg font-bold tracking-tight transition-colors group-hover:text-accent">{p.name}</span>
              <span className="hidden text-xs text-mute sm:inline">{p.kind}</span>
            </Link>
          ))}
          <span data-credit className="label ml-auto hidden items-center gap-2 2xl:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden /> All live in production
          </span>
        </div>
      </div>
    </section>
  );
}
