"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

type Shot = { src: string; caption: string };

/** Real project screenshots: bento grid + keyboard-navigable lightbox. */
export function Gallery({ name, shots }: { name: string; shots: Shot[] }) {
  const [open, setOpen] = React.useState<number | null>(null);
  const n = shots.length;
  const go = React.useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n]);

  React.useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const cur = open === null ? null : shots[open];

  return (
    <>
      <ul className="grid gap-5 md:grid-cols-2 lg:gap-6">
        {shots.map((s, i) => (
          <li key={s.src} className={i === 0 && n % 2 === 1 ? "md:col-span-2" : ""}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              data-cursor="View"
              className="group block w-full text-left"
              aria-label={`Open screenshot: ${s.caption}`}
            >
              <figure>
                <div className="relative overflow-hidden rounded-2xl border hairline bg-surface">
                  <div className="flex items-center gap-1.5 border-b hairline px-4 py-2.5" aria-hidden>
                    <span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" />
                  </div>
                  <div className="aspect-[8/5] overflow-hidden">
                    <img
                      src={s.src}
                      alt={`${name} — ${s.caption}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <span aria-hidden className="absolute right-4 top-14 grid h-10 w-10 place-items-center rounded-full bg-obsidian/70 text-ink opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                    <Expand size={16} />
                  </span>
                </div>
                <figcaption className="mt-3 flex gap-3 text-sm text-mute">
                  <span className="font-mono text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {s.caption}
                </figcaption>
              </figure>
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[200] bg-obsidian/90 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-[201] flex flex-col items-center justify-center gap-4 p-4 outline-none md:p-10">
            <Dialog.Title className="sr-only">{name} screenshots</Dialog.Title>
            <Dialog.Description className="sr-only">Use the arrow keys to move between screenshots.</Dialog.Description>
            {cur && (
              <figure className="flex w-full max-w-6xl flex-col gap-4">
                <img src={cur.src} alt={`${name} — ${cur.caption}`} className="max-h-[78vh] w-full rounded-xl border hairline object-contain" />
                <figcaption className="flex items-center justify-between gap-4 text-sm text-mute">
                  <span><span className="mr-3 font-mono text-accent">{String((open ?? 0) + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>{cur.caption}</span>
                  <span className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => go(-1)} aria-label="Previous screenshot" className="grid h-11 w-11 place-items-center rounded-full border hairline hover:border-accent hover:text-accent"><ArrowLeft size={18} /></button>
                    <button type="button" onClick={() => go(1)} aria-label="Next screenshot" className="grid h-11 w-11 place-items-center rounded-full border hairline hover:border-accent hover:text-accent"><ArrowRight size={18} /></button>
                  </span>
                </figcaption>
              </figure>
            )}
            <Dialog.Close aria-label="Close" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border hairline bg-obsidian text-ink hover:border-accent hover:text-accent md:right-8 md:top-8">
              <X size={18} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
