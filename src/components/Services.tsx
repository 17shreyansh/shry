"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Art = {
  Build: () => (
    <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.2">
      {[0, 1, 2, 3, 4].map((i) => (
        <polygon key={i} points={`120,${20 + i * 30} 210,${65 + i * 30} 120,${110 + i * 30} 30,${65 + i * 30}`} opacity={1 - i * 0.17} fill={i === 0 ? "#BFEA5A" : "none"} stroke={i === 0 ? "#BFEA5A" : "currentColor"} />
      ))}
    </svg>
  ),
  Connect: () => (
    <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M40 50 H110 V100 H200 M110 100 V160 H200 M40 150 H110" />
      {[[40, 50], [40, 150], [200, 100], [200, 160]].map(([x, y]) => <rect key={`${x}${y}`} x={x - 11} y={y - 11} width="22" height="22" rx="3" fill="#BFEA5A" />)}
      <circle cx="110" cy="100" r="10" fill="#08090B" stroke="none" />
    </svg>
  ),
  Operate: () => (
    <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M0 100 H62 L84 40 L116 160 L142 100 H240" />
      <circle cx="142" cy="100" r="6" fill="currentColor" stroke="none" />
      <path d="M0 176 H240 M0 24 H240" opacity=".2" strokeWidth="1" />
    </svg>
  ),
};

const BANDS = [
  { key: "Build" as const, display: "Websites & Software", line: "Business websites, custom software, mobile apps and SaaS products.", items: ["Business websites", "Web applications", "Mobile apps", "SaaS products & custom software"], cta: "Explore website & software development", tone: "bg-surface2 text-ink", rule: "border-line", sub: "text-mute", btn: "bg-accent text-obsidian hover:bg-ink" },
  { key: "Connect" as const, display: "Integrations & Automation", line: "Connect your business tools and automate repetitive work.", items: ["APIs & integrations", "Connected business tools", "Workflow automation", "AI where it genuinely helps"], cta: "Explore integrations & automation", tone: "bg-[#1f232b] text-ink", rule: "border-line", sub: "text-mute", btn: "bg-accent text-obsidian hover:bg-ink" },
  { key: "Operate" as const, display: "Maintenance & Support", line: "Keep your websites and software running, updated and improving.", items: ["Maintenance & updates", "Deployment & hosting", "Troubleshooting", "Continuous improvements"], cta: "Explore maintenance & support", tone: "bg-bone text-obsidian", rule: "border-obsidian/15", sub: "text-obsidian/65", btn: "bg-obsidian text-ink hover:bg-accent hover:text-obsidian" },
];

export function Services() {
  const [active, setActive] = React.useState(0);

  return (
    <section id="services" aria-labelledby="services-h" className="bg-obsidian">
      <div className="container pb-14 pt-[var(--pad-section)]">
        <p className="label">What SHRY does</p>
        <h2 id="services-h" className="h2 mt-6 max-w-[18ch]">Websites, integrations and ongoing support — one technology partner.</h2>
      </div>

      <div className="flex flex-col lg:h-[82vh] lg:min-h-[34rem] lg:flex-row">
        {BANDS.map((b, i) => {
          const A = Art[b.key];
          const open = active === i;
          return (
            <div
              key={b.key}
              tabIndex={0}
              data-cursor="Open"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                "relative overflow-hidden px-5 py-12 outline-offset-[-4px] transition-[flex] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-8 lg:flex-[1_1_0] lg:p-10",
                b.tone, open && "lg:flex-[2.6_1_0]"
              )}
            >
              <span className={cn("label !text-current opacity-60")}>0{i + 1} / 03</span>
              <h3 className="display mt-4 text-[clamp(2.8rem,10vw,5rem)] lg:absolute lg:left-8 lg:top-24 lg:mt-0 lg:text-[clamp(2.6rem,4.8vw,4.2rem)] lg:[writing-mode:vertical-rl] lg:rotate-180">{b.display}</h3>

              <div className={cn("mt-8 transition-all duration-500 lg:absolute lg:inset-y-10 lg:left-[min(18vw,15rem)] lg:right-10 lg:mt-0 lg:flex lg:flex-col lg:justify-end", open ? "lg:translate-x-0 lg:opacity-100 lg:delay-200" : "lg:pointer-events-none lg:translate-x-6 lg:opacity-0")}>
                <div className="mb-8 hidden h-40 w-56 opacity-90 lg:block"><A /></div>
                <p className={cn("text-xl tracking-tight md:text-2xl", b.sub)}>{b.line}</p>
                <ul className={cn("mt-6 divide-y border-y", b.rule, b.rule.replace("border-", "divide-"))}>
                  {b.items.map((it) => <li key={it} className="py-3 text-[0.98rem]">{it}</li>)}
                </ul>
                <div className="mt-7">
                  <Link href={`/services/${b.key.toLowerCase()}`} className={cn("group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors", b.btn)}>
                    {b.cta} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
