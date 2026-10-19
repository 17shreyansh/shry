"use client";

import * as React from "react";
import Link from "next/link";
import { gsap, MOTION_OK } from "@/lib/gsap";

interface StepItem {
  number: string;
  title: string;
  description: string;
  deliverable: string;
  tone: string;
  borderTone: string;
}

const STEPS: readonly StepItem[] = [
  {
    number: "01",
    title: "Understand",
    description:
      "We start with your business and the actual problem, not a predetermined feature list.",
    deliverable: "System Audit & Problem Framing",
    tone: "bg-surface text-ink",
    borderTone: "border-white/10",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "We define an appropriate technical architecture and a lean scope that fits it.",
    deliverable: "Architecture & Scope Blueprint",
    tone: "bg-surface2 text-ink",
    borderTone: "border-white/15",
  },
  {
    number: "03",
    title: "Build and connect",
    description:
      "We implement the core solution and integrate the data, APIs, and systems it needs.",
    deliverable: "Production Deployment & Integrations",
    tone: "bg-bone text-obsidian",
    borderTone: "border-black/10",
  },
  {
    number: "04",
    title: "Support and improve",
    description:
      "Where ongoing support is agreed, we monitor performance and keep evolving the technology.",
    deliverable: "Continuous Optimization & SLA",
    tone: "bg-[#1f232b] text-ink",
    borderTone: "border-white/15",
  },
];

export function Process() {
  const root = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add(MOTION_OK, () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      const total = cards.length;

      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;

        const dimOverlay = card.querySelector<HTMLElement>("[data-dim]");
        const watermark = card.querySelector<HTMLElement>("[data-watermark]");

        // Progressive scale so earlier cards sit slightly deeper in the stack
        const targetScale = 1 - (total - i) * 0.022;

        gsap.set(card, { transformOrigin: "top center", force3D: true });

        // 1. Scale & slight vertical tuck as the next card slides over
        gsap.to(card, {
          scale: targetScale,
          y: -8,
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top 88%",
            end: "top 20%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // 2. GPU-friendly darkening via overlay opacity instead of CSS filter
        if (dimOverlay) {
          gsap.to(dimOverlay, {
            opacity: 0.48,
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top 88%",
              end: "top 20%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }

        // 3. Subtle parallax on the oversized background number
        if (watermark) {
          gsap.fromTo(
            watermark,
            { yPercent: 12 },
            {
              yPercent: -6,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="process"
      ref={root}
      aria-labelledby="process-heading"
      className="bg-obsidian pb-24 pt-[var(--pad-section)]"
    >
      <div className="container">
        {/* Section Header */}
        <div className="grid items-baseline gap-6 lg:grid-cols-12">
          <p className="label lg:col-span-3">How SHRY works</p>
          <h2 id="process-heading" className="h2 max-w-[14ch] lg:col-span-9">
            A clear path from problem to working system.
          </h2>
        </div>

        {/* Sticky Card Stack */}
        <ol className="relative mt-16 space-y-8 md:mt-20 md:space-y-12">
          {STEPS.map((step, i) => {
            const topOffset = `calc(5rem + ${(i * 1.35).toFixed(2)}rem)`;

            return (
              <li
                key={step.number}
                data-card
                style={{
                  position: "sticky",
                  top: topOffset,
                  zIndex: i + 1,
                }}
                className={`relative flex min-h-[56vh] flex-col justify-between overflow-hidden rounded-[1.75rem] border-t p-7 shadow-[0_-16px_44px_-12px_rgba(0,0,0,0.55)] will-change-transform md:min-h-[60vh] md:p-12 ${step.tone} ${step.borderTone}`}
              >
                {/* GPU-accelerated dim layer (replaces expensive CSS filter) */}
                <div
                  data-dim
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 bg-black opacity-0 transition-none"
                />

                {/* Top Meta Row: Step Label + Segmented Progress */}
                <div className="relative z-10 flex items-center justify-between gap-4 border-b border-current/10 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="inline-block h-2 w-2 rounded-full bg-current opacity-75" />
                    <p className="label !text-current opacity-75">
                      Step {step.number} <span className="opacity-50">/ 04</span>
                    </p>
                  </div>

                  {/* Step Progress Pills */}
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {STEPS.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-1 rounded-full transition-all ${idx <= i
                          ? "w-6 bg-current opacity-85"
                          : "w-2 bg-current opacity-20"
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Oversized Watermark Numeral */}
                <span
                  data-watermark
                  aria-hidden="true"
                  className="outline-text display pointer-events-none absolute -bottom-8 right-4 select-none text-[clamp(9.5rem,25vw,23rem)] leading-[0.75] opacity-20 will-change-transform md:right-10"
                >
                  {step.number}
                </span>

                {/* Main Card Content */}
                <div className="relative z-10 my-auto py-8 md:py-12">
                  <h3 className="display max-w-[16ch] text-[clamp(2.35rem,5.4vw,5.2rem)] leading-[0.98] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed opacity-80 md:text-[1.15rem]">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Deliverable Tag */}
                <div className="relative z-10 flex items-center justify-between pt-2 text-xs font-medium uppercase tracking-widest opacity-60">
                  <span>Outcome — {step.deliverable}</span>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-center">
          <p className="text-sm text-ink/60">
            Want to see how we scope timelines, milestones, and handoffs?
          </p>
          <Link
            href="/process"
            className="group inline-flex items-center gap-3 rounded-full border border-current px-7 py-3.5 text-sm font-medium transition-all duration-300 hover:border-accent hover:bg-accent hover:text-obsidian"
          >
            <span>The full process</span>
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}