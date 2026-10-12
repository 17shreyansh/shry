"use client";

import * as React from "react";

/**
 * Hero visual: a live 3D network ("the systems") drawn with raw WebGL.
 * Nodes sit on a lattice sphere; links carry lime data pulses; the cursor
 * pushes nodes aside and tilts the whole structure. No libraries.
 * Falls back to a static grid if WebGL is unavailable; renders one still
 * frame when the visitor prefers reduced motion.
 */

const COMMON = `
precision highp float;
uniform float uTime, uAspect, uScale, uRotY, uRotX, uPx;
uniform vec2 uMouse, uOffset;
vec4 place(vec3 p, float seed, out float depth) {
  p *= 1.0 + 0.018 * sin(uTime * 0.7 + seed * 40.0);
  float cy = cos(uRotY), sy = sin(uRotY), cx = cos(uRotX), sx = sin(uRotX);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  p *= uScale;
  depth = clamp(p.z * 0.5 + 0.5, 0.0, 1.0);
  float z = 3.4 - p.z;
  vec2 ndc = p.xy * 1.9 / z;
  ndc.x /= uAspect;
  ndc += uOffset;
  vec2 d = ndc - uMouse;
  d.x *= uAspect;
  float dist = length(d);
  ndc += normalize(d + 1e-4) * 0.11 * exp(-dist * 4.5) * vec2(1.0 / uAspect, 1.0);
  return vec4(ndc, 0.0, 1.0);
}`;

const POINT_VS = `${COMMON}
attribute vec3 aPos; attribute float aSeed;
varying float vDepth; varying float vSeed;
void main() {
  float depth;
  gl_Position = place(aPos, aSeed, depth);
  vDepth = depth; vSeed = aSeed;
  gl_PointSize = (2.8 + 4.2 * depth + step(0.9, aSeed) * 4.0) * uPx;
}`;
const POINT_FS = `precision highp float;
uniform float uAlpha; varying float vDepth; varying float vSeed;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d);
  vec3 lime = vec3(0.749, 0.918, 0.353);
  vec3 col = vSeed > 0.9 ? lime : vec3(0.96, 0.96, 0.94);
  float k = vSeed > 0.9 ? 1.0 : (0.4 + 0.6 * vDepth);
  gl_FragColor = vec4(col, a * k * uAlpha);
}`;

const LINE_VS = `${COMMON}
attribute vec3 aPos; attribute float aT; attribute float aSeed;
varying float vDepth; varying float vT; varying float vSeed;
void main() {
  float depth;
  gl_Position = place(aPos, aSeed, depth);
  vDepth = depth; vT = aT; vSeed = aSeed;
}`;
const LINE_FS = `precision highp float;
uniform float uTime, uAlpha; varying float vDepth; varying float vT; varying float vSeed;
void main() {
  float speed = 0.10 + 0.14 * fract(vSeed * 13.0);
  float head = fract(uTime * speed + vSeed * 7.0);
  float dd = abs(vT - head);
  float pulse = smoothstep(0.16, 0.0, dd) * step(0.45, fract(vSeed * 5.0));
  vec3 lime = vec3(0.749, 0.918, 0.353);
  vec3 base = vec3(0.96, 0.96, 0.94);
  float a = (0.16 + 0.34 * vDepth) * uAlpha;
  vec3 col = mix(base, lime, pulse);
  gl_FragColor = vec4(col, a + pulse * 0.85 * uAlpha);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader error");
  return s;
}
function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link error");
  return p;
}

function buildGraph(count: number) {
  const pts: number[][] = [];
  const outer = Math.round(count * 0.82);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < outer; i++) {
    const y = 1 - (i / (outer - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    const k = 0.94 + Math.random() * 0.14;
    pts.push([Math.cos(th) * r * k, y * k, Math.sin(th) * r * k]);
  }
  for (let i = outer; i < count; i++) {
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, rr = 0.2 + Math.random() * 0.6;
    const s = Math.sqrt(1 - u * u);
    pts.push([Math.cos(th) * s * rr, u * rr, Math.sin(th) * s * rr]);
  }
  const seeds = pts.map(() => Math.random());
  const edges = new Set<string>();
  const lineData: number[] = [];
  pts.forEach((a, i) => {
    const near = pts
      .map((b, j) => ({ j, d: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 3);
    near.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (edges.has(key)) return;
      edges.add(key);
      const b = pts[j];
      const s = Math.random();
      lineData.push(a[0], a[1], a[2], 0, s, b[0], b[1], b[2], 1, s);
    });
  });
  const pointData = new Float32Array(pts.flatMap((p, i) => [p[0], p[1], p[2], seeds[i]]));
  return { pointData, lineData: new Float32Array(lineData), nodes: pts.length, links: edges.size };
}

export function NetworkCanvas({ onStats }: { onStats?: (s: { nodes: number; links: number }) => void }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const canvas: HTMLCanvasElement = el;
    const ctx = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!ctx) { setFailed(true); return; }
    const gl: WebGLRenderingContext = ctx;

    let raf = 0, running = true, visible = true, disposed = false;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;

    let pProg: WebGLProgram, lProg: WebGLProgram;
    try {
      pProg = program(gl, POINT_VS, POINT_FS);
      lProg = program(gl, LINE_VS, LINE_FS);
    } catch { setFailed(true); return; }

    const g = buildGraph(small ? 150 : 260);
    onStats?.({ nodes: g.nodes, links: g.links });
    const pBuf = gl.createBuffer()!, lBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuf); gl.bufferData(gl.ARRAY_BUFFER, g.pointData, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, lBuf); gl.bufferData(gl.ARRAY_BUFFER, g.lineData, gl.STATIC_DRAW);

    const loc = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const uni = (p: WebGLProgram) => ({
      time: loc(p, "uTime"), aspect: loc(p, "uAspect"), scale: loc(p, "uScale"), rotY: loc(p, "uRotY"), rotX: loc(p, "uRotX"),
      px: loc(p, "uPx"), mouse: loc(p, "uMouse"), offset: loc(p, "uOffset"), alpha: loc(p, "uAlpha"),
    });
    const uP = uni(pProg), uL = uni(lProg);
    const pPos = gl.getAttribLocation(pProg, "aPos"), pSeed = gl.getAttribLocation(pProg, "aSeed");
    const lPos = gl.getAttribLocation(lProg, "aPos"), lT = gl.getAttribLocation(lProg, "aT"), lSeed = gl.getAttribLocation(lProg, "aSeed");

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let w = 1, h = 1, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr)); canvas.height = Math.max(1, Math.round(h * dpr));
      if (calm) draw(4);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };

    const setUniforms = (u: ReturnType<typeof uni>, t: number, rotY: number, rotX: number, scale: number, ox: number, oy: number, alpha: number) => {
      gl.uniform1f(u.time, t); gl.uniform1f(u.aspect, w / h); gl.uniform1f(u.scale, scale);
      gl.uniform1f(u.rotY, rotY); gl.uniform1f(u.rotX, rotX); gl.uniform1f(u.px, dpr);
      gl.uniform2f(u.mouse, mouse.x * 0.9 + ox, mouse.y * 0.9 + oy); gl.uniform2f(u.offset, ox, oy); gl.uniform1f(u.alpha, alpha);
    };

    function draw(t: number) {
      const aspect = w / h;
      const wide = aspect > 1.15;
      const prog = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)));
      const base = wide ? 1.12 : Math.min(1.05, aspect * 2.1);
      const scale = base * (1 + prog * 0.35);
      const ox = wide ? 0.4 * (1 - prog) : 0;
      const oy = wide ? 0.02 : 0.3;
      const alpha = (wide ? 1 : 0.8) * (1 - prog * 0.8);
      const rotY = t * 0.09 + mouse.x * 0.55;
      const rotX = 0.38 + mouse.y * 0.28 + prog * 0.4;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      gl.useProgram(lProg); setUniforms(uL, t, rotY, rotX, scale, ox, oy, alpha);
      gl.bindBuffer(gl.ARRAY_BUFFER, lBuf);
      gl.enableVertexAttribArray(lPos); gl.vertexAttribPointer(lPos, 3, gl.FLOAT, false, 20, 0);
      gl.enableVertexAttribArray(lT); gl.vertexAttribPointer(lT, 1, gl.FLOAT, false, 20, 12);
      gl.enableVertexAttribArray(lSeed); gl.vertexAttribPointer(lSeed, 1, gl.FLOAT, false, 20, 16);
      gl.drawArrays(gl.LINES, 0, g.lineData.length / 5);
      gl.disableVertexAttribArray(lPos); gl.disableVertexAttribArray(lT); gl.disableVertexAttribArray(lSeed);

      gl.useProgram(pProg); setUniforms(uP, t, rotY, rotX, scale, ox, oy, alpha);
      gl.bindBuffer(gl.ARRAY_BUFFER, pBuf);
      gl.enableVertexAttribArray(pPos); gl.vertexAttribPointer(pPos, 3, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(pSeed); gl.vertexAttribPointer(pSeed, 1, gl.FLOAT, false, 16, 12);
      gl.drawArrays(gl.POINTS, 0, g.pointData.length / 4);
      gl.disableVertexAttribArray(pPos); gl.disableVertexAttribArray(pSeed);
    }

    const start = performance.now();
    const loop = () => {
      if (disposed) return;
      if (running && visible) {
        mouse.x += (mouse.tx - mouse.x) * 0.06; mouse.y += (mouse.ty - mouse.y) * 0.06;
        draw((performance.now() - start) / 1000 + 2);
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (calm) {
      draw(4);
      window.addEventListener("scroll", () => draw(4), { passive: true });
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
      io.observe(canvas);
      const onVis = () => { running = !document.hidden; };
      document.addEventListener("visibilitychange", onVis);
      raf = requestAnimationFrame(loop);
      (canvas as HTMLCanvasElement & { _cleanup?: () => void })._cleanup = () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); window.removeEventListener("pointermove", onMove); };
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      (canvas as HTMLCanvasElement & { _cleanup?: () => void })._cleanup?.();
      gl.deleteBuffer(pBuf); gl.deleteBuffer(lBuf); gl.deleteProgram(pProg); gl.deleteProgram(lProg);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed) return <div aria-hidden className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(60%_60%_at_70%_45%,#000,transparent)]" />;
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
