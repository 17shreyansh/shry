"use client";

import * as React from "react";
import Link from "next/link";
import { gsap, MOTION_OK } from "@/lib/gsap";

const PRINCIPLES = [
  ["Plain language", "You shouldn't need to speak software to make good technology decisions."],
  ["Built to last", "Systems that can be maintained, understood and improved over time."],
  ["Honest scope", "We say what's realistic, and what isn't, before work begins."],
];

const BADGE = "TECHNOLOGY SHOULD WORK IN THE REAL WORLD · ";

export function About() {
  const root = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.fromTo("[data-w]", { opacity: 0.12 }, { opacity: 1, stagger: 0.15, ease: "none", scrollTrigger: { trigger: "[data-about]", start: "top 80%", end: "bottom 50%", scrub: true } });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="about" ref={root} className="section-pad relative overflow-hidden bg-obsidian">
      <div className="container relative">
        <p className="label">About SHRY</p>
        <h2 data-about className="display mt-8 max-w-[14ch] text-[clamp(3rem,9vw,9rem)]">
          {"Technology should work in the real world.".split(" ").map((w, i) => <span key={i} data-w className="mr-[0.2em] inline-block">{w}</span>)}
        </h2>

        <div className="mt-16 grid items-start gap-14 lg:grid-cols-12">
          <p className="lead lg:col-span-5 !max-w-xl">SHRY brings software development, systems integration, and ongoing technical support together to help businesses build and improve the technology they rely on.</p>
          <div className="relative mx-auto h-40 w-40 text-accent lg:col-span-2 lg:col-start-7 lg:mx-0 lg:h-44 lg:w-44" aria-hidden>
            <svg viewBox="0 0 200 200" className="spin-slow h-full w-full">
              <defs><path id="c" d="M100 100 m-80 0 a80 80 0 1 1 160 0 a80 80 0 1 1 -160 0" /></defs>
              <text fontFamily="'Geist Mono Variable', monospace" fontSize="13" letterSpacing="3.4" fill="currentColor"><textPath href="#c" textLength="496" lengthAdjust="spacing">{BADGE}</textPath></text>
            </svg>
            <span className="absolute inset-0 grid place-items-center font-display text-3xl font-extrabold text-ink">S<span className="text-accent">.</span></span>
          </div>
          <ul className="grid gap-px overflow-hidden border hairline bg-line lg:col-span-12 md:grid-cols-3">
            {PRINCIPLES.map(([t, d]) => (
              <li key={t} className="bg-obsidian p-6 md:p-8">
                <p className="font-display text-2xl font-extrabold tracking-tight">{t}</p>
                <p className="mt-3 text-sm text-mute">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container  pb-20 pt-4"><Link href="/about" className="group inline-flex items-center gap-2 rounded-full border border-current px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-obsidian">More about SHRY <span aria-hidden>→</span></Link></div>
    </section>
  );
}
