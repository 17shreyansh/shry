import Link from "next/link";
import { Logo } from "@/components/Nav";
import { SERVICES } from "@/content/services";
import { SECTORS, SITE } from "@/content/site";

const link = "text-sm text-mute transition-colors hover:text-ink";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-obsidian">
      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo className="text-4xl" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-mute">A technology partner building business websites, custom software, automations and reliable systems for growing companies.</p>
          <p className="mt-6 max-w-sm text-xs leading-relaxed text-mute/80">{SITE.reach} {SECTORS.join(", ")}.</p>
        </div>
        <nav aria-label="Services" className="lg:col-span-2">
          <p className="label mb-4">Services</p>
          <ul className="space-y-2.5">
            {SERVICES.map((s) => <li key={s.slug}><Link className={link} href={`/services/${s.slug}`}>{s.shortName || s.name}</Link></li>)}
            <li><Link className={link} href="/ai-automation">AI &amp; Automation</Link></li>
          </ul>
        </nav>
        <nav aria-label="Company" className="lg:col-span-2">
          <p className="label mb-4">Company</p>
          <ul className="space-y-2.5">
            {[["/work", "Work"], ["/process", "Process"], ["/about", "About"], ["/contact", "Contact"]].map(([h, l]) => <li key={h}><Link className={link} href={h}>{l}</Link></li>)}
          </ul>
        </nav>
        <div className="lg:col-span-4">
          <p className="label mb-4">Contact</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link className={link} href="/contact">Discuss a project</Link></li>
            {SITE.email && <li><a className={link} href={`mailto:${SITE.email}`}>{SITE.email}</a></li>}
            {SITE.phone && <li><a className={link} href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a></li>}
            {SITE.location && <li className="text-mute">{SITE.location}</li>}
            {SITE.socials.map((s) => <li key={s.href}><a className={link} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="container flex flex-col justify-between gap-3 border-t hairline py-6 text-xs text-mute sm:flex-row">
        <p>© {new Date().getFullYear()} SHRY. All rights reserved.</p>
        <p className="flex gap-6"><Link href="/privacy" className="transition-colors hover:text-ink">Privacy</Link><Link href="/terms" className="transition-colors hover:text-ink">Terms</Link></p>
      </div>
      <p aria-hidden className="display pointer-events-none -mb-[0.16em] select-none text-center text-[clamp(9rem,38vw,40rem)] leading-[0.74] tracking-[-0.07em] text-surface2">SHRY</p>
    </footer>
  );
}
