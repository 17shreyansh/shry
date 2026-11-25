"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { gsap, MOTION_OK, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";

/**
 * Site-wide scroll language, applied to every page:
 *  - velocity: --sv (signed, -1..1) on <html>, driving light trails on headings and
 *    an elastic lean on sections (see globals.css)
 *  - iris: each section after the first opens like a camera aperture as it enters
 *  - film strip: a fixed scrubber listing the page's sections with the current one lit
 */
type Frame = { el: HTMLElement; label: string };

export function ScrollFX() {
  const pathname = usePathname();
  const [frames, setFrames] = React.useState<Frame[]>([]);
  const [active, setActive] = React.useState(0);
  const [pct, setPct] = React.useState(0);

  // velocity -> CSS variable
  React.useEffect(() => {
    const root = document.documentElement;
    if (!window.matchMedia(MOTION_OK).matches) return;
    let cur = 0, lastY = window.scrollY, lastT = performance.now();
    const tick = () => {
      const l = getLenis();
      let v: number;
      if (l) v = l.velocity;
      else { const now = performance.now(), y = window.scrollY; v = ((y - lastY) / Math.max(1, now - lastT)) * 16; lastY = y; lastT = now; }
      const target = Math.max(-1, Math.min(1, v / 40));
      cur += (target - cur) * 0.18;
      if (Math.abs(cur) < 0.002) cur = 0;
      root.style.setProperty("--sv", cur.toFixed(3));
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); root.style.removeProperty("--sv"); };
  }, []);

  // iris reveals + film strip, rebuilt per page
  React.useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    let ctx: gsap.Context | null = null;
    const id = window.setTimeout(() => {
      const sections = Array.from(main.querySelectorAll<HTMLElement>(":scope > section, :scope > nav, :scope > a")).filter((s) => s.offsetHeight > 200);
      setFrames(sections.map((el, i) => {
        const h = el.querySelector("h1, h2, h3")?.textContent?.trim() || el.getAttribute("aria-label") || `Scene ${i + 1}`;
        return { el, label: h.length > 34 ? h.slice(0, 32) + "…" : h };
      }));
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
          sections.forEach((s, i) => {
            if (i === 0 || s.id === "top" || s.dataset.noIris !== undefined) return;
            gsap.fromTo(s, { clipPath: "inset(7% 5% 0% 5% round 3rem)" }, {
              clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "none",
              scrollTrigger: { trigger: s, start: "top bottom", end: "top 35%", scrub: true },
            });
          });
        });
        sections.forEach((s, i) => {
          ScrollTrigger.create({ trigger: s, start: "top 55%", end: "bottom 55%", onToggle: (self) => { if (self.isActive) setActive(i); } });
        });
        ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => setPct(self.progress) });
      });
      ScrollTrigger.refresh();
    }, 350);
    return () => { window.clearTimeout(id); ctx?.revert(); setFrames([]); setActive(0); };
  }, [pathname]);

  const go = (el: HTMLElement) => {
    const l = getLenis();
    if (l) l.scrollTo(el, { duration: 1.6 }); else el.scrollIntoView({ behavior: "smooth" });
  };

  if (frames.length < 3) return null;
  return (
    <nav aria-label="Page sections" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="group flex items-stretch gap-3">
        <ol className="flex flex-col items-end gap-[7px]">
          {frames.map((f, i) => (
            <li key={i}>
              <button type="button" onClick={() => go(f.el)} aria-label={`Go to ${f.label}`} aria-current={i === active ? "true" : undefined} className="flex items-center gap-3">
                <span className={`label whitespace-nowrap rounded-full bg-obsidian/80 px-2 py-0.5 !text-[0.62rem] backdrop-blur transition-all duration-500 ${i === active ? "!text-accent opacity-100" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"}`}>{f.label}</span>
                <span className={`block h-[3px] rounded-full transition-all duration-500 ${i === active ? "w-8 bg-accent shadow-[0_0_12px_#BFEA5A]" : "w-3 bg-white/25 group-hover:bg-white/50"}`} />
              </button>
            </li>
          ))}
        </ol>
        {/* film perforations + frame counter */}
        <div aria-hidden className="relative flex w-4 flex-col items-center justify-between rounded-[3px] border border-white/10 bg-obsidian/60 py-1 backdrop-blur">
          {Array.from({ length: 12 }).map((_, i) => <span key={i} className="h-1 w-2 rounded-[1px] bg-white/15" />)}
          <span className="absolute inset-x-0 top-0 origin-top bg-accent/25" style={{ height: `${pct * 100}%` }} />
        </div>
      </div>
      <p aria-hidden className="label mt-3 text-right !text-[0.6rem] tabular-nums">F {String(active + 1).padStart(2, "0")}/{String(frames.length).padStart(2, "0")}</p>
    </nav>
  );
}
