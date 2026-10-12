"use client";

import * as React from "react";
import { gsap } from "@/lib/gsap";
import { boot } from "@/lib/boot";

/** Re-mounts on every navigation: a paper curtain wipes upward to reveal the new page. Skipped on first load. */
export default function Template({ children }: { children: React.ReactNode }) {
  const cover = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const el = cover.current;
    if (!el || !boot.done || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.set(el, { display: "block", yPercent: 0 });
    const tw = gsap.to(el, { yPercent: -100, duration: 0.9, delay: 0.05, ease: "power4.inOut", onComplete: () => { gsap.set(el, { display: "none" }); } });
    return () => { tw.kill(); gsap.set(el, { display: "none" }); };
  }, []);

  return (
    <>
      <div ref={cover} aria-hidden className="pointer-events-none fixed inset-0 z-[260] hidden bg-bone" />
      {children}
    </>
  );
}
