"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { getLenis } from "@/lib/lenis";

/**
 * The SHRY World: one fixed WebGL canvas behind every page.
 *
 * Up to 18k particles re-form into a different 3D sculpture for each section as you scroll
 * (data landscape, double helix, orbit rings, globe, light tunnel, ribbon) and assemble into
 * the SHRY wordmark at the footer. Shapes are computed procedurally in the vertex shader,
 * so the only per-particle data is an id, a seed and the wordmark position.
 *
 * Sections choose a scene with data-scene="grid|helix|rings|globe|tunnel|wave|text";
 * otherwise scenes cycle in order. The world fades out where a section has its own hero scene
 * (data-world="off"), e.g. the home dome and inner-page heroes.
 *
 * Performance: capped DPR, adaptive resolution, pauses when hidden or fully covered,
 * still frame for reduced motion, nothing rendered without WebGL.
 */

const SCENES = ["grid", "helix", "rings", "globe", "tunnel", "wave", "text"] as const;
type Scene = (typeof SCENES)[number];
const CYCLE: Scene[] = ["grid", "helix", "rings", "globe", "wave", "tunnel"];

const VS = `
attribute float aId; attribute float aS; attribute vec3 aT;
uniform float uN; uniform float uTime; uniform float uA; uniform float uB; uniform float uMix;
uniform float uVel; uniform float uAspect; uniform vec2 uMouse; uniform float uPx; uniform float uRot; uniform float uFade;
varying float vA; varying float vS;
const float PI = 3.14159265;
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

vec3 shape(float k, float id, float s, float t){
  float u = id / uN;
  if (k < 0.5) { // grid: rolling data landscape
    float cols = 150.0; float gx = mod(id, cols); float gz = floor(id / cols);
    float rows = ceil(uN / cols);
    float x = (gx / cols - 0.5) * 18.0, z = (gz / rows - 0.5) * 14.0;
    float y = sin(x * 0.55 + t * 0.6) * cos(z * 0.45 + t * 0.4) * 0.9 + sin((x + z) * 0.25 - t * 0.3) * 0.5;
    return vec3(x, y - 1.6, z - 2.0);
  }
  if (k < 1.5) { // helix: double helix with rungs
    float a = u * 14.0 * PI + t * 0.4;
    float strand = step(0.5, s) * PI;
    float x = (u - 0.5) * 20.0;
    float r = 1.3;
    if (s > 0.9) { float m = fract(s * 37.0); vec3 p1 = vec3(x, cos(a) * r, sin(a) * r), p2 = vec3(x, cos(a + PI) * r, sin(a + PI) * r); return mix(p1, p2, m); }
    return vec3(x, cos(a + strand) * r, sin(a + strand) * r) + (s - 0.5) * 0.08;
  }
  if (k < 2.5) { // rings: tilted orbits
    float ring = floor(s * 7.0); float r = 0.9 + ring * 0.48;
    float a = u * 2.0 * PI * 40.0 + t * (0.15 + ring * 0.03) * (mod(ring, 2.0) * 2.0 - 1.0);
    vec3 p = vec3(cos(a) * r, 0.0, sin(a) * r);
    p.yz *= rot(0.9 + ring * 0.12); p.xy *= rot(ring * 0.4);
    return p;
  }
  if (k < 3.5) { // globe: fibonacci sphere with latitude bands
    float y = 1.0 - 2.0 * u; float rr = sqrt(1.0 - y * y); float th = 2.399963 * id;
    vec3 p = vec3(cos(th) * rr, y, sin(th) * rr) * 2.7;
    p.y = mix(p.y, floor(p.y * 4.0 + 0.5) / 4.0, step(0.75, s) * 0.85);
    p.xz *= rot(t * 0.12);
    return p;
  }
  if (k < 4.5) { // tunnel: rings of light rushing toward the camera
    float a = u * 2.0 * PI * 90.0; float z = fract(s + t * 0.06) ;
    float r = 2.2 + sin(a * 3.0 + z * 20.0) * 0.15;
    return vec3(cos(a) * r, sin(a) * r, mix(-26.0, 4.0, z));
  }
  if (k < 5.5) { // wave: flowing ribbon
    float x = (u - 0.5) * 22.0;
    float w = (s - 0.5) * 2.4;
    float y = sin(x * 0.5 + t * 0.7) * 1.1 + w * 0.35 * cos(x * 0.3 + t);
    float z = cos(x * 0.25 + t * 0.4) * 2.0 + w;
    return vec3(x, y, z - 1.0);
  }
  return aT; // text: SHRY wordmark
}

void main(){
  float t = uTime;
  vec3 a = shape(uA, aId, aS, t), b = shape(uB, aId, aS, t);
  float m = smoothstep(0.0, 1.0, clamp(uMix * 1.4 - aS * 0.4, 0.0, 1.0));
  vec3 p = mix(a, b, m);
  // in-flight particles swirl between formations
  float flight = sin(m * PI);
  p += flight * vec3(sin(aS * 40.0 + t), cos(aS * 23.0 + t * 1.3), sin(aS * 17.0 - t)) * 1.2;
  // scroll velocity streams particles vertically
  p.y += uVel * (0.6 + aS) * 1.4;
  // the wordmark faces the viewer: no world rotation while it is formed
  float tw = (uB > 5.5 ? m : 0.0) + (uA > 5.5 ? 1.0 - m : 0.0);
  float spin = (1.0 - tw);
  p.xz *= rot((uRot + uMouse.x * 0.25) * spin + uMouse.x * 0.12 * tw);
  p.yz *= rot(uMouse.y * 0.12);
  // camera
  vec3 c = p - vec3(0.0, 0.0, 9.0);
  float z = -c.z;
  vec2 ndc = c.xy * 1.9 / max(z, 0.2);
  ndc.x /= uAspect;
  // cursor repulsion
  vec2 d = ndc - uMouse * vec2(1.0, -1.0);
  d.x *= uAspect;
  float dist = length(d);
  ndc += normalize(d + 1e-4) * 0.08 * exp(-dist * 5.0) * vec2(1.0 / uAspect, 1.0);
  gl_Position = vec4(ndc, clamp(z / 40.0, 0.0, 0.99), 1.0);
  vA = (0.25 + 0.75 * clamp(1.0 - z / 28.0, 0.0, 1.0)) * uFade * (z > 0.3 ? 1.0 : 0.0);
  vS = aS;
  gl_PointSize = clamp((1.2 + aS * 2.2) * uPx * 9.0 / max(z, 0.5), 1.0, 9.0);
}`;

const FS = `
precision mediump float; varying float vA; varying float vS; uniform vec3 uTint;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d); a *= a;
  vec3 c = vS > 0.93 ? vec3(1.0) : mix(uTint, vec3(0.6, 0.85, 1.0), step(0.78, vS) * 0.5);
  gl_FragColor = vec4(c * a * vA * 0.55, 1.0);
}`;

async function wordmark(n: number): Promise<Float32Array> {
  try { await document.fonts.ready; } catch { /* ignore */ }
  const W = 900, H = 260, cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const x = cv.getContext("2d")!;
  x.fillStyle = "#fff"; x.textAlign = "center"; x.textBaseline = "middle";
  x.font = `800 230px "Bricolage Grotesque Variable", "Arial Black", sans-serif`;
  x.fillText("SHRY.", W / 2, H / 2 + 10);
  const img = x.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  for (let yy = 0; yy < H; yy += 3) for (let xx = 0; xx < W; xx += 3) if (img[(yy * W + xx) * 4 + 3] > 128) pts.push(xx, yy);
  const out = new Float32Array(n * 3), m = pts.length / 2 || 1;
  for (let i = 0; i < n; i++) {
    const j = Math.floor(Math.random() * m) * 2;
    out[i * 3] = (pts[j] / W - 0.5) * 13 + (Math.random() - 0.5) * 0.04;
    out[i * 3 + 1] = -(pts[j + 1] / H - 0.5) * 3.8 - 2.5 + (Math.random() - 0.5) * 0.04;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }
  return out;
}

export function World() {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const state = React.useRef({ a: 0, b: 0, mix: 1, target: 0, fade: 0, fadeTarget: 0 });
  const sectionsRef = React.useRef<{ el: HTMLElement; scene: number; off: boolean }[]>([]);

  // collect sections and their scenes for this page
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      const main = document.getElementById("main");
      const list = main ? Array.from(main.querySelectorAll<HTMLElement>(":scope > section, :scope > nav, :scope > a")) : [];
      const footer = document.querySelector<HTMLElement>("footer");
      if (footer) list.push(footer);
      let ci = 0;
      sectionsRef.current = list.filter((s) => s.offsetHeight > 160).map((el) => {
        const ds = el.dataset.scene as Scene | undefined;
        const off = el.dataset.world === "off";
        const scene = ds && SCENES.includes(ds) ? SCENES.indexOf(ds) : SCENES.indexOf(CYCLE[ci++ % CYCLE.length]);
        return { el, scene, off };
      });
    }, 300);
    return () => window.clearTimeout(id);
  }, [pathname]);

  React.useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const gl = c.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" });
    if (!gl) return;
    const mk = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
    const vs = mk(gl.VERTEX_SHADER, VS), fs = mk(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const small = window.matchMedia("(max-width: 767px)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = small ? 7000 : 18000;
    const ids = new Float32Array(N), seeds = new Float32Array(N);
    for (let i = 0; i < N; i++) { ids[i] = i; seeds[i] = Math.random(); }
    const bind = (name: string, data: Float32Array, size: number) => {
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const l = gl.getAttribLocation(prog, name); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0);
      return b;
    };
    bind("aId", ids, 1); bind("aS", seeds, 1);
    const tb = bind("aT", new Float32Array(N * 3), 3);
    wordmark(N).then((pts) => { gl.bindBuffer(gl.ARRAY_BUFFER, tb); gl.bufferData(gl.ARRAY_BUFFER, pts, gl.STATIC_DRAW); }).catch(() => {});

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u = { N: U("uN"), time: U("uTime"), A: U("uA"), B: U("uB"), mix: U("uMix"), vel: U("uVel"), aspect: U("uAspect"), mouse: U("uMouse"), px: U("uPx"), rot: U("uRot"), fade: U("uFade"), tint: U("uTint") };
    gl.uniform1f(u.N, N); gl.uniform3f(u.tint, 0.749, 0.918, 0.353);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);

    let scale = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      c.width = Math.round(c.clientWidth * scale); c.height = Math.round(c.clientHeight * scale);
      gl.viewport(0, 0, c.width, c.height); gl.uniform1f(u.aspect, c.clientWidth / Math.max(1, c.clientHeight)); gl.uniform1f(u.px, scale);
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => { mouse.tx = (e.clientX / window.innerWidth) * 2 - 1; mouse.ty = (e.clientY / window.innerHeight) * 2 - 1; };
    window.addEventListener("pointermove", onMove, { passive: true });

    const st = state.current;
    let raf = 0, last = performance.now(), slow = 0, vel = 0, rotA = 0;
    const start = last;

    const pick = () => {
      const mid = window.innerHeight * 0.5;
      let cur = -1, off = false;
      for (let i = 0; i < sectionsRef.current.length; i++) {
        const s = sectionsRef.current[i], r = s.el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) { cur = s.scene; off = s.off; break; }
      }
      st.fadeTarget = cur < 0 || off ? 0 : 1;
      if (cur >= 0 && cur !== st.target) {
        // retarget: freeze the current blend as the new origin
        st.a = st.mix > 0.5 ? st.b : st.a; st.b = cur; st.target = cur; st.mix = 0;
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(64, now - last); last = now;
      if (dt > 28) slow++; else slow = Math.max(0, slow - 1);
      if (slow > 60 && scale > 0.6) { scale *= 0.8; slow = 0; resize(); }
      pick();
      st.mix = Math.min(1, st.mix + dt / 1600);
      st.fade += (st.fadeTarget - st.fade) * 0.06;
      const l = getLenis();
      const v = l ? Math.max(-1, Math.min(1, l.velocity / 40)) : 0;
      vel += (v - vel) * 0.1;
      rotA += dt * 0.00004 + vel * 0.01;
      mouse.x += (mouse.tx - mouse.x) * 0.05; mouse.y += (mouse.ty - mouse.y) * 0.05;

      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      if (st.fade > 0.01) {
        gl.uniform1f(u.time, (now - start) / 1000);
        gl.uniform1f(u.A, st.a); gl.uniform1f(u.B, st.b); gl.uniform1f(u.mix, st.mix);
        gl.uniform1f(u.vel, vel); gl.uniform2f(u.mouse, mouse.x, mouse.y); gl.uniform1f(u.rot, rotA);
        gl.uniform1f(u.fade, st.fade);
        gl.drawArrays(gl.POINTS, 0, N);
      }
    };
    const loop = (now: number) => { frame(now); raf = document.hidden ? 0 : requestAnimationFrame(loop); };
    const onVis = () => { if (!document.hidden && !raf && !calm) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    document.addEventListener("visibilitychange", onVis);
    const onScrollCalm = () => frame(performance.now());
    if (calm) { st.mix = 1; window.addEventListener("scroll", onScrollCalm, { passive: true }); window.setTimeout(() => { st.fade = 1; frame(performance.now()); }, 400); }
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScrollCalm); document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
