"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, type Project } from "@/content/site";
import { Sketch } from "@/components/Sketch";
import { Magnetic } from "@/components/Magnetic";
import { Button } from "@/components/ui/button";
import { gsap, MOTION_OK } from "@/lib/gsap";

/**
 * Selected work as a vertical "screening": each product's real screenshot rises out of
 * a 3D tilt and straightens as it reaches the centre of the screen, lit by the
 * product's own brand colour. The phone screenshot drifts up faster (parallax).
 */
function Reel({ p, i }: { p: Project; i: number }) {
  const idx = String(i + 1).padStart(2, "0");
  const tint = p.tint ?? "#BFEA5A";

  return (
    <article data-reel className="relative border-t hairline" style={{ ["--tint" as string]: tint }}>
      {/* light spill in the product's colour */}
      <div data-glow aria-hidden className="pointer-events-none absolute inset-x-0 top-[18%] mx-auto h-[70%] max-w-6xl rounded-full opacity-0 blur-[120px] [background:radial-gradient(closest-side,var(--tint),transparent)]" />

      <div className="container relative pb-24 pt-20 md:pb-36 md:pt-28">
        <header className="grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="label flex items-center gap-3"><span className="text-accent">{idx}</span><span className="h-px w-8 bg-line" aria-hidden />{p.kind}</p>
            <h3 className="display mt-5 text-[clamp(3.4rem,11vw,10.5rem)]">
              <span data-title className="mask"><span>{p.name}</span></span>
            </h3>
          </div>
          <div className="lg:col-span-4 lg:pb-4">
            {(p.ownedBy || p.client) && (
              <p className="text-sm text-mute">
                {p.ownedBy
                  ? <>A product of <span className="text-ink">{p.ownedBy.name}</span> · built by <span className="text-accent">Shreyansh</span></>
                  : <>Built for <span className="text-ink">{p.client}</span></>}
              </p>
            )}
            <p className="mt-3 text-sm text-mute">{p.platform}</p>
          </div>
        </header>

        {/* the stage */}
        <div className="relative mt-12 [perspective:1800px] md:mt-16">
          <Link href={`/work/${p.id}`} data-cursor="Open" aria-label={`${p.name} case study`} className="block">
            <div data-screen className="relative origin-bottom overflow-hidden rounded-[1.4rem] border border-white/10 bg-surface shadow-[0_60px_160px_-40px_rgba(0,0,0,0.9)] will-change-transform [transform-style:preserve-3d]">
              <div className="flex items-center gap-1.5 border-b border-white/10 bg-obsidian/80 px-4 py-3" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-white/15" /><span className="h-2 w-2 rounded-full bg-white/15" /><span className="h-2 w-2 rounded-full bg-white/15" />
                {p.url && <span className="ml-4 truncate font-mono text-[0.65rem] text-mute">{p.url.replace(/^https?:\/\//, "")}</span>}
              </div>
              <div className="aspect-[8/5]">
                {p.image
                  ? <img src={p.image} alt={`${p.name} — screenshot`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
                  : <Sketch variant={p.variant} />}
              </div>
              {/* glass sheen that sweeps as the screen straightens */}
              <div data-sheen aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.10)_50%,transparent_65%)] [background-size:250%_100%]" />
            </div>
          </Link>
          {p.mobile && (
            <div data-phone className="absolute -bottom-16 right-[4%] hidden w-[17%] min-w-[170px] max-w-[250px] rounded-[2.3rem] border-[6px] border-[#1b1d24] bg-obsidian p-1 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.95)] ring-1 ring-white/10 md:block">
              <div className="overflow-hidden rounded-[1.8rem]"><img src={p.mobile} alt={`${p.name} — mobile screenshot`} loading="lazy" decoding="async" className="aspect-[390/800] w-full object-cover object-top" /></div>
            </div>
          )}
        </div>

        <div className="mt-20 grid gap-10 md:mt-28 lg:grid-cols-12">
          <p className="text-[clamp(1.2rem,2vw,1.7rem)] leading-snug tracking-tight lg:col-span-6">{p.product}</p>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="label">{p.contributionLabel ?? "What SHRY did"}</p>
            <p className="mt-3 text-mute">{p.contribution}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href={`/work/${p.id}`} className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-obsidian transition-colors hover:bg-accent">
                Case study <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              {p.url && (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-ink">
                  Visit live site <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Work({ intro = true, outro = true }: { intro?: boolean; outro?: boolean }) {
  const root = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const wide = window.matchMedia("(min-width: 768px)").matches;
      gsap.utils.toArray<HTMLElement>("[data-reel]").forEach((reel) => {
        const q = gsap.utils.selector(reel);
        const st = { trigger: q("[data-screen]")[0], start: "top 95%", end: "top 25%", scrub: 0.6 };
        gsap.fromTo(q("[data-screen]"),
          { rotateX: wide ? 34 : 18, scale: 0.84, y: 60, filter: "brightness(0.45)" },
          { rotateX: 0, scale: 1, y: 0, filter: "brightness(1)", ease: "none", scrollTrigger: st });
        gsap.fromTo(q("[data-sheen]"), { backgroundPosition: "120% 0" }, { backgroundPosition: "-20% 0", ease: "none", scrollTrigger: st });
        gsap.fromTo(q("[data-glow]"), { opacity: 0 }, { opacity: 0.38, ease: "none", scrollTrigger: st });
        if (q("[data-phone]")[0]) {
          gsap.fromTo(q("[data-phone]"), { y: 220, rotate: 4 }, { y: -30, rotate: 0, ease: "none", scrollTrigger: { trigger: reel, start: "top 80%", end: "bottom 60%", scrub: 0.8 } });
        }
        gsap.from(q("[data-title] > span"), { yPercent: 110, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: reel, start: "top 75%", once: true } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="work" ref={root} aria-labelledby="work-h" data-scene="tunnel" className="relative">
      {intro && <div className="container pb-8 pt-[var(--pad-section)]">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="label">Selected work · {String(PROJECTS.length).padStart(2, "0")} products live</p>
            <h2 id="work-h" className="h2 mt-6">Real software, <em className="serif text-accent">shipped.</em></h2>
          </div>
          <p className="lead lg:col-span-4">Products we designed, built and launched — running in production today, used by real customers.</p>
        </div>
      </div>}

      {PROJECTS.map((p, i) => <Reel key={p.id} p={p} i={i} />)}

      {outro && <div className="border-t hairline">
        <div className="container flex flex-wrap items-center justify-between gap-8 py-20 md:py-28">
          <p className="h2 max-w-[14ch]">Your product could be <em className="serif text-accent">next.</em></p>
          <Magnetic><Button size="lg" asChild data-cursor="Talk"><Link href="/work">All case studies <ArrowUpRight size={18} /></Link></Button></Magnetic>
        </div>
      </div>}
    </section>
  );
}
