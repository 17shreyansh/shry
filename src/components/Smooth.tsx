"use client";

import * as React from "react";
import Lenis from "lenis";
import { gsap, MOTION_OK, ScrollTrigger } from "@/lib/gsap";
import { getLenis, setLenis } from "@/lib/lenis";

/** Smooth scrolling (Lenis) wired into ScrollTrigger, plus anchor-link handling. */
export function Smooth() {
  React.useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => { gsap.ticker.remove(tick); lenis.destroy(); setLenis(null); };
    });

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href") ?? "";
      if (!/^#[A-Za-z][\w-]*$/.test(id)) return;
      const el = document.querySelector<HTMLElement>(id);
      if (!el) return;
      e.preventDefault();
      const l = getLenis();
      if (l) l.scrollTo(el, { duration: 1.4 });
      else el.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("click", onClick); mm.revert(); };
  }, []);
  return null;
}
