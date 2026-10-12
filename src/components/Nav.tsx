"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV } from "@/content/site";
import { SERVICES } from "@/content/services";
import { gsap, MOTION_OK } from "@/lib/gsap";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="SHRY, home" className={`inline-flex items-baseline gap-0.5 font-display text-2xl font-extrabold tracking-[-0.06em] ${className}`}>
      SHRY<span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
    </Link>
  );
}

const SUB = [
  ...SERVICES.map((s) => ({ href: `/services/${s.slug}`, label: s.name, text: s.tagline })),
  { href: "/ai-automation", label: "AI & Automation", text: "Practical automation that keeps people in charge." },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [sub, setSub] = React.useState(false);
  const last = React.useRef(0);
  const panel = React.useRef<HTMLDivElement>(null);

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  React.useEffect(() => {
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > 260 && y > last.current + 6) setHidden(true);
      else if (y < last.current - 6 || y <= 260) setHidden(false);
      last.current = y;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  React.useEffect(() => { setSub(false); setOpen(false); setHidden(false); }, [pathname]);

  React.useEffect(() => {
    if (!open || !panel.current) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(panel.current!.querySelectorAll("[data-item]"), { yPercent: 60, opacity: 0, duration: 0.6, stagger: 0.05, ease: "power3.out", clearProps: "all" });
    });
    return () => mm.revert();
  }, [open]);

  const linkCls = (on: boolean) => `group relative inline-flex items-center gap-1 text-sm transition-colors hover:text-ink ${on ? "text-ink" : "text-mute"}`;
  const bar = (on: boolean) => <span className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-300 ease-out ${on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,transform] duration-500 ${scrolled ? "border-line bg-obsidian/80 backdrop-blur-md" : "border-transparent"} ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}>
      <div className="container flex h-16 items-center justify-between md:h-20">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {NAV.map((n) =>
            n.href === "/services" ? (
              <div
                key={n.href}
                className="relative"
                onMouseEnter={() => setSub(true)}
                onMouseLeave={() => setSub(false)}
                onFocus={() => setSub(true)}
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setSub(false); }}
              >
                <Link href="/services" className={linkCls(active("/services") || active("/ai-automation"))}>
                  Services <ChevronDown size={14} className={`transition-transform duration-300 ${sub ? "rotate-180" : ""}`} />
                  {bar(active("/services") || active("/ai-automation"))}
                </Link>
                <div className={`absolute left-1/2 top-full w-[27rem] -translate-x-1/2 pt-5 transition-all duration-300 ${sub ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"}`}>
                  <div className="overflow-hidden rounded-2xl border hairline bg-surface p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
                    {SUB.map((s) => (
                      <Link key={s.href} href={s.href} onClick={() => setSub(false)} className="group/i flex items-start justify-between gap-4 rounded-xl p-4 transition-colors hover:bg-surface2">
                        <span>
                          <span className="block font-display text-lg font-bold tracking-tight">{s.label}</span>
                          <span className="mt-0.5 block text-sm text-mute">{s.text}</span>
                        </span>
                        <ArrowUpRight size={18} className="mt-1 shrink-0 text-mute transition-all group-hover/i:-translate-y-0.5 group-hover/i:translate-x-0.5 group-hover/i:text-accent" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={n.href} href={n.href} className={linkCls(active(n.href))}>{n.label}{bar(active(n.href))}</Link>
            )
          )}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="hidden sm:inline-flex"><Link href="/contact">Discuss a project</Link></Button>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden" aria-label="Open menu"><Menu size={18} /></Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content ref={panel} data-lenis-prevent className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-obsidian px-5 pb-8 pt-4 lg:hidden">
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <Dialog.Description className="sr-only">Site navigation</Dialog.Description>
                <div className="flex h-12 shrink-0 items-center justify-between">
                  <Logo />
                  <Dialog.Close className="grid h-10 w-10 place-items-center rounded-full border border-line" aria-label="Close menu"><X size={18} /></Dialog.Close>
                </div>
                <nav aria-label="Mobile" className="mt-10 flex flex-1 flex-col gap-1">
                  {NAV.map((n) => (
                    <div key={n.href} className="overflow-hidden">
                      <Link data-item href={n.href} onClick={() => setOpen(false)} className={`block py-1.5 font-display text-[2.6rem] font-extrabold leading-tight tracking-[-0.05em] hover:text-accent ${active(n.href) ? "text-accent" : ""}`}>{n.label}</Link>
                      {n.href === "/services" && (
                        <div data-item className="mb-3 flex flex-wrap gap-2">
                          {SUB.map((s) => <Link key={s.href} href={s.href} onClick={() => setOpen(false)} className="rounded-full border border-line px-4 py-1.5 text-sm text-mute hover:border-accent hover:text-ink">{s.label}</Link>)}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="overflow-hidden"><Link data-item href="/contact" onClick={() => setOpen(false)} className="block py-1.5 font-display text-[2.6rem] font-extrabold leading-tight tracking-[-0.05em] hover:text-accent">Contact</Link></div>
                </nav>
                <Button asChild data-item size="lg" className="mt-8 shrink-0"><Link href="/contact" onClick={() => setOpen(false)}>Discuss a project</Link></Button>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
