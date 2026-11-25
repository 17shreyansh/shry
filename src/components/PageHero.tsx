"use client";

import * as React from "react";
import Link from "next/link";
import type { VisualKind } from "@/components/Visuals";
import { HeroScene, type SceneShape } from "@/components/HeroScene";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { boot } from "@/lib/boot";

export type Crumb = { label: string; href?: string };

/** Which 3D sculpture opens each kind of page. */
const SHAPE: Record<VisualKind, SceneShape> = {
  build: "stack", process: "stack",
  connect: "ring", automation: "ring",
  operate: "gyro", contact: "gyro",
  about: "monolith", work: "monolith",
};

/**
 * Shared page opener: breadcrumb, oversized masked headline (last line set in the
 * serif accent), lead, actions, and a lighter version of the home 3D scene.
 */
export function PageHero({
  crumbs, eyebrow, lines, lead, visual, actions, tint, accent = true,
}: {
  crumbs?: Crumb[]; eyebrow?: string; lines: React.ReactNode[]; lead?: React.ReactNode;
  visual?: VisualKind; actions?: React.ReactNode; invert?: boolean;
  /** Light colour of the scene (defaults to the SHRY lime). */
  tint?: string;
  /** Set the last headline line in the serif accent (multi-line headlines only). */
  accent?: boolean;
}) {
  const root = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.timeline({ delay: boot.done ? 0.45 : 0.8, defaults: { ease: "power4.out" } })
        .from("[data-line] > span", { yPercent: 118, rotate: 2, duration: 1.15, stagger: 0.1 })
        .from("[data-fade]", { y: 18, opacity: 0, duration: 0.85, stagger: 0.07 }, "-=0.8");
      gsap.to("[data-copy]", {
        yPercent: -14, opacity: 0.15, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  const last = lines.length - 1;

  return (
    <section ref={root} data-world="off" className="relative overflow-hidden border-b hairline bg-obsidian">
      {visual && <HeroScene variant="page" shape={SHAPE[visual]} tint={tint} />}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,11,0.88)_0%,rgba(8,9,11,0.45)_50%,transparent_75%)] max-md:bg-[linear-gradient(0deg,rgba(8,9,11,0.96)_30%,rgba(8,9,11,0.5)_75%,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian to-transparent" />

      <div data-copy className="container relative z-10 flex min-h-[min(820px,92svh)] flex-col justify-end pb-14 pt-36 md:pb-20">
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
        <h1 className="display max-w-[16ch] text-[clamp(2.7rem,8vw,8.4rem)]">
          {lines.map((l, i) => (
            <span key={i} data-line className="mask">
              <span>{accent && last > 0 && i === last ? <em className="serif" style={{ color: tint ?? "var(--accent)" }}>{l}</em> : l}</span>
            </span>
          ))}
        </h1>
        {lead && <p data-fade className="lead mt-8 max-w-xl">{lead}</p>}
        {actions && <div data-fade className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">{actions}</div>}
      </div>
    </section>
  );
}
