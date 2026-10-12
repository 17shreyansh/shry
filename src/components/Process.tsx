"use client";

import * as React from "react";
import Link from "next/link";
import { gsap, MOTION_OK } from "@/lib/gsap";

const STEPS = [
  ["01", "Understand", "We start with your business and the actual problem, not a feature list.", "bg-surface text-ink"],
  ["02", "Plan", "We define an appropriate solution and a scope that fits it.", "bg-surface2 text-ink"],
  ["03", "Build and connect", "We implement the solution and integrate the systems it needs.", "bg-bone text-obsidian"],
  ["04", "Support and improve", "Where ongoing support is agreed, we keep improving the technology.", "bg-[#1f232b] text-ink"],
] as const;

export function Process() {
  const root = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(c, { scale: 0.93, filter: "brightness(0.55)", ease: "none", scrollTrigger: { trigger: next, start: "top 85%", end: "top 15%", scrub: true } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="process" ref={root} className="bg-obsidian pb-24 pt-[var(--pad-section)]">
      <div className="container">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="label lg:col-span-3">How SHRY works</p>
          <h2 className="h2 lg:col-span-9 max-w-[14ch]">A clear path from problem to working system.</h2>
        </div>
        <ol className="mt-16">
          {STEPS.map(([n, t, d, tone], i) => (
            <li
              key={n}
              data-card
              style={{ position: "sticky", top: `calc(5.5rem + ${i * 1.1}rem)` }}
              className={`relative mb-8 flex min-h-[58vh] flex-col justify-between overflow-hidden rounded-[1.75rem] p-7 md:p-12 ${tone}`}
            >
              <p className="label !text-current opacity-60">Step {n} of 04</p>
              <span aria-hidden className="outline-text display pointer-events-none absolute -bottom-6 right-4 select-none text-[clamp(9rem,26vw,24rem)] leading-[0.75] opacity-25 md:right-10">{n}</span>
              <div className="relative max-w-xl">
                <h3 className="display text-[clamp(2.4rem,5.6vw,5.4rem)]">{t}</h3>
                <p className="mt-5 max-w-md text-[1.05rem] opacity-75">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="container  pb-20 pt-4"><Link href="/process" className="group inline-flex items-center gap-2 rounded-full border border-current px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-obsidian">The full process <span aria-hidden>→</span></Link></div>
    </section>
  );
}
