"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { gsap, MOTION_OK } from "@/lib/gsap";

/**
 * Site-wide interaction layer:
 *  1. 3D headings: every section heading (h2.h2) flips up word by word as it enters.
 *  2. Glass cards: elements marked [data-tilt3d] (and common card patterns) tilt toward
 *     the cursor with a moving light glare.
 * Headings opt out with data-no-split. Skipped entirely for reduced motion / touch-only.
 */

function splitWords(root: HTMLElement) {
  if (root.dataset.split) return;
  root.dataset.split = "1";
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((ch) => {
      if (ch.nodeType === Node.TEXT_NODE) {
        const parts = (ch.textContent ?? "").split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          const outer = document.createElement("span");
          outer.className = "w3d";
          const inner = document.createElement("span");
          inner.textContent = p;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        ch.parentNode?.replaceChild(frag, ch);
      } else if (ch.nodeType === Node.ELEMENT_NODE && !(ch as HTMLElement).classList.contains("w3d")) {
        walk(ch);
      }
    });
  };
  walk(root);
}

const CARD_SELECTOR = "[data-tilt3d], #main li.rounded-2xl, #main li.rounded-3xl, #main div.rounded-3xl.border, #main article .rounded-2xl.border";

export function Interactions() {
  const pathname = usePathname();

  // 3D word reveals on section headings
  React.useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;
    let ctx: gsap.Context | null = null;
    const id = window.setTimeout(() => {
      const heads = Array.from(document.querySelectorAll<HTMLElement>("#main h2.h2:not([data-no-split]), #main h2.display:not([data-no-split])"));
      ctx = gsap.context(() => {
        heads.forEach((h) => {
          splitWords(h);
          const words = h.querySelectorAll(".w3d > span");
          gsap.fromTo(words,
            { yPercent: 105, rotateX: -88, opacity: 0 },
            { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.1, stagger: 0.045, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 88%", once: true } });
        });
      });
    }, 250);
    return () => { window.clearTimeout(id); ctx?.revert(); };
  }, [pathname]);

  // glass-card tilt with light glare (fine pointers only)
  React.useEffect(() => {
    if (!window.matchMedia(`${MOTION_OK} and (hover: hover) and (pointer: fine)`).matches) return;
    let current: HTMLElement | null = null;
    const reset = (el: HTMLElement) => { gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" }); el.style.setProperty("--gl", "0"); };
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(CARD_SELECTOR);
      if (current && current !== el) reset(current);
      current = el;
      if (!el) return;
      if (!el.dataset.tiltReady) {
        el.dataset.tiltReady = "1";
        el.classList.add("glass-tilt");
        gsap.set(el, { transformPerspective: 900 });
      }
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      const strength = Math.max(2, Math.min(8, 900 / Math.max(r.width, 1)));
      gsap.to(el, { rotateY: (px - 0.5) * strength * 2, rotateX: -(py - 0.5) * strength * 2, duration: 0.5, ease: "power3.out" });
      el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      el.style.setProperty("--gl", "1");
    };
    const onLeave = () => { if (current) reset(current); current = null; };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => { window.removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave); };
  }, []);

  return null;
}
