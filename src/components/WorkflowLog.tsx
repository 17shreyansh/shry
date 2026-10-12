"use client";

import * as React from "react";

// One example workflow, shown as a log. Illustrative, not live data.
const LOG: [string, string, boolean][] = [
  ["inquiry.received", "New enquiry arrives through your website form", false],
  ["sort.category", "Tagged by topic and urgency", false],
  ["draft.reply", "Reply drafted from your own service notes", false],
  ["review.required", "A person approves or edits the draft", true],
  ["record.saved", "Stored in the software you already use", false],
];

export function WorkflowLog() {
  const root = React.useRef<HTMLElement>(null);
  const [shown, setShown] = React.useState(LOG.length);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 0, id = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setShown(0);
      id = window.setInterval(() => { n += 1; setShown(n); if (n >= LOG.length + 3) { n = 0; setShown(0); } }, 1000);
    }, { threshold: 0.4 });
    if (root.current) io.observe(root.current);
    return () => { io.disconnect(); window.clearInterval(id); };
  }, []);

  return (
    <figure ref={root} aria-label="Example workflow log: from an incoming enquiry to a saved record, with a human review step">
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
  );
}
