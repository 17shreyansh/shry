"use client";

import * as React from "react";
import { boot } from "@/lib/boot";

/**
 * First-load intro: two letterbox bars part like a camera shutter (~1.4s, pure CSS).
 * The page is rendered underneath from the first frame, so it never delays content.
 */
export function Preloader() {
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const id = window.setTimeout(() => { boot.done = true; setDone(true); }, 1500);
    return () => window.clearTimeout(id);
  }, []);

  if (done) return null;
  return (
    <div aria-hidden>
      <div className="intro-bar top" />
      <div className="intro-bar bottom" />
      <div className="intro-mark"><span className="font-display text-2xl font-extrabold tracking-tight text-ink">SHRY<span className="text-accent">.</span></span></div>
    </div>
  );
}
