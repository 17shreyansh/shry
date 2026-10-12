"use client";

import * as React from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

/** Scroll reveal. With `stagger`, each direct child animates in turn. Content is visible without JS/motion. */
export function Reveal({
  children, className = "", delay = 0, y = 44, stagger = 0, as = "div",
}: {
  children: React.ReactNode; className?: string; delay?: number; y?: number; stagger?: number; as?: React.ElementType;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const Tag = as;

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const targets = stagger ? Array.from(el.children) : el;
      gsap.from(targets, {
        y, opacity: 0, duration: 0.9, delay, stagger, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });
    return () => mm.revert();
  }, [delay, y, stagger]);

  return <Tag ref={ref} className={className}>{children}</Tag>;
}
