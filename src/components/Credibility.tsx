"use client";

import * as React from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

const STATEMENT = "Built with an engineering mindset. Designed around real business needs.";

export function Credibility() {
  const root = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.fromTo("[data-word]", { opacity: 0.14 }, {
        opacity: 1, stagger: 0.1, ease: "none",
        scrollTrigger: { trigger: "[data-statement]", start: "top 85%", end: "bottom 40%", scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-label="Approach" className="bg-bone text-obsidian">
      <div className="container py-28 md:py-44">
        <p className="label !text-obsidian/60">Approach</p>
        <p data-statement className="h2 mt-8 max-w-[16ch] !text-[clamp(2.6rem,8.4vw,8.4rem)] sm:max-w-none">
          {STATEMENT.split(" ").map((w, i) => (
            <span key={i} data-word className="mr-[0.22em] inline-block">{w}</span>
          ))}
        </p>
        <div className="mt-16 grid gap-px overflow-hidden border border-obsidian/15 bg-obsidian/15 sm:grid-cols-3">
          {[["Build", "Websites, apps and custom software."], ["Connect", "Integrations and practical automation."], ["Operate", "Hosting, maintenance and support."]].map(([t, d]) => (
            <div key={t} className="bg-bone p-6">
              <p className="font-display text-2xl font-extrabold tracking-tight">{t}</p>
              <p className="mt-2 text-sm text-obsidian/65">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
