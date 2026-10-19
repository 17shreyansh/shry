"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { TEAM_MEMBERS } from "@/content/team";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SH";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatNumber(n: number): string {
  return String(n).padStart(2, "0");
}

export interface TeamSectionProps {
  variant?: "home" | "full";
  eyebrow?: string;
  title?: string;
  lead?: string;
}

export function TeamSection({
  variant = "full",
  eyebrow = "02 / THE CORE TEAM",
  title = "The core team.",
  lead = "Senior engineers and interface designers working together across systems, automation, and product design.",
}: TeamSectionProps) {
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  const totalMembers = TEAM_MEMBERS.length;

  // Pointer drag state refs (avoids re-renders on every pixel move)
  const dragState = React.useRef({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
    hasMoved: false,
  });

  const getCardStep = React.useCallback((el: HTMLDivElement) => {
    const firstCard = el.querySelector<HTMLElement>("[data-team-card]");
    if (!firstCard) return 300;
    const style = window.getComputedStyle(el);
    const gap = parseFloat(style.columnGap || style.gap || "20") || 20;
    return firstCard.offsetWidth + gap;
  }, []);

  const updateScrollState = React.useCallback(() => {
    const el = sliderRef.current;
    if (!el || totalMembers === 0) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);

    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < maxScroll - 8);

    const ratio = maxScroll > 0 ? Math.min(Math.max(scrollLeft / maxScroll, 0), 1) : 1;
    setProgress(ratio);

    // Map scroll progress cleanly across total items so reaching the right edge shows the final count
    const step = getCardStep(el);
    const rawIdx =
      maxScroll > 0 && scrollLeft >= maxScroll - 8
        ? totalMembers - 1
        : Math.round(scrollLeft / step);

    setCurrentIndex(Math.min(Math.max(rawIdx, 0), totalMembers - 1));
  }, [getCardStep, totalMembers]);

  React.useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    updateScrollState();
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    window.addEventListener("resize", updateScrollState);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByDirection = (dir: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const step = getCardStep(el);
    el.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const scrollToCard = (index: number) => {
    const el = sliderRef.current;
    if (!el) return;
    const step = getCardStep(el);
    el.scrollTo({
      left: index * step,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left click
    const el = sliderRef.current;
    if (!el) return;

    dragState.current = {
      isDown: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      hasMoved: false,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragState.current.isDown) return;
    const el = sliderRef.current;
    if (!el) return;

    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 5 && !dragState.current.hasMoved) {
      dragState.current.hasMoved = true;
      setIsDragging(true);
    }

    if (dragState.current.hasMoved) {
      e.preventDefault();
      el.scrollLeft = dragState.current.startScrollLeft - dx * 1.2;
    }
  };

  const stopDragging = React.useCallback(() => {
    if (!dragState.current.isDown) return;
    const el = sliderRef.current;
    const wasMoved = dragState.current.hasMoved;

    dragState.current.isDown = false;
    dragState.current.hasMoved = false;
    setIsDragging(false);

    // Gently snap to the nearest card boundary when user releases mouse drag
    if (wasMoved && el) {
      const step = getCardStep(el);
      const targetIndex = Math.round(el.scrollLeft / step);
      el.scrollTo({ left: targetIndex * step, behavior: "smooth" });
    }
  }, [getCardStep]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByDirection("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByDirection("right");
    }
  };

  if (totalMembers === 0) return null;

  return (
    <section
      id="team"
      aria-labelledby="team-h"
      className="section-pad relative overflow-hidden border-t hairline bg-surface"
    >
      <div className="container relative z-10">
        {/* Section Header with Slider Controls */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="label flex items-center gap-3">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="team-h" className="h2 mt-6">
              {title}
            </h2>
            <p className="lead mt-4 text-sm md:text-base">{lead}</p>
          </div>

          {/* Controls */}
          <div className="flex shrink-0 items-center gap-4">
            {variant === "home" && (
              <Link
                href="/about#team"
                className="group mr-1 inline-flex items-center gap-2 rounded-full border hairline bg-obsidian px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-ink transition-all duration-200 hover:border-accent hover:text-accent"
              >
                <span>Full Story</span>
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            )}

            {/* Slider Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByDirection("left")}
                disabled={!canScrollLeft}
                aria-label="Previous team member"
                className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-obsidian text-mute transition-all duration-200 hover:border-ink hover:text-ink active:scale-95 disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollByDirection("right")}
                disabled={!canScrollRight}
                aria-label="Next team member"
                className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-obsidian text-mute transition-all duration-200 hover:border-ink hover:text-ink active:scale-95 disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Cards-at-a-Time Interactive Slider */}
        <div
          ref={sliderRef}
          onScroll={updateScrollState}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onKeyDown={handleKeyDown}
          onDragStart={(e) => e.preventDefault()}
          tabIndex={0}
          role="region"
          aria-label="Core Team Slider"
          className={`mt-12 flex gap-5 overflow-x-auto pb-6 pt-2 outline-none focus-visible:ring-1 focus-visible:ring-accent/50 [&::-webkit-scrollbar]:hidden ${isDragging
            ? "cursor-grabbing select-none snap-none scroll-auto"
            : "cursor-grab snap-x snap-mandatory scroll-smooth"
            }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {TEAM_MEMBERS.map((member, index) => (
            <article
              key={member.id}
              data-team-card
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${totalMembers}: ${member.name}, ${member.role}`}
              className="group relative flex w-[80vw] max-w-[290px] shrink-0 snap-start flex-col justify-between rounded-2xl border hairline bg-obsidian p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-surface2/60 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.5)] sm:w-[calc((100%-1.25rem)/2)] sm:max-w-none md:w-[calc((100%-2*1.25rem)/3)] lg:w-[calc((100%-3*1.25rem)/4)]"
            >
              <div>
                {/* Photo / Typographic Monogram Frame */}
                <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-xl border hairline bg-surface2 sm:h-60 sm:aspect-auto">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      unoptimized
                      draggable={false}
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 33vw, 25vw"
                      className="pointer-events-none select-none object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="relative flex h-full w-full select-none flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.05),transparent_70%)]">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border hairline bg-obsidian shadow-inner transition-all duration-300 group-hover:scale-105 group-hover:border-accent/50">
                        <span className="font-display text-2xl font-semibold tracking-tight text-ink/80 transition-colors group-hover:text-accent">
                          {getInitials(member.name)}
                        </span>
                      </div>
                      <span className="mt-3 font-mono text-[0.62rem] uppercase tracking-widest text-mute/60">
                        Core Architect
                      </span>
                    </div>
                  )}

                  {/* Subtle bottom vignette for depth */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidian/60 to-transparent opacity-60 transition-opacity group-hover:opacity-40"
                  />

                  {/* Index Badge */}
                  <span className="absolute left-2.5 top-2.5 rounded-md border hairline bg-obsidian/85 px-2 py-0.5 font-mono text-[0.62rem] text-mute backdrop-blur-md transition-colors group-hover:border-accent/40 group-hover:text-ink">
                    {formatNumber(index + 1)}
                  </span>
                </div>

                {/* Role + Name */}
                <div className="mt-4 px-0.5">
                  <p className="truncate font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-accent">
                    {member.role}
                  </p>
                  <h3 className="mt-1 truncate font-display text-lg font-bold tracking-tight text-ink transition-colors group-hover:text-accent sm:text-xl">
                    {member.name}
                  </h3>
                </div>
              </div>

              {/* Bottom Tags */}
              {member.tags && member.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 border-t hairline pt-3.5">
                  {member.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border hairline bg-surface px-2.5 py-0.5 font-mono text-[0.6rem] text-mute transition-colors group-hover:border-line group-hover:text-ink/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Progress Bar & Interactive Slide Dots */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-6 border-t hairline pt-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-accent">
              {formatNumber(currentIndex + 1)}
            </span>
            <div className="h-0.5 w-28 overflow-hidden rounded-full bg-line sm:w-44">
              <div
                className="h-full bg-accent transition-all duration-300 ease-out"
                style={{
                  width: `${Math.max(100 / Math.max(1, totalMembers), progress * 100)}%`,
                }}
              />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-mute">
              {formatNumber(totalMembers)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick-jump dots for desktop */}
            <div className="hidden items-center gap-1.5 md:flex" role="tablist" aria-label="Team slides">
              {TEAM_MEMBERS.map((member, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={member.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Scroll to ${member.name}`}
                    onClick={() => scrollToCard(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${isActive ? "w-5 bg-accent" : "w-1.5 bg-line hover:bg-mute"
                      }`}
                  />
                );
              })}
            </div>

            <span className="hidden font-mono text-[0.68rem] uppercase tracking-wider text-mute sm:block">
              Drag or use arrows
            </span>
          </div>
        </div>

        {/* Home Page Bottom Banner */}
        {variant === "home" && (
          <div className="mt-14 rounded-2xl border hairline bg-obsidian p-8 transition-colors hover:border-line md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  Build with dedicated senior engineering.
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-mute">
                  Every SHRY engagement is staffed directly by our core architects and interface specialists.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-obsidian transition-all duration-200 hover:bg-ink hover:text-obsidian"
                >
                  <span>Start a Project</span>
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}