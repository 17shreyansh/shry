"use client";

import * as React from "react";

/**
 * The SHRY AI Dome: a glass geodesic dome on a reflective grid floor, with an AI core
 * of glowing particles inside. Raw WebGL, no libraries.
 *
 *  - progress (0..1, from the pinned hero scroll) flies the camera from outside the dome
 *    to inside it, and morphs the core: sphere -> neural swirl -> galaxy ring
 *  - data pulses travel along the dome struts; some glass panels light up like screens
 *  - the cursor orbits the camera slightly
 *
 * Performance: capped DPR, adaptive resolution, pauses off-screen / hidden tab, freezes on
 * devices that stay slow, single still frame for reduced motion, CSS poster without WebGL.
 */

type V3 = [number, number, number];

// ---------- tiny math ----------
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}
function lookAt(eye: V3, target: V3, up: V3 = [0, 1, 0]) {
  const z = norm(sub(eye, target)), x = norm(cross(up, z)), y = cross(z, x);
  return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1]);
}
function mul(a: Float32Array, b: Float32Array) {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
    let s = 0;
    for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
    o[c * 4 + r] = s;
  }
  return o;
}

// ---------- geometry ----------
const DOME_R = 2.0;

/** Geodesic hemisphere: subdivided icosahedron, faces with any vertex above the floor. */
function geodesic(level: number) {
  const t = (1 + Math.sqrt(5)) / 2;
  let verts: V3[] = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map((v) => norm(v as V3));
  let faces: [number, number, number][] = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  for (let l = 0; l < level; l++) {
    const cache = new Map<string, number>();
    const mid = (a: number, b: number) => {
      const k = a < b ? `${a}_${b}` : `${b}_${a}`;
      let i = cache.get(k);
      if (i === undefined) { const va = verts[a], vb = verts[b]; i = verts.push(norm([(va[0] + vb[0]) / 2, (va[1] + vb[1]) / 2, (va[2] + vb[2]) / 2])) - 1; cache.set(k, i); }
      return i;
    };
    const next: [number, number, number][] = [];
    for (const [a, b, c] of faces) { const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a); next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]); }
    faces = next;
  }
  // tilt so a vertex is not exactly at the apex, then keep the upper hemisphere
  verts = verts.map(([x, y, z]) => [x * DOME_R, y * DOME_R, z * DOME_R]);
  const kept = faces.filter((f) => f.every((i) => verts[i][1] > -0.02));
  const edges = new Set<string>();
  const lines: number[] = [], lineT: number[] = [], lineSeed: number[] = [];
  const tris: number[] = [], triN: number[] = [], triSeed: number[] = [];
  for (const f of kept) {
    const seed = Math.random();
    const n = norm(f.reduce<V3>((acc, i) => [acc[0] + verts[i][0], acc[1] + verts[i][1], acc[2] + verts[i][2]], [0, 0, 0]));
    for (const i of f) { tris.push(...verts[i]); triN.push(...n); triSeed.push(seed); }
    for (let e = 0; e < 3; e++) {
      const a = f[e], b = f[(e + 1) % 3], k = a < b ? `${a}_${b}` : `${b}_${a}`;
      if (edges.has(k)) continue;
      edges.add(k);
      const s = Math.random();
      lines.push(...verts[a], ...verts[b]); lineT.push(0, 1); lineSeed.push(s, s);
    }
  }
  return { lines, lineT, lineSeed, tris, triN, triSeed };
}

/** Particle targets: A sphere core, B neural swirl, C galaxy ring. Plus a star field. */
function particles(count: number, stars: number) {
  const n = count + stars;
  const A = new Float32Array(n * 3), B = new Float32Array(n * 3), C = new Float32Array(n * 3), S = new Float32Array(n), K = new Float32Array(n);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const s = Math.random();
    // A: Fibonacci sphere shell with a little depth
    const y = 1 - (i / (count - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
    const rr = 0.58 * (0.9 + Math.random() * 0.12);
    A.set([Math.cos(th) * r * rr, y * rr, Math.sin(th) * r * rr], i * 3);
    // B: neural swirl, filaments wound around the core
    const f = i % 9, u = Math.random() * Math.PI * 2, ff = (f / 9) * Math.PI * 2;
    const R = 0.45 + Math.random() * 0.95;
    B.set([Math.cos(u + ff) * R, Math.sin(u * 2 + ff) * 0.55 * (R / 1.4) + (Math.random() - 0.5) * 0.12, Math.sin(u + ff) * R * 0.8], i * 3);
    // C: galaxy ring with two spiral arms
    const arm = i % 2, d = Math.pow(Math.random(), 0.7), ang = d * 5.5 + arm * Math.PI + (Math.random() - 0.5) * 0.5;
    const rad = 0.35 + d * 1.25;
    C.set([Math.cos(ang) * rad, (Math.random() - 0.5) * 0.08 * (1.4 - d), Math.sin(ang) * rad], i * 3);
    S[i] = s; K[i] = 0;
  }
  for (let j = 0; j < stars; j++) {
    const i = count + j;
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = 18 + Math.random() * 10;
    const q = Math.sqrt(1 - u * u);
    const p: V3 = [Math.cos(th) * q * r, Math.abs(u) * r * 0.8 + 1.5, Math.sin(th) * q * r];
    A.set(p, i * 3); B.set(p, i * 3); C.set(p, i * 3);
    S[i] = Math.random(); K[i] = 1;
  }
  return { A, B, C, S, K, n };
}

// ---------- shaders ----------
const FLOOR_VS = `
attribute vec2 aP; uniform mat4 uVP; varying vec2 vW;
void main(){ vW = aP; gl_Position = uVP * vec4(aP.x, 0.0, aP.y, 1.0); }`;
const FLOOR_FS = `
precision highp float; varying vec2 vW; uniform vec3 uTint; uniform float uTime; uniform float uCore;
float line(float x, float w){ float d = abs(fract(x) - 0.5); return smoothstep(w, 0.0, 0.5 - d); }
void main(){
  float r = length(vW);
  float g = max(line(vW.x * 2.0, 0.03), line(vW.y * 2.0, 0.03));
  float fade = exp(-r * 0.22);
  vec3 c = vec3(0.027, 0.03, 0.04);
  c += vec3(0.55) * g * 0.10 * fade;
  // dome footprint ring + scanning ring
  c += uTint * smoothstep(0.035, 0.0, abs(r - ${DOME_R.toFixed(1)})) * 0.9;
  float scan = fract(uTime * 0.12);
  c += uTint * smoothstep(0.05, 0.0, abs(r - scan * 9.0)) * (1.0 - scan) * 0.35;
  // reflection of the core
  c += uTint * exp(-r * 2.2) * 0.35 * uCore;
  c += vec3(1.0) * exp(-r * 6.0) * 0.08 * uCore;
  gl_FragColor = vec4(c, 1.0);
}`;
const PANEL_VS = `
attribute vec3 aP; attribute vec3 aN; attribute float aS;
uniform mat4 uVP; uniform vec3 uEye; varying float vF; varying float vS; varying float vY;
void main(){ vec3 v = normalize(uEye - aP); vF = pow(1.0 - abs(dot(v, aN)), 2.5); vS = aS; vY = aP.y; gl_Position = uVP * vec4(aP, 1.0); }`;
const PANEL_FS = `
precision highp float; varying float vF; varying float vS; varying float vY; uniform vec3 uTint; uniform float uTime;
void main(){
  float lit = step(0.94, vS) * (0.5 + 0.5 * sin(uTime * (1.0 + vS * 3.0) + vS * 40.0));
  vec3 c = vec3(0.55, 0.62, 0.8) * vF * 0.10 + uTint * lit * 0.10;
  c *= smoothstep(-0.05, 0.4, vY);
  gl_FragColor = vec4(c, 1.0);
}`;
const LINE_VS = `
attribute vec3 aP; attribute float aT; attribute float aS;
uniform mat4 uVP; uniform mat4 uV; varying float vT; varying float vS; varying float vD;
void main(){ vT = aT; vS = aS; vec4 vp = uV * vec4(aP, 1.0); vD = -vp.z; gl_Position = uVP * vec4(aP, 1.0); }`;
const LINE_FS = `
precision highp float; varying float vT; varying float vS; varying float vD; uniform vec3 uTint; uniform float uTime;
void main(){
  float pulse = smoothstep(0.12, 0.0, abs(fract(uTime * (0.25 + vS * 0.5) + vS * 7.0) - vT)) * step(0.55, vS);
  float base = 0.16 + 0.10 * vS;
  float depth = clamp(1.4 - vD * 0.12, 0.35, 1.0);
  vec3 c = mix(vec3(0.75, 0.8, 0.9) * base, uTint * 1.6, pulse) * depth;
  gl_FragColor = vec4(c, 1.0);
}`;
const PT_VS = `
attribute vec3 aA; attribute vec3 aB; attribute vec3 aC; attribute float aS; attribute float aK;
uniform mat4 uVP; uniform float uTime; uniform float uMorph; uniform float uPx; uniform float uH;
varying float vS; varying float vK;
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
void main(){
  vS = aS; vK = aK;
  vec3 p;
  if (aK > 0.5) { p = aA; }
  else {
    float m1 = smoothstep(0.0, 1.0, clamp(uMorph, 0.0, 1.0));
    float m2 = smoothstep(0.0, 1.0, clamp(uMorph - 1.0, 0.0, 1.0));
    p = mix(mix(aA, aB, m1), aC, m2);
    p.xz *= rot(uTime * (0.12 + aS * 0.18) * (0.4 + m1));
    p += 0.018 * vec3(sin(uTime * 1.3 + aS * 61.0), cos(uTime * 1.1 + aS * 37.0), sin(uTime * 0.9 + aS * 17.0));
    p.y += uH;
  }
  vec4 cp = uVP * vec4(p, 1.0);
  gl_Position = cp;
  float sz = aK > 0.5 ? 1.2 : (1.6 + aS * 3.0);
  gl_PointSize = clamp(sz * uPx * (aK > 0.5 ? 1.5 : 7.0) / max(cp.w, 0.3), 1.0, 14.0);
}`;
const PT_FS = `
precision highp float; varying float vS; varying float vK; uniform vec3 uTint; uniform float uTime;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  vec3 c;
  if (vK > 0.5) c = vec3(0.7, 0.75, 0.9) * (0.25 + 0.35 * sin(uTime * (0.5 + vS) + vS * 50.0) * 0.5 + 0.2);
  else c = vS > 0.86 ? vec3(1.0, 1.0, 0.95) * 1.3 : mix(uTint, vec3(0.55, 0.85, 1.0), step(0.7, vS) * 0.6) * (0.8 + vS * 0.7);
  gl_FragColor = vec4(c * a, 1.0);
}`;

function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const mk = (type: number, src: string) => {
    const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  return p;
}

function hexToRgb(hex: string): V3 {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function HeroDome({ progress, tint = "#BFEA5A", className = "" }: { progress: React.MutableRefObject<number>; tint?: string; className?: string }) {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const gl = c.getContext("webgl", { antialias: true, alpha: false, powerPreference: "high-performance" });
    if (!gl) { setFailed(true); return; }

    let P: { floor: WebGLProgram; panel: WebGLProgram; line: WebGLProgram; pt: WebGLProgram };
    try {
      P = { floor: program(gl, FLOOR_VS, FLOOR_FS), panel: program(gl, PANEL_VS, PANEL_FS), line: program(gl, LINE_VS, LINE_FS), pt: program(gl, PT_VS, PT_FS) };
    } catch (e) { console.warn(e); setFailed(true); return; }

    const small = window.matchMedia("(max-width: 767px)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const geo = geodesic(3);
    const pts = particles(small ? 5000 : 11000, small ? 500 : 900);

    const buf = (data: Float32Array | number[]) => {
      const b = gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data instanceof Float32Array ? data : new Float32Array(data), gl.STATIC_DRAW); return b;
    };
    const B = {
      floor: buf([-40, -40, 40, -40, -40, 40, -40, 40, 40, -40, 40, 40]),
      lp: buf(geo.lines), lt: buf(geo.lineT), ls: buf(geo.lineSeed),
      tp: buf(geo.tris), tn: buf(geo.triN), ts: buf(geo.triSeed),
      a: buf(pts.A), b: buf(pts.B), c: buf(pts.C), s: buf(pts.S), k: buf(pts.K),
    };
    const lineCount = geo.lines.length / 3, triCount = geo.tris.length / 3;

    const attr = (p: WebGLProgram, name: string, b: WebGLBuffer, size: number) => {
      const l = gl.getAttribLocation(p, name); if (l < 0) return -1;
      gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0); return l;
    };
    const used: number[] = [];
    const bind = (p: WebGLProgram, list: [string, WebGLBuffer, number][]) => {
      used.forEach((l) => gl.disableVertexAttribArray(l)); used.length = 0;
      gl.useProgram(p);
      for (const [n, b, s] of list) { const l = attr(p, n, b, s); if (l >= 0) used.push(l); }
    };
    const U = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const T = hexToRgb(tint);

    let scale = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
    const minScale = 0.6;
    let aspect = 1;
    const resize = () => {
      const w = c.clientWidth, h = c.clientHeight;
      c.width = Math.max(1, Math.round(w * scale)); c.height = Math.max(1, Math.round(h * scale));
      gl.viewport(0, 0, c.width, c.height); aspect = w / Math.max(1, h);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(c);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => { mouse.tx = (e.clientX / window.innerWidth) * 2 - 1; mouse.ty = (e.clientY / window.innerHeight) * 2 - 1; };
    window.addEventListener("pointermove", onMove, { passive: true });

    gl.disable(gl.DEPTH_TEST);
    const start = performance.now();
    let sp = 0; // smoothed progress
    let raf = 0, visible = true, frozen = false, last = start, slow = 0, intro = calm ? 1 : 0;

    const draw = (now: number) => {
      const dt = Math.min(64, now - last); last = now;
      if (dt > 24) slow++; else slow = Math.max(0, slow - 1);
      if (slow > 45 && scale > minScale) { scale = Math.max(minScale, scale * 0.8); slow = 0; resize(); }
      else if (slow > 120 && scale <= minScale) frozen = true;

      const time = (now - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.04; mouse.y += (mouse.ty - mouse.y) * 0.04;
      sp += (progress.current - sp) * 0.08;
      intro = Math.min(1, intro + dt / 1800);
      const e = 1 - Math.pow(1 - intro, 3);

      // camera: from high outside the dome, spiralling down and in through the glass
      const k = sp * sp * (3 - 2 * sp);
      const portrait = aspect < 1;
      const rad = (portrait ? 9.5 : 7.2) * (1 - k) + 1.55 * k + (1 - e) * 3;
      const hgt = 3.1 * (1 - k) + 1.45 * k + (1 - e) * 1.5;
      const ang = -0.6 + time * 0.035 + k * 2.4 + mouse.x * 0.35;
      const eye: V3 = [Math.sin(ang) * rad, hgt - mouse.y * 0.25, Math.cos(ang) * rad];
      // frame the dome to the right of the copy on wide screens, centred when inside it
      const side = portrait ? 0 : Math.min(2.8, 1.45 * aspect) * (1 - k);
      const right: V3 = [Math.cos(ang), 0, -Math.sin(ang)];
      const target: V3 = [-right[0] * side, 0.95 - 0.35 * k - (portrait ? 0.9 * (1 - k) : 0), -right[2] * side];
      const V = lookAt(eye, target);
      const VP = mul(perspective((portrait ? 58 : 42) * Math.PI / 180, aspect, 0.05, 80), V);

      gl.clearColor(0.027, 0.03, 0.04, 1); gl.clear(gl.COLOR_BUFFER_BIT);

      // floor (opaque)
      gl.disable(gl.BLEND);
      bind(P.floor, [["aP", B.floor, 2]]);
      gl.uniformMatrix4fv(U(P.floor, "uVP"), false, VP); gl.uniform3fv(U(P.floor, "uTint"), T);
      gl.uniform1f(U(P.floor, "uTime"), time); gl.uniform1f(U(P.floor, "uCore"), e);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // additive light from here on
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
      bind(P.panel, [["aP", B.tp, 3], ["aN", B.tn, 3], ["aS", B.ts, 1]]);
      gl.uniformMatrix4fv(U(P.panel, "uVP"), false, VP); gl.uniform3fv(U(P.panel, "uEye"), eye);
      gl.uniform3fv(U(P.panel, "uTint"), T); gl.uniform1f(U(P.panel, "uTime"), time);
      gl.drawArrays(gl.TRIANGLES, 0, triCount);

      bind(P.line, [["aP", B.lp, 3], ["aT", B.lt, 1], ["aS", B.ls, 1]]);
      gl.uniformMatrix4fv(U(P.line, "uVP"), false, VP); gl.uniformMatrix4fv(U(P.line, "uV"), false, V);
      gl.uniform3fv(U(P.line, "uTint"), T); gl.uniform1f(U(P.line, "uTime"), time);
      gl.drawArrays(gl.LINES, 0, lineCount);

      bind(P.pt, [["aA", B.a, 3], ["aB", B.b, 3], ["aC", B.c, 3], ["aS", B.s, 1], ["aK", B.k, 1]]);
      gl.uniformMatrix4fv(U(P.pt, "uVP"), false, VP); gl.uniform3fv(U(P.pt, "uTint"), T);
      gl.uniform1f(U(P.pt, "uTime"), time); gl.uniform1f(U(P.pt, "uMorph"), Math.min(2, sp * 2.3));
      gl.uniform1f(U(P.pt, "uPx"), scale * e); gl.uniform1f(U(P.pt, "uH"), 0.95);
      gl.drawArrays(gl.POINTS, 0, pts.n);
    };

    const loop = (now: number) => { draw(now); raf = visible && !document.hidden && !frozen ? requestAnimationFrame(loop) : 0; };
    const play = () => { if (!raf && !calm && !frozen && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) play(); });
    io.observe(c);
    const onVis = () => play();
    document.addEventListener("visibilitychange", onVis);
    const id = window.setTimeout(() => { if (calm) draw(performance.now()); else play(); }, 60);

    return () => {
      window.clearTimeout(id); cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", onMove); document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [progress, tint]);

  return (
    <div aria-hidden className={`absolute inset-0 ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(45%_55%_at_70%_55%,rgba(191,234,90,0.10),transparent_70%),radial-gradient(90%_90%_at_50%_50%,#0b0c10,#07080a)]" />
      {!failed && <canvas ref={canvas} className="absolute inset-0 h-full w-full" />}
    </div>
  );
}
