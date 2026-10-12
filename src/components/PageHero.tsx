"use client";

import * as React from "react";
import Link from "next/link";
import { Visual, type VisualKind } from "@/components/Visuals";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { boot } from "@/lib/boot";

export type Crumb = { label: string; href?: string };

/** Shared page opener: breadcrumb, oversized masked headline, lead, actions, generative visual. */
export function PageHero({
  crumbs, eyebrow, lines, lead, visual, actions, invert = false,
}: {
  crumbs?: Crumb[]; eyebrow?: string; lines: React.ReactNode[]; lead?: React.ReactNode;
  visual?: VisualKind; actions?: React.ReactNode; invert?: boolean;
}) {
  const root = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.timeline({ delay: boot.done ? 0.55 : 1.45, defaults: { ease: "power4.out" } })
        .from("[data-line] > span", { yPercent: 115, rotate: 2.5, duration: 1, stagger: 0.1 })
        .from("[data-fade]", { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.7")
        .from("[data-visual]", { opacity: 0, duration: 1.4 }, 0.2);
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden border-b hairline">
      {visual && (
        <div data-visual aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-full opacity-60 lg:w-[64%] lg:opacity-100 [mask-image:linear-gradient(to_right,transparent,#000_38%)]">
          <Visual kind={visual} invert={invert} />
        </div>
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent lg:hidden" />
      <div className="container relative z-10 flex min-h-[min(780px,90svh)] flex-col justify-end pb-14 pt-36 md:pb-20">
        {crumbs && (
          <nav data-fade aria-label="Breadcrumb" className="label mb-8 flex flex-wrap items-center gap-2">
            {crumbs.map((c, i) => (
              <React.Fragment key={c.label}>
                {i > 0 && <span aria-hidden className="text-accent">/</span>}
                {c.href ? <Link href={c.href} className="transition-colors hover:text-ink">{c.label}</Link> : <span className="text-ink/80" aria-current="page">{c.label}</span>}
              </React.Fragment>
            ))}
          </nav>
        )}
        {eyebrow && <p data-fade className="label mb-6 flex items-center gap-3"><span className="h-px w-10 bg-accent" aria-hidden />{eyebrow}</p>}
        <h1 className="display text-[clamp(2.7rem,8.4vw,8.8rem)]">
          {lines.map((l, i) => <span key={i} data-line className="mask"><span>{l}</span></span>)}
        </h1>
        {lead && <p data-fade className="lead mt-8 max-w-xl">{lead}</p>}
        {actions && <div data-fade className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">{actions}</div>}
      </div>
    </section>
  );
}
