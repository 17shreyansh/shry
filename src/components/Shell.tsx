"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Smooth } from "@/components/Smooth";
import { Cursor } from "@/components/Cursor";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getLenis } from "@/lib/lenis";
import { ScrollTrigger } from "@/lib/gsap";

/** Persistent chrome around every page: loader, smooth scroll, cursor, grain, nav, footer. */
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const first = React.useRef(true);

  React.useEffect(() => {
    if (first.current) { first.current = false; return; }
    const l = getLenis();
    if (l) l.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <>
      <Preloader />
      <Smooth />
      <Cursor />
      <div className="grain" aria-hidden />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-obsidian">Skip to content</a>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
