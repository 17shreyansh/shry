"use client";

import * as React from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { boot } from "@/lib/boot";

/** ~1.2s counter wipe. Has a CSS fallback so it can never trap the page. */
export function Preloader() {
  const root = React.useRef<HTMLDivElement>(null);
  const num = React.useRef<HTMLSpanElement>(null);
  const bar = React.useRef<HTMLSpanElement>(null);
  const [done, setDone] = React.useState(false);

  React.useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const o = { v: 0 };
      const tl = gsap.timeline({ onComplete: () => { boot.done = true; setDone(true); } });
      tl.to(o, { v: 100, duration: 1.0, ease: "power2.inOut", onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, "0"); } })
        .to(bar.current, { scaleX: 1, duration: 1.0, ease: "power2.inOut" }, 0)
        .to(root.current, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "+=0.05");
    });
    mm.add("(prefers-reduced-motion: reduce)", () => { boot.done = true; setDone(true); });
    return () => mm.revert();
  }, []);

  if (done) return null;
  return (
    <div ref={root} aria-hidden className="pre-fallback fixed inset-0 z-[300] flex flex-col justify-between bg-obsidian p-6 md:p-10">
      <p className="label">SHRY / Loading the system</p>
      <div>
        <span ref={num} className="display block text-[clamp(6rem,24vw,22rem)] tabular-nums text-accent">000</span>
        <span ref={bar} className="mt-4 block h-px origin-left scale-x-0 bg-accent" />
      </div>
    </div>
  );
}
