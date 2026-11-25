"use client";

import * as React from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/Magnetic";
import { HeroDome } from "@/components/HeroDome";
import { PROJECTS } from "@/content/site";
import { boot } from "@/lib/boot";
import { gsap, MOTION_OK } from "@/lib/gsap";

const CHAPTERS = [
  { k: "01", label: "The studio" },
  { k: "02", label: "The intelligence" },
  { k: "03", label: "The promise" },
];

/**
 * Pinned, three-chapter hero. The section is tall; its inner stage sticks to the viewport
 * while scroll progress flies the camera into the AI Dome and swaps the copy.
 */
export function Hero() {
  const root = React.useRef<HTMLElement>(null);
  const progress = React.useRef(0);
  const [chapter, setChapter] = React.useState(0);

  React.useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.timeline({ delay: boot.done ? 0.35 : 0.8, defaults: { ease: "power4.out" } })
        .from("[data-c1] [data-line] > span", { yPercent: 118, rotate: 2, duration: 1.25, stagger: 0.1 })
        .from("[data-c1] [data-fade]", { y: 18, opacity: 0, duration: 0.9, stagger: 0.07 }, "-=0.85")
        .from("[data-chrome]", { opacity: 0, duration: 1 }, "-=0.6");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.4,
          onUpdate: (self) => {
            progress.current = self.progress;
            setChapter(self.progress < 0.34 ? 0 : self.progress < 0.7 ? 1 : 2);
          },
        },
      });
      tl.to("[data-c1]", { opacity: 0, y: -60, filter: "blur(8px)", duration: 0.18 }, 0.12)
        .fromTo("[data-c2]", { opacity: 0, y: 60, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.16 }, 0.3)
        .to("[data-c2]", { opacity: 0, y: -60, filter: "blur(8px)", duration: 0.16 }, 0.55)
        .fromTo("[data-c3]", { opacity: 0, y: 60, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.16 }, 0.7)
        .to("[data-bar]", { scaleX: 1, duration: 1 }, 0);
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="top" ref={root} data-world="off" aria-label="Introduction" className="relative h-[320vh] bg-obsidian motion-reduce:h-auto">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden motion-reduce:relative">
        <HeroDome progress={progress} />
        {/* legibility gradients */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,10,0.85)_0%,rgba(7,8,10,0.35)_45%,transparent_70%)] max-md:bg-[linear-gradient(0deg,rgba(7,8,10,0.96)_30%,rgba(7,8,10,0.45)_70%,transparent)]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-obsidian to-transparent" />

        {/* HUD chrome */}
        <div data-chrome aria-hidden className="pointer-events-none absolute inset-x-0 top-24 z-10 hidden md:block">
          <div className="container flex items-start justify-between">
            <ul className="space-y-2">
              {CHAPTERS.map((c, i) => (
                <li key={c.k} className={`label flex items-center gap-3 transition-colors duration-500 ${chapter === i ? "!text-accent" : "opacity-50"}`}>
                  <span className={`h-px transition-all duration-500 ${chapter === i ? "w-10 bg-accent" : "w-4 bg-line"}`} />{c.k} {c.label}
                </li>
              ))}
            </ul>
            <p className="label text-right leading-relaxed">SHRY / AI Dome<br /><span className="tabular-nums text-ink/60">{chapter === 0 ? "outside · approach" : chapter === 1 ? "inside · core online" : "orbit · systems live"}</span></p>
          </div>
        </div>

        <div className="container relative z-10 flex flex-1 flex-col justify-end pb-10 pt-32 md:pb-14">
          <div className="relative min-h-[23rem] md:min-h-[27rem]">
            {/* Chapter 1 */}
            <div data-c1 className="absolute inset-x-0 bottom-0">
              <p data-fade className="label mb-7 flex items-center gap-3"><span className="h-px w-10 bg-accent" aria-hidden /> SHRY — Software studio · India</p>
              <h1 className="display max-w-[15ch] text-[clamp(3rem,8vw,8.4rem)]">
                <span data-line className="mask"><span>We engineer the</span></span>
                <span data-line className="mask"><span>software <em className="serif text-accent">businesses</em></span></span>
                <span data-line className="mask"><span>run on.</span></span>
              </h1>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <p data-fade className="lead !max-w-md">Websites, apps, SaaS and AI automation — designed, built and kept running by one senior team.</p>
                <div data-fade className="flex items-center gap-6">
                  <Magnetic><Button size="lg" asChild data-cursor="Talk"><Link href="/contact">Start a project <ArrowUpRight size={18} /></Link></Button></Magnetic>
                  <Link href="#blueprint" className="group hidden items-center gap-2 text-[0.95rem] text-mute transition-colors hover:text-ink sm:inline-flex">Plan your project <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" /></Link>
                </div>
              </div>
            </div>

            {/* Chapter 2 */}
            <div data-c2 className="absolute inset-x-0 bottom-0 opacity-0 motion-reduce:hidden" aria-hidden={chapter !== 1}>
              <p className="label mb-7 flex items-center gap-3"><span className="h-px w-10 bg-accent" aria-hidden /> Inside the dome</p>
              <p className="display max-w-[14ch] text-[clamp(2.8rem,7.4vw,7.6rem)]">Every product, now with <em className="serif text-accent">intelligence.</em></p>
              <p className="lead mt-8 !max-w-lg">AI agents that answer enquiries, route work and write the reports — wired into the software your business already runs on, with a person in control.</p>
            </div>

            {/* Chapter 3 */}
            <div data-c3 className="absolute inset-x-0 bottom-0 opacity-0 motion-reduce:hidden" aria-hidden={chapter !== 2}>
              <p className="label mb-7 flex items-center gap-3"><span className="h-px w-10 bg-accent" aria-hidden /> Shipped, not promised</p>
              <p className="display max-w-[14ch] text-[clamp(2.8rem,7.4vw,7.6rem)]">Built. Connected. <em className="serif text-accent">Always on.</em></p>
              <ul className="mt-8 flex flex-wrap gap-3">
                {PROJECTS.map((p) => (
                  <li key={p.id}>
                    <Link href={`/work/${p.id}`} className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-obsidian/50 px-5 py-2.5 backdrop-blur-md transition-colors hover:border-accent">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden />
                      <span className="font-display font-bold tracking-tight">{p.name}</span>
                      <span className="hidden text-xs text-mute sm:inline">{p.kind}</span>
                      <ArrowUpRight size={14} className="text-mute transition-colors group-hover:text-accent" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* scroll progress */}
          <div data-chrome className="mt-10 flex items-center gap-4 motion-reduce:hidden">
            <span className="label tabular-nums">0{chapter + 1}/03</span>
            <span className="relative h-px flex-1 bg-line"><span data-bar className="absolute inset-0 origin-left scale-x-0 bg-accent" /></span>
            <span className="label hidden sm:inline">Scroll to enter the dome</span>
          </div>
        </div>
      </div>
    </section>
  );
}
