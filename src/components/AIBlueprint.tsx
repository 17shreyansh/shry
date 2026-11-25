"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, CornerDownLeft, RotateCcw, Sparkles } from "lucide-react";
import { localBlueprint, type Blueprint } from "@/lib/blueprint";
import { gsap, MOTION_OK } from "@/lib/gsap";

const EXAMPLES = [
  "A booking app for my salon chain with WhatsApp reminders",
  "Inventory and billing software for a building-materials dealer",
  "A SaaS that turns customer reviews into weekly insights",
  "Automate replies to website enquiries for my clinic",
];

const STEPS = ["Reading your idea", "Mapping the modules", "Planning the phases", "Choosing the stack", "Looking for AI opportunities"];

type State = { status: "idle" } | { status: "thinking"; step: number } | { status: "done"; blueprint: Blueprint } | { status: "error"; message: string };

/** "Describe your idea → get a project blueprint". Rule-based planner, runs in the browser. */
export function AIBlueprint() {
  const root = React.useRef<HTMLElement>(null);
  const result = React.useRef<HTMLDivElement>(null);
  const [idea, setIdea] = React.useState("");
  const [state, setState] = React.useState<State>({ status: "idle" });
  const [ph, setPh] = React.useState("");

  // typewriter placeholder cycling through examples
  React.useEffect(() => {
    if (idea || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPh(EXAMPLES[0]); return; }
    let i = 0, j = 0, del = false, id = 0;
    const tick = () => {
      const s = EXAMPLES[i];
      j += del ? -1 : 1;
      setPh(s.slice(0, j));
      let wait = del ? 18 : 38;
      if (!del && j >= s.length) { del = true; wait = 1800; }
      if (del && j <= 0) { del = false; i = (i + 1) % EXAMPLES.length; wait = 300; }
      id = window.setTimeout(tick, wait);
    };
    id = window.setTimeout(tick, 600);
    return () => window.clearTimeout(id);
  }, [idea]);

  React.useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.from("[data-bp-in]", { y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
    });
    return () => mm.revert();
  }, []);

  // animate the blueprint in when it arrives
  React.useLayoutEffect(() => {
    if (state.status !== "done" || !result.current) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(result.current!.querySelectorAll("[data-card]"), { y: 30, opacity: 0, filter: "blur(6px)", duration: 0.8, stagger: 0.07, ease: "power3.out" });
      gsap.from(result.current!.querySelectorAll("[data-phase]"), { scaleX: 0, transformOrigin: "left", duration: 0.9, stagger: 0.12, ease: "power4.out", delay: 0.3 });
    });
    return () => mm.revert();
  }, [state]);

  const run = async (text: string) => {
    const q = text.trim();
    if (q.length < 8) { setState({ status: "error", message: "Tell us a little more — a sentence about what you want to build." }); return; }
    const blueprint = localBlueprint(q.slice(0, 800));
    // short staged build-up so each planning step is readable
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) { setState({ status: "done", blueprint }); return; }
    for (let step = 0; step < STEPS.length; step++) {
      setState({ status: "thinking", step });
      await new Promise((r) => window.setTimeout(r, 420));
    }
    setState({ status: "done", blueprint });
  };

  const total = state.status === "done" ? state.blueprint.phases.reduce((s, p) => s + Math.max(1, p.weeks), 0) : 0;
  const brief = state.status === "done"
    ? `Project idea: ${idea}\n\nBlueprint: ${state.blueprint.title} — ${state.blueprint.summary}\nModules: ${state.blueprint.modules.map((m) => m.name).join(", ")}\nEstimated timeline: ~${total} weeks`
    : "";

  return (
    <section id="blueprint" ref={root} aria-labelledby="bp-h" className="relative overflow-hidden border-t hairline bg-obsidian">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

      <div className="container relative section-pad">
        <div className="mx-auto max-w-4xl text-center">
          <p data-bp-in className="label inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 !text-accent"><Sparkles size={13} /> Project planner</p>
          <h2 id="bp-h" data-bp-in className="h2 mt-8">Describe your idea. Get a <em className="serif text-accent">blueprint</em> in seconds.</h2>
          <p data-bp-in className="lead mx-auto mt-6 !max-w-xl">Modules, phases, timeline and tech stack — a first draft the way our team would scope it. Free, instant, no sign-up.</p>
        </div>

        {/* prompt box */}
        <form data-bp-in onSubmit={(e) => { e.preventDefault(); run(idea); }} className="group relative mx-auto mt-14 max-w-3xl">
          <div aria-hidden className="absolute -inset-px rounded-[1.6rem] bg-[conic-gradient(from_var(--a),transparent_0%,rgba(191,234,90,0.8)_10%,transparent_22%)] opacity-60 [animation:spinA_6s_linear_infinite] motion-reduce:hidden" />
          <div className="relative rounded-[1.55rem] border border-white/10 bg-[#0d0f13]/95 p-3 shadow-[0_40px_120px_-30px_rgba(191,234,90,0.25)] backdrop-blur-xl">
            <label htmlFor="bp-idea" className="sr-only">Describe your project idea</label>
            <textarea
              id="bp-idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value.slice(0, 800))}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); run(idea); } }}
              rows={3}
              placeholder={ph}
              className="w-full resize-none bg-transparent px-4 pt-3 text-lg leading-relaxed text-ink outline-none placeholder:text-mute/70 md:text-xl"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1">
              <span className="label hidden items-center gap-2 sm:flex"><CornerDownLeft size={12} /> Enter to plan · {idea.length}/800</span>
              <button type="submit" disabled={state.status === "thinking"} data-cursor="Plan" className="ml-auto inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-obsidian transition-colors hover:bg-ink disabled:opacity-60">
                <Sparkles size={16} /> {state.status === "thinking" ? "Planning…" : "Generate blueprint"}
              </button>
            </div>
          </div>
        </form>
        <ul data-bp-in className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
          {EXAMPLES.map((x) => (
            <li key={x}><button type="button" onClick={() => { setIdea(x); run(x); }} className="rounded-full border hairline px-4 py-1.5 text-xs text-mute transition-colors hover:border-accent hover:text-ink">{x}</button></li>
          ))}
        </ul>

        {/* states */}
        <div aria-live="polite" className="mx-auto mt-14 max-w-5xl">
          {state.status === "thinking" && (
            <ol className="mx-auto max-w-md space-y-3 font-mono text-sm">
              {STEPS.map((s, i) => (
                <li key={s} className={`flex items-center gap-3 transition-opacity duration-500 ${i <= state.step ? "opacity-100" : "opacity-25"}`}>
                  <span className={`grid h-5 w-5 place-items-center rounded-full border ${i < state.step ? "border-accent bg-accent text-obsidian" : i === state.step ? "border-accent" : "border-line"}`}>
                    {i < state.step ? "✓" : i === state.step ? <span className="h-1.5 w-1.5 animate-ping rounded-full bg-accent" /> : null}
                  </span>
                  {s}{i === state.step && <span className="caret">_</span>}
                </li>
              ))}
            </ol>
          )}
          {state.status === "error" && <p className="text-center text-mute">{state.message}</p>}

          {state.status === "done" && (
            <div ref={result} className="space-y-5">
              <div data-card className="flex flex-wrap items-end justify-between gap-6 rounded-3xl border hairline bg-surface p-7 md:p-10">
                <div className="max-w-2xl">
                  <p className="label !text-accent">Blueprint · first draft</p>
                  <h3 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[0.95] tracking-tight">{state.blueprint.title}</h3>
                  <p className="mt-4 text-lg text-ink/85">{state.blueprint.summary}</p>
                </div>
                <div className="text-right">
                  <p className="display text-[clamp(3rem,6vw,5rem)] text-accent">~{total}<span className="ml-2 font-sans text-base font-normal tracking-normal text-mute">weeks</span></p>
                  <p className="label">Estimated timeline</p>
                </div>
              </div>

              <div data-card className="rounded-3xl border hairline bg-surface p-7 md:p-10">
                <p className="label">Phases</p>
                <div className="mt-6 flex h-3 w-full gap-1 overflow-hidden rounded-full">
                  {state.blueprint.phases.map((p, i) => (
                    <span key={p.name} data-phase className="h-full rounded-full" style={{ flex: Math.max(1, p.weeks), background: `rgba(191,234,90,${1 - i * 0.2})` }} />
                  ))}
                </div>
                <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {state.blueprint.phases.map((p, i) => (
                    <li key={p.name}><p className="font-mono text-xs text-accent">0{i + 1} · {p.weeks} wk</p><p className="mt-2 font-display text-xl font-bold tracking-tight">{p.name}</p><p className="mt-1 text-sm text-mute">{p.deliverable}</p></li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                <div data-card className="rounded-3xl border hairline bg-surface p-7 lg:col-span-2">
                  <p className="label">Core modules</p>
                  <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                    {state.blueprint.modules.map((m, i) => (
                      <li key={m.name} className="rounded-2xl border hairline p-5"><p className="font-mono text-xs text-accent">M{String(i + 1).padStart(2, "0")}</p><p className="mt-2 font-display text-lg font-bold tracking-tight">{m.name}</p><p className="mt-1 text-sm text-mute">{m.description}</p></li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-5">
                  <div data-card className="rounded-3xl border hairline bg-surface p-7">
                    <p className="label">Suggested stack</p>
                    <ul className="mt-4 flex flex-wrap gap-2">{state.blueprint.stack.map((s) => <li key={s} className="rounded-full border hairline px-3 py-1 font-mono text-xs">{s}</li>)}</ul>
                  </div>
                  {state.blueprint.ai.length > 0 && (
                    <div data-card className="rounded-3xl border border-accent/30 bg-accent/5 p-7">
                      <p className="label flex items-center gap-2 !text-accent"><Sparkles size={13} /> Where AI helps</p>
                      <ul className="mt-4 space-y-2 text-sm">{state.blueprint.ai.map((a) => <li key={a} className="flex gap-2"><span className="text-accent">→</span>{a}</li>)}</ul>
                    </div>
                  )}
                </div>
              </div>

              <div data-card className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-bone p-7 text-obsidian md:p-10">
                <div className="max-w-xl">
                  <p className="label !text-obsidian/60">Before a firm quote, we&apos;d ask</p>
                  <ul className="mt-4 space-y-2">{state.blueprint.questions.map((q) => <li key={q} className="text-lg leading-snug tracking-tight">— {q}</li>)}</ul>
                </div>
                <div className="flex flex-col items-start gap-4">
                  <Link href={`/contact?topic=${encodeURIComponent("Websites & Software")}&brief=${encodeURIComponent(brief.slice(0, 1500))}`} className="group inline-flex items-center gap-2 rounded-full bg-obsidian px-7 py-4 font-medium text-ink transition-colors hover:bg-accent hover:text-obsidian">
                    Send this blueprint to SHRY <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                  <button type="button" onClick={() => setState({ status: "idle" })} className="inline-flex items-center gap-2 text-sm text-obsidian/60 hover:text-obsidian"><RotateCcw size={14} /> Plan another idea</button>
                </div>
              </div>
              <p className="text-center text-xs text-mute">An automated first draft to start the conversation — not a quote. Our team reviews every project personally.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
