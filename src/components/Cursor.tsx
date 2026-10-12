"use client";

import * as React from "react";
import { gsap } from "@/lib/gsap";

/** Dot + ring cursor for fine pointers. Elements may set data-cursor="Label" to show a label. */
export function Cursor() {
  const dot = React.useRef<HTMLDivElement>(null);
  const ring = React.useRef<HTMLDivElement>(null);
  const label = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;
    document.documentElement.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08 });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08 });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
    gsap.set([dot.current, ring.current], { opacity: 0 });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) { shown = true; gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 }); }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const tagged = t.closest<HTMLElement>("[data-cursor]");
      const live = t.closest("a, button, [role='button'], input, select, textarea, summary, [tabindex='0']");
      const text = tagged?.dataset.cursor ?? "";
      if (label.current) label.current.textContent = text;
      gsap.to(ring.current, { scale: text ? 2.4 : live ? 1.7 : 1, duration: 0.35, ease: "power3.out" });
      gsap.to(dot.current, { scale: text ? 0 : live ? 0.4 : 1, duration: 0.25 });
    };
    const leave = () => { shown = false; gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 }); };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[250] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div ref={dot} className="absolute -left-[4px] -top-[4px] h-2 w-2 rounded-full bg-white mix-blend-difference" />
      <div ref={ring} className="absolute -left-[19px] -top-[19px] grid h-[38px] w-[38px] place-items-center rounded-full border border-white mix-blend-difference">
        <span ref={label} className="font-mono text-[0.32rem] uppercase tracking-wider text-white" />
      </div>
    </div>
  );
}
