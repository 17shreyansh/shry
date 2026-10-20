"use client";

import * as React from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/Magnetic";
import { NetworkCanvas } from "@/components/NetworkCanvas";
import { Marquee } from "@/components/Marquee";
import Link from "next/link";
import { boot } from "@/lib/boot";
import { gsap, MOTION_OK } from "@/lib/gsap";

export function Hero() {
    const root = React.useRef<HTMLElement>(null);
    const [stats, setStats] = React.useState<{ nodes: number; links: number } | null>(null);

    React.useLayoutEffect(() => {
        const mm = gsap.matchMedia(root);
        mm.add(MOTION_OK, () => {
            const tl = gsap.timeline({ delay: boot.done ? 0.55 : 1.45, defaults: { ease: "power4.out" } });
            tl.from("[data-line] > span", { yPercent: 115, rotate: 3, duration: 1.1, stagger: 0.12 })
                .from("[data-fade]", { y: 22, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.7")
                .from("[data-sys]", { clipPath: "inset(0 100% 0 0)", duration: 1.1, ease: "power3.inOut" }, 0.2);
        });
        return () => mm.revert();
    }, []);

    return (
        <section id="top" ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden">
            <NetworkCanvas onStats={setStats} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_20%_100%,#08090b_20%,transparent_70%)]" aria-hidden />

            <div className="container relative z-10 flex flex-1 flex-col justify-end pb-10 pt-32 md:pb-14">
                <p data-fade className="label mb-6 flex items-center gap-3">
                    <span className="h-px w-10 bg-accent" aria-hidden /> SHRY / Technology partner
                </p>
                <h1 className="display">
                    <span data-line className="mask text-[clamp(2.4rem,7.6vw,7.8rem)]"><span>Websites, software &</span></span>
                    <span data-line className="mask !mb-0 !pb-[0.2em] text-[clamp(2.8rem,11vw,11.5rem)] leading-[0.82]">
                        <span data-sys className="outline-accent transition-colors duration-500 hover:text-accent">AI automation</span>
                    </span>
                    <span data-line className="mask text-[clamp(1.7rem,4.6vw,4.6rem)] tracking-[-0.04em] text-ink/90"><span>for growing businesses.</span></span>
                </h1>

                <div className="mt-10 grid items-end gap-8 lg:grid-cols-12">
                    <p data-fade className="lead lg:col-span-5">
                        We build business websites, custom apps and software integrations. We also help maintain your technology, so your business can work better and grow with confidence.
                    </p>
                    <div data-fade className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-4">
                        <Magnetic>
                            <Button size="lg" asChild data-cursor="Talk"><Link href="/contact">
                                Discuss your project <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link></Button>
                        </Magnetic>
                        <Link href="/work" className="group inline-flex items-center gap-2 text-[0.95rem] text-mute transition-colors hover:text-ink">
                            See our work <ArrowDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                        </Link>
                    </div>
                    <p data-fade className="label hidden text-right lg:col-span-3 lg:block">
                        Fig. 01 — A connected system<br />
                        <span className="text-ink/60 tabular-nums">{stats ? `${stats.nodes} nodes · ${stats.links} links · live` : "rendering"}</span>
                    </p>
                </div>
            </div>
            <Marquee className="relative z-10" />
        </section>
    );
}
