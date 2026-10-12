"use client";

import * as React from "react";
import Link from "next/link";
import { gsap, MOTION_OK } from "@/lib/gsap";

const EXAMPLES = [
  "Handling incoming business inquiries",
  "Preparing customer-response drafts",
  "Connecting form submissions to business applications",
  "Automating repetitive reporting and administrative tasks",
];

// One example workflow, shown as a log. Illustrative, not live data.
const LOG: [string, string, boolean][] = [
  ["inquiry.received", "New enquiry arrives through your website form", false],
  ["sort.category", "Tagged by topic and urgency", false],
  ["draft.reply", "Reply drafted from your own service notes", false],
  ["review.required", "A person approves or edits the draft", true],
  ["record.saved", "Stored in the software you already use", false],
];

export function Automation() {
  const root = React.useRef<HTMLElement>(null);
  const [shown, setShown] = React.useState(LOG.length);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 0, id = 0;
    const started = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      started.disconnect();
      setShown(0);
      id = window.setInterval(() => { n += 1; setShown(n); if (n >= LOG.length + 3) { n = 0; setShown(0); } }, 1000);
    }, { threshold: 0.4 });
    if (root.current) started.observe(root.current);
    return () => { started.disconnect(); window.clearInterval(id); };
  }, []);

  React.useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.from("[data-ex]", { x: -24, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: "[data-ex]", start: "top 85%", once: true } });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="automation" ref={root} className="relative overflow-hidden bg-surface section-pad">
      <div className="absolute inset-0 grid-bg opacity-30 [mask-image:linear-gradient(90deg,transparent,#000_80%)]" aria-hidden />
      <div className="container relative grid gap-14 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <p className="label">Practical AI &amp; automation</p>
          <h2 className="h2 mt-6 max-w-[11ch]">Less repetitive work. Better-connected systems.</h2>
          <p className="lead mt-6">We help businesses find the workflows worth automating, then connect AI and your existing software to handle them.</p>
          <ul className="mt-9 space-y-3">
            {EXAMPLES.map((e) => <li data-ex key={e} className="flex gap-3 text-[0.98rem]"><span className="mt-2.5 h-px w-5 shrink-0 bg-accent" aria-hidden />{e}</li>)}
          </ul>
          <p className="mt-9 max-w-md text-sm text-mute">What we build depends on your workflow, the systems involved and how much human oversight you want. We'd rather automate the right thing than everything.</p>
        </div>

        <figure className="lg:col-span-6" aria-label="Example workflow log: from an incoming enquiry to a saved record, with a human review step">
          <div className="overflow-hidden rounded-2xl border hairline bg-obsidian shadow-[0_30px_100px_-30px_rgba(191,234,90,0.2)]">
            <div className="flex items-center justify-between border-b hairline px-5 py-3">
              <div className="flex gap-1.5" aria-hidden><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /></div>
              <p className="label !text-[0.65rem]">example-workflow.log</p>
            </div>
            <ol className="min-h-[19rem] space-y-1 p-5 font-mono text-[0.8rem] leading-relaxed md:p-7 md:text-sm">
              {LOG.map(([k, v, human], i) => (
                <li key={k} className={`grid grid-cols-[1.4rem_1fr] gap-x-3 transition-all duration-500 ${i < shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
                  <span className={human ? "text-accent" : "text-mute"}>{human ? "◆" : "›"}</span>
                  <span><span className={human ? "text-accent" : "text-ink"}>{k}</span> <span className="text-mute">{v}</span>{human && <span className="ml-2 rounded-full border border-accent/50 px-2 py-0.5 text-[0.65rem] text-accent">human</span>}</span>
                </li>
              ))}
              <li className="pt-2 text-mute"><span className="text-accent">$</span> <span className="caret">▍</span></li>
            </ol>
          </div>
          <figcaption className="mt-3 text-xs text-mute">Illustrative example. Each solution is designed around the client's own process.</figcaption>
        </figure>
      </div>
      <div className="container  pb-20 pt-4"><Link href="/ai-automation" className="group inline-flex items-center gap-2 rounded-full border border-current px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-obsidian">AI &amp; automation, in detail <span aria-hidden>→</span></Link></div>
    </section>
  );
}
