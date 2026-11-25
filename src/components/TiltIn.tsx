"use client";

import * as React from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

/** Scroll-scrubbed 3D entrance: the child tilts up from the floor and comes into light. */
export function TiltIn({ children, className = "", glow }: { children: React.ReactNode; className?: string; glow?: string }) {
  const root = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const wide = window.matchMedia("(min-width: 768px)").matches;
      const st = { trigger: el, start: "top 95%", end: "top 30%", scrub: 0.6 };
      gsap.fromTo(el.querySelector("[data-tilt-body]"),
        { rotateX: wide ? 30 : 16, scale: 0.86, y: 50, filter: "brightness(0.5)" },
        { rotateX: 0, scale: 1, y: 0, filter: "brightness(1)", ease: "none", scrollTrigger: st });
      const g = el.querySelector("[data-tilt-glow]");
      if (g) gsap.fromTo(g, { opacity: 0 }, { opacity: 0.35, ease: "none", scrollTrigger: st });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className={`relative [perspective:1800px] ${className}`}>
      {glow && <div data-tilt-glow aria-hidden className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-[120px]" style={{ background: `radial-gradient(closest-side, ${glow}, transparent)` }} />}
      <div data-tilt-body className="relative origin-bottom will-change-transform">{children}</div>
    </div>
  );
}
