"use client";

import * as React from "react";

/**
 * Generative page visuals, drawn live on a 2D canvas. Each one is a small
 * metaphor for the page it sits on:
 *  build .... a skyline of blocks assembling
 *  connect .. nodes joined to a hub by circuit lines, with data pulses
 *  operate .. a monitor: radar sweep, heartbeat trace, status ticks
 *  automation chaos resolving into ordered lanes through a gate
 *  about .... topographic contour lines that bend around the cursor
 *  process .. a rail with four stages and a travelling marker
 *  contact .. many lines converging on one point
 *  work ..... stacked interface frames
 * Pure decoration: aria-hidden, pointer-events none, paused off-screen, one still frame under reduced motion.
 */

export type VisualKind = "build" | "connect" | "operate" | "automation" | "about" | "process" | "contact" | "work";

type Pt = [number, number];
interface Frame { c: CanvasRenderingContext2D; w: number; h: number; t: number; mx: number; my: number }

// Palette is swapped per draw so the same art works on dark and light grounds.
const PAL = { ink: "245,245,240", lime: "191,234,90", limeHex: "#BFEA5A", f1: "#12141a", f2: "#0c0e12", bg: "#08090B" };
const ink = (a: number) => `rgba(${PAL.ink},${a})`;
const lime = (a: number) => `rgba(${PAL.lime},${a})`;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const rand = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const TAU = Math.PI * 2;

function poly(c: CanvasRenderingContext2D, pts: Pt[], fill: string, stroke = true) {
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  c.fillStyle = fill; c.fill();
  if (stroke) { c.strokeStyle = ink(0.14); c.lineWidth = 1; c.stroke(); }
}
function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath(); c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function along(pts: Pt[], p: number): Pt {
  const seg: number[] = []; let total = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; }
  let d = clamp(p) * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) { const k = seg[i] ? d / seg[i] : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; }
    d -= seg[i];
  }
  return pts[pts.length - 1];
}
function bez(p0: Pt, p1: Pt, p2: Pt, p3: Pt, u: number): Pt {
  const k = 1 - u, a = k * k * k, b = 3 * k * k * u, cc = 3 * k * u * u, d = u * u * u;
  return [a * p0[0] + b * p1[0] + cc * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + cc * p2[1] + d * p3[1]];
}

/* ---------------------------------------------------------------- build */
function build({ c, w, h, t, mx, my }: Frame) {
  const N = 9;
  const s = Math.min(w / (N * 1.75), h / (N * 1.35));
  const cx = w * 0.5, cy = h * 0.5 - s * 0.9;
  const P = (x: number, y: number, z: number): Pt => [cx + (x - y) * s, cy + (x + y - N) * s * 0.5 - z * s * 0.9];
  c.lineJoin = "round";
  for (let sum = 0; sum <= 2 * (N - 1); sum++) {
    for (let x = 0; x < N; x++) {
      const y = sum - x;
      if (y < 0 || y >= N) continue;
      const gx = x - (N - 1) / 2, gy = y - (N - 1) / 2;
      const d = Math.hypot(gx - mx * 3.2, gy - my * 3.2);
      const hg = 0.25 + 1.15 * (0.5 + 0.5 * Math.sin(gx * 0.85 + t * 0.9) * Math.cos(gy * 0.75 - t * 0.7)) + Math.max(0, 1.3 - d * 0.5);
      const a = P(x, y, hg), b = P(x + 1, y, hg), cc = P(x + 1, y + 1, hg), d2 = P(x, y + 1, hg);
      const l0 = P(x, y + 1, 0), l1 = P(x + 1, y + 1, 0), r0 = P(x + 1, y, 0);
      poly(c, [d2, cc, l1, l0], PAL.f1);
      poly(c, [b, cc, l1, r0], PAL.f2);
      poly(c, [a, b, cc, d2], ink(0.07 + hg * 0.05));
      const glow = clamp((hg - 1.15) / 0.7);
      if (glow > 0) poly(c, [a, b, cc, d2], lime(glow * 0.9), false);
    }
  }
}

/* -------------------------------------------------------------- connect */
function connect({ c, w, h, t, mx, my }: Frame) {
  const hub: Pt = [w * 0.5 + mx * 10, h * 0.5 + my * 10];
  const K = 10;
  const nodes = Array.from({ length: K }, (_, i) => {
    const ang = (i / K) * TAU + 0.3;
    const rx = w * (0.3 + 0.1 * rand(i)), ry = h * (0.28 + 0.1 * rand(i + 9));
    const p: Pt = [hub[0] + Math.cos(ang) * rx * 1.15, hub[1] + Math.sin(ang) * ry * 1.15];
    const elbow: Pt = i % 2 ? [hub[0], p[1]] : [p[0], hub[1]];
    return { p, path: [hub, elbow, p] as Pt[], ph: rand(i + 3), sp: 0.12 + 0.1 * rand(i + 5) };
  });
  c.lineWidth = 1;
  nodes.forEach((n) => {
    c.beginPath();
    n.path.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.strokeStyle = ink(0.16); c.stroke();
  });
  nodes.forEach((n) => {
    const u = (t * n.sp + n.ph) % 1;
    for (let k = 0; k < 8; k++) {
      const [x, y] = along(n.path, clamp(u - k * 0.016));
      c.beginPath(); c.arc(x, y, 3.2 - k * 0.3, 0, TAU); c.fillStyle = lime((1 - k / 8) * 0.9); c.fill();
    }
    const flash = clamp(1 - u * 5);
    rr(c, n.p[0] - 9, n.p[1] - 9, 18, 18, 3);
    c.fillStyle = flash > 0.02 ? lime(flash) : PAL.bg; c.fill();
    c.strokeStyle = ink(0.5); c.lineWidth = 1; c.stroke();
  });
  const ringR = 20 + ((t * 24) % 48);
  c.beginPath(); c.arc(hub[0], hub[1], ringR, 0, TAU); c.strokeStyle = lime(clamp(1 - (ringR - 20) / 48) * 0.5); c.stroke();
  rr(c, hub[0] - 14, hub[1] - 14, 28, 28, 5); c.fillStyle = PAL.limeHex; c.fill();
}

/* -------------------------------------------------------------- operate */
function beat(p: number) {
  if (p > 0.18 && p < 0.26) return 0.18 * Math.sin(((p - 0.18) / 0.08) * Math.PI);
  if (p > 0.4 && p < 0.43) return (-0.2 * (p - 0.4)) / 0.03;
  if (p >= 0.43 && p < 0.47) return -0.2 + 1.2 * ((p - 0.43) / 0.04);
  if (p >= 0.47 && p < 0.51) return 1 - 1.35 * ((p - 0.47) / 0.04);
  if (p >= 0.51 && p < 0.54) return -0.35 + 0.35 * ((p - 0.51) / 0.03);
  if (p > 0.62 && p < 0.78) return 0.28 * Math.sin(((p - 0.62) / 0.16) * Math.PI);
  return 0;
}
function operate({ c, w, h, t }: Frame) {
  c.lineWidth = 1; c.strokeStyle = ink(0.05);
  for (let x = 0; x < w; x += 40) { c.beginPath(); c.moveTo(x + 0.5, 0); c.lineTo(x + 0.5, h); c.stroke(); }
  for (let y = 0; y < h; y += 40) { c.beginPath(); c.moveTo(0, y + 0.5); c.lineTo(w, y + 0.5); c.stroke(); }
  const rcx = w * 0.7, rcy = h * 0.4, R = Math.min(w * 0.26, h * 0.34);
  [0.33, 0.66, 1].forEach((k) => { c.beginPath(); c.arc(rcx, rcy, R * k, 0, TAU); c.strokeStyle = ink(0.14); c.stroke(); });
  c.beginPath(); c.moveTo(rcx - R, rcy); c.lineTo(rcx + R, rcy); c.moveTo(rcx, rcy - R); c.lineTo(rcx, rcy + R); c.strokeStyle = ink(0.08); c.stroke();
  const ang = t * 0.9;
  for (let i = 0; i < 40; i++) {
    const a = ang - i * 0.03;
    c.beginPath(); c.moveTo(rcx, rcy); c.lineTo(rcx + Math.cos(a) * R, rcy + Math.sin(a) * R);
    c.strokeStyle = lime(0.24 * (1 - i / 40)); c.lineWidth = 2; c.stroke();
  }
  for (let k = 0; k < 8; k++) {
    const ba = rand(k) * TAU, br = R * (0.25 + 0.7 * rand(k + 4));
    const diff = ((((ang - ba) % TAU) + TAU) % TAU);
    const a = clamp(1 - diff / 2.6);
    c.beginPath(); c.arc(rcx + Math.cos(ba) * br, rcy + Math.sin(ba) * br, 3.5, 0, TAU); c.fillStyle = lime(0.15 + a * 0.85); c.fill();
  }
  const base = h * 0.8, amp = h * 0.15;
  const grad = c.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, lime(0)); grad.addColorStop(0.6, lime(0.8)); grad.addColorStop(1, lime(1));
  c.beginPath();
  for (let x = 0; x <= w; x += 2) {
    const ph = (x / w) * 2.2 - t * 0.22;
    const y = base - beat(ph - Math.floor(ph)) * amp;
    if (x) c.lineTo(x, y); else c.moveTo(x, y);
  }
  c.strokeStyle = grad; c.lineWidth = 2; c.lineJoin = "round"; c.stroke();
  const bars = 44, bw = (w - 48) / bars;
  for (let i = 0; i < bars; i++) {
    const sweep = (((t * 9 - i) % bars) + bars) % bars;
    c.fillStyle = lime(0.2 + 0.7 * clamp(1 - sweep / 7));
    c.fillRect(24 + i * bw, h * 0.93, bw - 3, 10);
  }
}

/* ----------------------------------------------------------- automation */
function automation({ c, w, h, t }: Frame) {
  const gx = w * 0.52, lanes = 7, top = h * 0.16, bot = h * 0.84;
  const laneY = (i: number) => top + (bot - top) * (i / (lanes - 1));
  c.lineWidth = 1;
  for (let i = 0; i < lanes; i++) { c.beginPath(); c.moveTo(gx, laneY(i)); c.lineTo(w, laneY(i)); c.strokeStyle = ink(0.08); c.stroke(); }
  c.fillStyle = ink(0.4);
  c.fillRect(gx - 9, top - 24, 3, bot - top + 48); c.fillRect(gx + 6, top - 24, 3, bot - top + 48);
  for (let i = 0; i < lanes; i++) { c.fillStyle = lime(0.9); c.fillRect(gx - 9, laneY(i) - 1, 18, 2); }
  const N = 96;
  for (let i = 0; i < N; i++) {
    const sp = 0.06 + 0.05 * rand(i);
    const u = (t * sp + rand(i + 50)) % 1;
    const x = u * w, lane = i % lanes, pre = x < gx;
    const chaos = pre ? Math.pow(clamp((gx - x) / gx), 0.8) : 0;
    const y = laneY(lane) + chaos * (rand(i + 7) - 0.5) * h * 0.9 + chaos * Math.sin(t * 1.3 + i * 3.1) * h * 0.06;
    c.save();
    c.translate(x, clamp(y, 6, h - 6));
    if (pre) {
      c.rotate(chaos * (rand(i + 4) * TAU + t * (rand(i) - 0.5) * 2));
      const sz = 4 + chaos * 8 * rand(i + 2);
      c.fillStyle = ink(0.22 + 0.4 * rand(i + 3));
      c.fillRect(-sz / 2, -sz / 2, sz, sz);
    } else {
      c.fillStyle = rand(i + 11) > 0.8 ? PAL.limeHex : ink(0.85);
      c.fillRect(-8, -2.5, 16, 5);
    }
    c.restore();
  }
}

/* ---------------------------------------------------------------- about */
function about({ c, w, h, t, mx, my }: Frame) {
  const L = 34;
  for (let j = 0; j < L; j++) {
    const y0 = h * (0.08 + (0.84 * j) / (L - 1));
    c.beginPath();
    for (let x = 0; x <= w; x += 6) {
      const nx = x / w, env = Math.exp(-Math.pow(nx - 0.62, 2) * 5);
      let y = y0 + env * (Math.sin(nx * 7 + t * 0.5 + j * 0.22) * h * 0.045 + Math.sin(nx * 13 - t * 0.35 + j * 0.4) * h * 0.02);
      const dx = x - w * (0.5 + mx * 0.5), dy = y - h * (0.5 + my * 0.5), dd = Math.hypot(dx, dy);
      y += (dy / (dd + 1)) * Math.exp(-dd / (w * 0.12)) * 14;
      if (x) c.lineTo(x, y); else c.moveTo(x, y);
    }
    const hot = j === Math.round(L * 0.42);
    c.strokeStyle = hot ? lime(0.95) : ink(0.07 + 0.2 * Math.exp(-Math.pow(y0 / h - 0.5, 2) * 8));
    c.lineWidth = hot ? 1.6 : 1; c.stroke();
  }
}

/* -------------------------------------------------------------- process */
function process({ c, w, h, t }: Frame) {
  const x0 = w * 0.1, x1 = w * 0.9, y = h * 0.62;
  const names = ["UNDERSTAND", "PLAN", "BUILD", "SUPPORT"];
  for (let i = 0; i <= 90; i++) {
    const x = x0 + ((x1 - x0) * i) / 90;
    c.beginPath(); c.moveTo(x, y + 14); c.lineTo(x, y + 14 + (i % 10 === 0 ? 16 : i % 5 === 0 ? 10 : 5));
    c.strokeStyle = ink(0.22); c.lineWidth = 1; c.stroke();
  }
  c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.strokeStyle = ink(0.3); c.stroke();
  const p = (t * 0.11) % 1.2, pp = Math.min(p, 1);
  c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + (x1 - x0) * pp, y); c.strokeStyle = PAL.limeHex; c.lineWidth = 2; c.stroke();
  c.font = "500 11px 'Geist Mono Variable', ui-monospace, monospace"; c.textAlign = "center";
  for (let k = 0; k < 4; k++) {
    const nx = x0 + ((x1 - x0) * k) / 3, done = pp >= k / 3 - 0.001;
    const bh = h * (0.1 + 0.085 * k);
    c.fillStyle = done ? lime(0.85) : ink(0.1);
    c.fillRect(nx - 16, y - 24 - bh, 32, bh);
    c.beginPath(); c.arc(nx, y, 9, 0, TAU); c.fillStyle = done ? PAL.limeHex : PAL.bg; c.fill();
    c.strokeStyle = done ? PAL.limeHex : ink(0.5); c.lineWidth = 1.5; c.stroke();
    c.fillStyle = ink(0.6); c.fillText(`0${k + 1} ${names[k]}`, nx, y + 58);
  }
  c.beginPath(); c.arc(x0 + (x1 - x0) * pp, y, 5, 0, TAU); c.fillStyle = PAL.limeHex; c.fill();
  c.textAlign = "start";
}

/* -------------------------------------------------------------- contact */
function contact({ c, w, h, t, mx, my }: Frame) {
  const L = 21, tx = w * 0.8 + mx * 12, ty = h * 0.5 + my * 12;
  for (let i = 0; i < L; i++) {
    const y0 = h * (0.06 + (0.88 * i) / (L - 1));
    const p0: Pt = [0, y0], p1: Pt = [w * 0.45, y0], p2: Pt = [w * 0.6, ty], p3: Pt = [tx, ty];
    const mid = i === Math.floor(L / 2);
    c.beginPath(); c.moveTo(p0[0], p0[1]); c.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
    c.strokeStyle = mid ? lime(0.95) : ink(0.12); c.lineWidth = mid ? 1.6 : 1; c.stroke();
    if (mid || rand(i + 1) > 0.4) {
      const u = (t * 0.18 + rand(i)) % 1;
      const [x, y] = bez(p0, p1, p2, p3, u);
      c.beginPath(); c.arc(x, y, 2.4, 0, TAU); c.fillStyle = PAL.limeHex; c.fill();
    }
  }
  const r = 14 + ((t * 18) % 30);
  c.beginPath(); c.arc(tx, ty, r, 0, TAU); c.strokeStyle = lime(clamp(1 - (r - 14) / 30) * 0.6); c.lineWidth = 1; c.stroke();
  c.beginPath(); c.arc(tx, ty, 6, 0, TAU); c.fillStyle = PAL.limeHex; c.fill();
}

/* ----------------------------------------------------------------- work */
function work({ c, w, h, t, mx, my }: Frame) {
  const F = 6, fw = Math.min(w * 0.62, h * 1.15), fh = fw * 0.62;
  for (let i = 0; i < F; i++) {
    const off = i - (F - 1) / 2;
    const x = w * 0.5 - fw / 2 + off * fw * 0.085 + mx * (6 + i * 3);
    const y = h * 0.5 - fh / 2 - off * fh * 0.1 + Math.sin(t * 0.8 + i * 0.9) * 5 + my * (4 + i * 2);
    rr(c, x, y, fw, fh, 16);
    c.fillStyle = i === F - 1 ? PAL.f1 : PAL.f2; c.fill();
    c.strokeStyle = ink(0.12 + 0.05 * i); c.lineWidth = 1; c.stroke();
    if (i === F - 1) {
      [0, 1, 2].forEach((d) => { c.beginPath(); c.arc(x + 22 + d * 14, y + 20, 3.5, 0, TAU); c.fillStyle = ink(0.2); c.fill(); });
      c.fillStyle = ink(0.12); c.fillRect(x, y + 38, fw, 1);
      c.fillStyle = ink(0.7); c.fillRect(x + 28, y + 70, fw * 0.4, 14); c.fillRect(x + 28, y + 94, fw * 0.28, 14);
      c.fillStyle = ink(0.2); c.fillRect(x + 28, y + 126, fw * 0.36, 6); c.fillRect(x + 28, y + 140, fw * 0.3, 6);
      rr(c, x + 28, y + 168, 92, 28, 14); c.fillStyle = PAL.limeHex; c.fill();
      for (let k = 0; k < 3; k++) { rr(c, x + 28 + k * (fw * 0.2), y + fh - 70, fw * 0.18, 44, 8); c.fillStyle = ink(0.06); c.fill(); c.strokeStyle = ink(0.14); c.stroke(); }
      rr(c, x + fw * 0.62, y + 62, fw * 0.3, fh * 0.42, 10); c.fillStyle = ink(0.05); c.fill(); c.strokeStyle = ink(0.14); c.stroke();
    }
  }
}

const DRAW: Record<VisualKind, (f: Frame) => void> = { build, connect, operate, automation, about, process, contact, work };

export function Visual({ kind, className = "", invert = false }: { kind: VisualKind; className?: string; invert?: boolean }) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const canvas: HTMLCanvasElement = el;
    const c: CanvasRenderingContext2D = ctx;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fn = DRAW[kind];
    let w = 1, h = 1, dpr = 1, raf = 0, visible = true;
    const m = { x: 0, y: 0, tx: 0, ty: 0 };

    const frame = (t: number) => {
      if (invert) { PAL.ink = "8,9,11"; PAL.lime = "8,9,11"; PAL.limeHex = "#08090B"; PAL.f1 = "#dcdbd3"; PAL.f2 = "#cfcec6"; PAL.bg = "#ecebe4"; }
      else { PAL.ink = "245,245,240"; PAL.lime = "191,234,90"; PAL.limeHex = "#BFEA5A"; PAL.f1 = "#12141a"; PAL.f2 = "#0c0e12"; PAL.bg = "#08090B"; }
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);
      c.font = "500 11px 'Geist Mono Variable', ui-monospace, monospace";
      fn({ c, w, h, t, mx: m.x, my: m.y });
    };
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth || 1; h = canvas.clientHeight || 1;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      if (calm) frame(4);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      m.tx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      m.ty = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    };
    const start = performance.now();
    const loop = () => {
      if (visible && !document.hidden) {
        m.x += (m.tx - m.x) * 0.06; m.y += (m.ty - m.y) * 0.06;
        frame((performance.now() - start) / 1000 + 2);
      }
      raf = requestAnimationFrame(loop);
    };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    let io: IntersectionObserver | undefined;
    if (!calm) {
      window.addEventListener("pointermove", onMove, { passive: true });
      io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
      io.observe(canvas);
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io?.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [kind, invert]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none block h-full w-full ${className}`} />;
}
