"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FOUNDER } from "@/content/team";

function SocialIcon({ platform }: { platform: string }) {
  if (platform === "github") {
    return (
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  if (platform === "linkedin") {
    return (
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    );
  }
  if (platform === "x") {
    return (
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

export function FoundersSection() {
  return (
    <section id="founder" aria-labelledby="founder-h" className="section-pad relative overflow-hidden bg-obsidian border-t hairline">
      <div className="container relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="label flex items-center gap-3">
            <span className="h-px w-8 bg-accent" aria-hidden />
            01 / LEADERSHIP
          </p>
          <h2 id="founder-h" className="h2 mt-6">
            Directed by hands-on engineering.
          </h2>
        </div>

        {/* Editorial Two-Column Grid */}
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          
          {/* Portrait Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border hairline bg-surface2">
              <Image
                src={FOUNDER.image}
                alt={FOUNDER.name}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
                className="object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
            </div>

            {/* Clean Caption & Direct Socials */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b hairline pb-3">
              <div>
                <p className="font-display font-semibold text-ink text-base">
                  {FOUNDER.name}
                </p>
                <p className="font-mono text-xs text-mute mt-0.5">
                  {FOUNDER.role}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {FOUNDER.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={`${FOUNDER.name} on ${s.label}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border hairline bg-surface text-mute transition-colors hover:border-ink hover:text-ink"
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Narrative & Focus Column (7 cols) */}
          <div className="flex flex-col justify-between lg:col-span-7 lg:pt-2">
            <div>
              {/* High-conviction Quote */}
              <blockquote className="font-display text-2xl font-bold leading-snug tracking-tight text-ink md:text-3xl">
                &ldquo;{FOUNDER.quote}&rdquo;
              </blockquote>

              <div className="mt-8 space-y-5 text-base leading-relaxed text-mute md:text-lg">
                <p>
                  At SHRY, engineering strategy isn&apos;t delegated down a chain of account managers. Every architecture, cloud migration, and AI workflow is directed by technical practitioners who design the databases, write production code, and operate live systems.
                </p>
                <p className="text-sm text-mute/80">
                  {FOUNDER.tagline}
                </p>
              </div>

              {/* Core Focus Areas */}
              <div className="mt-10 border-t hairline">
                <p className="label pt-6">Core Focus Areas</p>
                <dl className="mt-4 grid divide-y hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0 border-y hairline">
                  {FOUNDER.focus.map((item, idx) => (
                    <div key={item} className="py-4 sm:px-5 first:sm:pl-0 last:sm:pr-0">
                      <dt className="font-mono text-xs text-accent">0{idx + 1}</dt>
                      <dd className="mt-1.5 font-display text-sm font-semibold text-ink">{item}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="mt-10 pt-4">
              <Link
                href="/contact?topic=Architecture%20Review"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-obsidian transition-colors hover:bg-ink hover:text-obsidian"
              >
                <span>Discuss an Architecture</span>
                <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
