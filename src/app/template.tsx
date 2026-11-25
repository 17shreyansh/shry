"use client";

import * as React from "react";
import { gsap } from "@/lib/gsap";
import { boot } from "@/lib/boot";

/**
 * Re-mounts on every navigation: a camera iris. The new page opens from a point of light
 * outward, with a thin lime aperture ring. Skipped on first load (the shutter intro runs then).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const cover = React.useRef<HTMLDivElement>(null);
  const ring = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const el = cover.current, r = ring.current;
    if (!el || !r || !boot.done || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.set([el, r], { display: "block" });
    const tl = gsap.timeline({ onComplete: () => { gsap.set([el, r], { display: "none" }); } });
    tl.fromTo(el, { "--r": "0%" }, { "--r": "75%", duration: 1.05, ease: "power3.inOut" }, 0.05)
      .fromTo(r, { scale: 0, opacity: 1 }, { scale: 2.6, opacity: 0, duration: 1.1, ease: "power3.inOut" }, 0.05);
    return () => { tl.kill(); gsap.set([el, r], { display: "none" }); };
  }, []);

  return (
    <>
      <div
        ref={cover}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[260] hidden bg-[#050507]"
        style={{ ["--r" as string]: "0%", WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent var(--r), #000 calc(var(--r) + 0.5%))", maskImage: "radial-gradient(circle at 50% 50%, transparent var(--r), #000 calc(var(--r) + 0.5%))" }}
      />
      <div ref={ring} aria-hidden className="pointer-events-none fixed left-1/2 top-1/2 z-[261] hidden h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent/70 shadow-[0_0_60px_rgba(191,234,90,0.5)]" />
      {children}
    </>
  );
}
