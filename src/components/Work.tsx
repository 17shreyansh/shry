"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, type Project } from "@/content/site";
import Link from "next/link";
import { Magnetic } from "@/components/Magnetic";
import { Button } from "@/components/ui/button";
import { gsap, MOTION_OK } from "@/lib/gsap";

/** Clearly illustrative interface sketches — NOT screenshots. Replaced by `image` when supplied. */
function Sketch({ variant }: { variant: Project["variant"] }) {
  const ln = "rgba(245,245,240,0.16)";
  return (
    <svg viewBox="0 0 640 400" className="h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      <rect width="640" height="400" fill="#0d0f13" />
      {variant === "dashboard" ? (
        <g>
          <rect x="0" y="0" width="120" height="400" fill="#111318" />
          {[40, 78, 116, 154].map((y, i) => <rect key={y} x="20" y={y} width={i === 0 ? 70 : 56} height="10" rx="5" fill={i === 0 ? "#BFEA5A" : ln} />)}
          <rect x="150" y="30" width="170" height="64" rx="8" fill="#181a20" stroke={ln} />
          <rect x="336" y="30" width="170" height="64" rx="8" fill="#181a20" stroke={ln} />
          <rect x="522" y="30" width="96" height="64" rx="8" fill="#181a20" stroke={ln} />
          <rect x="166" y="46" width="60" height="8" rx="4" fill={ln} /><rect x="166" y="64" width="90" height="16" rx="4" fill="rgba(245,245,240,0.5)" />
          <rect x="352" y="46" width="60" height="8" rx="4" fill={ln} /><rect x="352" y="64" width="70" height="16" rx="4" fill="rgba(245,245,240,0.5)" />
          <g transform="translate(150 120)">
            {Array.from({ length: 5 }).map((_, r) => (
              <g key={r} transform={`translate(0 ${r * 50})`}>
                <rect width="468" height="38" rx="6" fill="#111318" stroke={ln} />
                <circle cx="22" cy="19" r="8" fill={ln} />
                <rect x="44" y="12" width={110 + (r % 3) * 20} height="7" rx="3.5" fill="rgba(245,245,240,0.4)" />
                <rect x="44" y="24" width="64" height="5" rx="2.5" fill={ln} />
                <rect x="392" y="11" width="56" height="16" rx="8" fill={r % 2 ? "rgba(191,234,90,0.18)" : ln} />
              </g>
            ))}
          </g>
        </g>
      ) : (
        <g>
          <rect x="0" y="0" width="640" height="44" fill="#111318" />
          <rect x="24" y="16" width="56" height="12" rx="6" fill="rgba(245,245,240,0.5)" />
          {[360, 424, 488].map((x) => <rect key={x} x={x} y="18" width="44" height="8" rx="4" fill={ln} />)}
          <rect x="570" y="12" width="52" height="20" rx="10" fill="#BFEA5A" />
          <rect x="56" y="92" width="300" height="24" rx="6" fill="rgba(245,245,240,0.55)" />
          <rect x="56" y="128" width="220" height="24" rx="6" fill="rgba(245,245,240,0.55)" />
          <rect x="56" y="176" width="260" height="8" rx="4" fill={ln} /><rect x="56" y="194" width="230" height="8" rx="4" fill={ln} />
          <rect x="56" y="226" width="110" height="34" rx="17" fill="#BFEA5A" />
          <rect x="390" y="84" width="200" height="230" rx="10" fill="#181a20" stroke={ln} />
          <rect x="410" y="104" width="160" height="96" rx="6" fill="#0d0f13" stroke={ln} />
          <rect x="410" y="214" width="110" height="8" rx="4" fill="rgba(245,245,240,0.4)" /><rect x="410" y="232" width="150" height="6" rx="3" fill={ln} />
          {[0, 1, 2].map((i) => <rect key={i} x={56 + i * 120} y="310" width="104" height="60" rx="8" fill="#111318" stroke={ln} />)}
        </g>
      )}
    </svg>
  );
}

function Panel({ p, i }: { p: Project; i: number }) {
  const idx = String(i + 1).padStart(2, "0");
  return (
    <article data-panel className="relative shrink-0 py-14 lg:w-[min(80vw,68rem)] lg:py-0">
      <span aria-hidden className="outline-text display pointer-events-none absolute -top-2 right-0 select-none text-[clamp(8rem,20vw,19rem)] leading-[0.8] text-white/[0.09] lg:-top-24 lg:right-6">{idx}</span>
      <div className="relative grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <div className="[perspective:1200px]">
          <div data-tilt data-cursor="Explore" className="overflow-hidden rounded-2xl border hairline bg-surface shadow-[0_40px_120px_-30px_rgba(191,234,90,0.18)] [transform-style:preserve-3d]">
            <div className="flex items-center gap-1.5 border-b hairline px-4 py-3" aria-hidden>
              <span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" />
            </div>
            <div className="aspect-[8/5]">
              {p.image ? <img src={p.image} alt={`${p.name} interface`} loading="lazy" className="h-full w-full object-cover object-top" /> : <Sketch variant={p.variant} />}
            </div>
          </div>
          {!p.image && <p className="label mt-3 text-[0.65rem]">Illustrative interface — project screenshots coming soon</p>}
        </div>

        <div>
          <p className="label flex items-center gap-3"><span className="text-accent">{idx}</span> {p.kind}</p>
          <h3 className="display mt-4 text-[clamp(3rem,6.4vw,6.6rem)]">{p.name}</h3>
          <dl className="mt-8 divide-y hairline border-y hairline">
            {[["The product", p.product], ["The problem", p.problem], ["What SHRY did", p.contribution]].map(([k, v]) => (
              <div key={k} className="grid gap-1 py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
                <dt className="label pt-0.5">{k}</dt>
                <dd className="text-[0.95rem] leading-relaxed text-ink/90">{v}</dd>
              </div>
            ))}
          </dl>
          <Link href={`/work/${p.id}`} className="group mt-8 mr-6 inline-flex items-center gap-2 text-sm text-accent underline-offset-8 hover:underline">Read case study <ArrowUpRight size={16} /></Link>
          {p.url && (
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="group mt-8 inline-flex items-center gap-2 text-sm underline-offset-8 hover:underline">
              Visit {p.name} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function Work() {
  const root = React.useRef<HTMLElement>(null);
  const pin = React.useRef<HTMLDivElement>(null);
  const track = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
      const t = track.current!;
      const dist = () => Math.max(0, t.scrollWidth - window.innerWidth);
      gsap.to(t, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: pin.current, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      const off: (() => void)[] = [];
      t.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.5 });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.5 });
        const mv = (e: PointerEvent) => { const r = el.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 12); rx(-((e.clientY - r.top) / r.height - 0.5) * 12); };
        const lv = () => { rx(0); ry(0); };
        el.addEventListener("pointermove", mv); el.addEventListener("pointerleave", lv);
        off.push(() => { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerleave", lv); });
      });
      return () => off.forEach((f) => f());
    });
    mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => {
      gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((p) => {
        gsap.from(p, { y: 50, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: p, start: "top 85%", once: true } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="work" ref={root} aria-labelledby="work-h" className="bg-obsidian">
      <div ref={pin} className="lg:h-screen lg:overflow-hidden lg:motion-reduce:h-auto lg:motion-reduce:overflow-x-auto">
        <div ref={track} className="flex flex-col px-5 py-24 md:px-8 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-28 lg:py-0 lg:pl-[max(3rem,calc((100vw-1360px)/2+3rem))] lg:pr-40">
          <div className="shrink-0 lg:w-[min(30vw,30rem)]">
            <p className="label">Selected work</p>
            <h2 id="work-h" className="h2 mt-6">Real software, built and shipped.</h2>
            <p className="label mt-8 hidden items-center gap-3 lg:flex"><span className="h-px w-10 bg-accent" aria-hidden /> Keep scrolling</p>
          </div>
          {PROJECTS.map((p, i) => <Panel key={p.id} p={p} i={i} />)}
          <div className="shrink-0 py-14 lg:w-[min(36vw,34rem)] lg:py-0">
            <p className="label">Next</p>
            <p className="h2 mt-6">Your project could be here.</p>
            <div className="mt-8">
              <Magnetic><Button size="lg" asChild data-cursor="Talk"><Link href="/work">All work <ArrowUpRight size={18} /></Link></Button></Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
