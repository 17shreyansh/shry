"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import type { QA } from "@/content/faq";

export function FAQ({ items, title = "Questions, answered." }: { items: QA[]; title?: string }) {
  const [open, setOpen] = React.useState<number | null>(0);
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };

  return (
    <section className="section-pad border-t hairline" aria-label="Frequently asked questions">
      <div className="container grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label">FAQ</p>
          <h2 className="h2 mt-5 max-w-[10ch]">{title}</h2>
        </div>
        <div className="divide-y hairline border-y hairline lg:col-span-8">
          {items.map((it, i) => {
            const isOpen = open === i;
            const id = `faq-${i}`;
            return (
              <div key={it.q}>
                <h3>
                  <button
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left font-display text-xl font-bold tracking-tight transition-colors hover:text-accent md:text-2xl"
                  >
                    {it.q}
                    <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line transition-transform duration-500 ${isOpen ? "rotate-45 border-accent bg-accent text-obsidian" : ""}`}><Plus size={16} /></span>
                  </button>
                </h3>
                <div id={id} role="region" className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden"><p className="max-w-2xl pb-6 text-mute">{it.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  );
}
