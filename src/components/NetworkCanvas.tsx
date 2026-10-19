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
uniform float uTime;
uniform float uAspect;
uniform float uScale;
uniform float uRotY;
uniform float uRotX;
uniform float uPx;
uniform vec2 uMouse;
uniform vec2 uOffset;

vec4 place(vec3 p, float seed, out float depth) {
  p *= 1.0 + 0.018 * sin(uTime * 0.7 + seed * 40.0);
  float cy = cos(uRotY), sy = sin(uRotY);
  float cx = cos(uRotX), sx = sin(uRotX);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  p *= uScale;
  depth = clamp(p.z * 0.5 + 0.5, 0.0, 1.0);
  
  float z = max(0.2, 3.4 - p.z);
  vec2 ndc = (p.xy * 1.9) / z;
  ndc.x /= max(0.001, uAspect);
  ndc += uOffset;
  
  // Aspect-corrected cursor repulsion in screen space
  vec2 d = ndc - uMouse;
  d.x *= uAspect;
  float dist = length(d);
  vec2 pushDir = d / max(dist, 1e-4);
  float pushAmt = 0.12 * exp(-dist * 4.2);
  ndc += pushDir * pushAmt * vec2(1.0 / max(0.001, uAspect), 1.0);
  
  return vec4(ndc, 0.0, 1.0);
}
`;

const POINT_VS = `${COMMON}
attribute vec3 aPos;
attribute float aSeed;
varying float vDepth;
varying float vSeed;

void main() {
  float depth;
  gl_Position = place(aPos, aSeed, depth);
  vDepth = depth;
  vSeed = aSeed;
  gl_PointSize = (2.8 + 4.2 * depth + step(0.9, aSeed) * 4.5) * uPx;
}
`;

const POINT_FS = `
precision highp float;
uniform float uAlpha;
varying float vDepth;
varying float vSeed;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.08, d);
  vec3 lime = vec3(0.749, 0.918, 0.353);
  vec3 base = vec3(0.96, 0.96, 0.94);
  vec3 col = vSeed > 0.9 ? lime : base;
  float k = vSeed > 0.9 ? 1.0 : (0.35 + 0.65 * vDepth);
  gl_FragColor = vec4(col, a * k * uAlpha);
}
`;

const LINE_VS = `${COMMON}
attribute vec3 aPos;
attribute float aT;
attribute float aSeed;
varying float vDepth;
varying float vT;
varying float vSeed;

void main() {
  float depth;
  gl_Position = place(aPos, aSeed, depth);
  vDepth = depth;
  vT = aT;
  vSeed = aSeed;
}
`;

const LINE_FS = `
precision highp float;
uniform float uTime;
uniform float uAlpha;
varying float vDepth;
varying float vT;
varying float vSeed;

void main() {
  float speed = 0.12 + 0.16 * fract(vSeed * 13.0);
  float head = fract(uTime * speed + vSeed * 7.0);
  float dd = abs(vT - head);
  float pulse = smoothstep(0.18, 0.0, dd) * step(0.42, fract(vSeed * 5.0));
  vec3 lime = vec3(0.749, 0.918, 0.353);
  vec3 base = vec3(0.96, 0.96, 0.94);
  float baseAlpha = (0.14 + 0.32 * vDepth) * uAlpha;
  vec3 col = mix(base, lime, pulse);
  float finalAlpha = min(1.0, baseAlpha + pulse * 0.85 * uAlpha);
  gl_FragColor = vec4(col, finalAlpha);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create WebGL shader");
  // Strip any accidental non-breaking spaces before compiling
  gl.shaderSource(shader, src.replace(/\u00A0/g, " "));
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log ?? "Shader compile error");
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram {
  const prog = gl.createProgram();
  if (!prog) throw new Error("Unable to create WebGL program");
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  // Shaders can be flagged for deletion immediately after linking
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error(log ?? "Program link error");
  }
  return prog;
}

function buildGraph(count: number) {
  const pts: [number, number, number][] = [];
  const outer = Math.round(count * 0.82);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < outer; i++) {
    const y = 1 - (i / Math.max(1, outer - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    const k = 0.94 + Math.random() * 0.14;
    pts.push([Math.cos(th) * r * k, y * k, Math.sin(th) * r * k]);
  }

  for (let i = outer; i < count; i++) {
    const u = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const rr = 0.2 + Math.random() * 0.6;
    const s = Math.sqrt(Math.max(0, 1 - u * u));
    pts.push([Math.cos(th) * s * rr, u * rr, Math.sin(th) * s * rr]);
  }

  const seeds = pts.map(() => Math.random());
  const edges = new Set<string>();
  const lineData: number[] = [];

  pts.forEach((a, i) => {
    const near = pts
      .map((b, j) => ({
        j,
        d: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2,
      }))
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

  const pointData = new Float32Array(
    pts.flatMap((p, i) => [p[0], p[1], p[2], seeds[i]])
  );

  return {
    pointData,
    lineData: new Float32Array(lineData),
    nodes: pts.length,
    links: edges.size,
  };
}

export interface NetworkCanvasProps {
  onStats?: (s: { nodes: number; links: number }) => void;
  className?: string;
}

export function NetworkCanvas({ onStats, className = "" }: NetworkCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const onStatsRef = React.useRef(onStats);
  onStatsRef.current = onStats;

  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", {
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl || gl.isContextLost()) {
      setFailed(true);
      return;
    }

    let pProg: WebGLProgram;
    let lProg: WebGLProgram;
    try {
      pProg = createProgram(gl, POINT_VS, POINT_FS);
      lProg = createProgram(gl, LINE_VS, LINE_FS);
    } catch (err) {
      console.error("WebGL Shader Error:", err);
      setFailed(true);
      return;
    }

    const isSmallScreen = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const graph = buildGraph(isSmallScreen ? 150 : 260);
    onStatsRef.current?.({ nodes: graph.nodes, links: graph.links });

    const pBuf = gl.createBuffer();
    const lBuf = gl.createBuffer();
    if (!pBuf || !lBuf) {
      setFailed(true);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, pBuf);
    gl.bufferData(gl.ARRAY_BUFFER, graph.pointData, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, lBuf);
    gl.bufferData(gl.ARRAY_BUFFER, graph.lineData, gl.STATIC_DRAW);

    const getUniforms = (prog: WebGLProgram) => ({
      time: gl.getUniformLocation(prog, "uTime"),
      aspect: gl.getUniformLocation(prog, "uAspect"),
      scale: gl.getUniformLocation(prog, "uScale"),
      rotY: gl.getUniformLocation(prog, "uRotY"),
      rotX: gl.getUniformLocation(prog, "uRotX"),
      px: gl.getUniformLocation(prog, "uPx"),
      mouse: gl.getUniformLocation(prog, "uMouse"),
      offset: gl.getUniformLocation(prog, "uOffset"),
      alpha: gl.getUniformLocation(prog, "uAlpha"),
    });

    const uP = getUniforms(pProg);
    const uL = getUniforms(lProg);

    const pPos = gl.getAttribLocation(pProg, "aPos");
    const pSeed = gl.getAttribLocation(pProg, "aSeed");
    const lPos = gl.getAttribLocation(lProg, "aPos");
    const lT = gl.getAttribLocation(lProg, "aT");
    const lSeed = gl.getAttribLocation(lProg, "aSeed");

    // Start mouse far off-screen so initial state isn't pushed
    const mouse = { x: 10, y: 10, tx: 10, ty: 10, active: false };
    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let running = !document.hidden;
    let visible = true;
    let disposed = false;

    const applyUniforms = (
      u: ReturnType<typeof getUniforms>,
      t: number,
      rotY: number,
      rotX: number,
      scale: number,
      ox: number,
      oy: number,
      alpha: number
    ) => {
      gl.uniform1f(u.time, t);
      gl.uniform1f(u.aspect, width / height);
      gl.uniform1f(u.scale, scale);
      gl.uniform1f(u.rotY, rotY);
      gl.uniform1f(u.rotX, rotX);
      gl.uniform1f(u.px, dpr);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform2f(u.offset, ox, oy);
      gl.uniform1f(u.alpha, alpha);
    };

    const draw = (t: number) => {
      if (disposed || width <= 0 || height <= 0) return;

      const aspect = width / height;
      const wide = aspect > 1.15;
      const scrollProg = Math.min(
        1,
        Math.max(0, window.scrollY / Math.max(1, window.innerHeight))
      );

      const baseScale = wide ? 1.12 : Math.min(1.05, aspect * 2.1);
      const scale = baseScale * (1 + scrollProg * 0.35);
      const ox = wide ? 0.4 * (1 - scrollProg) : 0;
      const oy = wide ? 0.02 : 0.25;
      const alpha = (wide ? 1 : 0.85) * Math.max(0, 1 - scrollProg * 0.85);

      const tiltX = mouse.active ? mouse.x : 0;
      const tiltY = mouse.active ? mouse.y : 0;
      const rotY = t * 0.09 + tiltX * 0.45;
      const rotX = 0.38 + tiltY * 0.25 + scrollProg * 0.4;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // 1. Draw Links
      gl.useProgram(lProg);
      applyUniforms(uL, t, rotY, rotX, scale, ox, oy, alpha);
      gl.bindBuffer(gl.ARRAY_BUFFER, lBuf);
      if (lPos >= 0) {
        gl.enableVertexAttribArray(lPos);
        gl.vertexAttribPointer(lPos, 3, gl.FLOAT, false, 20, 0);
      }
      if (lT >= 0) {
        gl.enableVertexAttribArray(lT);
        gl.vertexAttribPointer(lT, 1, gl.FLOAT, false, 20, 12);
      }
      if (lSeed >= 0) {
        gl.enableVertexAttribArray(lSeed);
        gl.vertexAttribPointer(lSeed, 1, gl.FLOAT, false, 20, 16);
      }
      gl.drawArrays(gl.LINES, 0, graph.lineData.length / 5);
      if (lPos >= 0) gl.disableVertexAttribArray(lPos);
      if (lT >= 0) gl.disableVertexAttribArray(lT);
      if (lSeed >= 0) gl.disableVertexAttribArray(lSeed);

      // 2. Draw Nodes
      gl.useProgram(pProg);
      applyUniforms(uP, t, rotY, rotX, scale, ox, oy, alpha);
      gl.bindBuffer(gl.ARRAY_BUFFER, pBuf);
      if (pPos >= 0) {
        gl.enableVertexAttribArray(pPos);
        gl.vertexAttribPointer(pPos, 3, gl.FLOAT, false, 16, 0);
      }
      if (pSeed >= 0) {
        gl.enableVertexAttribArray(pSeed);
        gl.vertexAttribPointer(pSeed, 1, gl.FLOAT, false, 16, 12);
      }
      gl.drawArrays(gl.POINTS, 0, graph.pointData.length / 4);
      if (pPos >= 0) gl.disableVertexAttribArray(pPos);
      if (pSeed >= 0) gl.disableVertexAttribArray(pSeed);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width || canvas.clientWidth || window.innerWidth);
      height = Math.max(1, rect.height || canvas.clientHeight || window.innerHeight);
      dpr = Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.5 : 2.0);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      if (prefersReducedMotion) draw(4);
    };

    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      if (!mouse.active) {
        mouse.x = nx;
        mouse.y = ny;
        mouse.active = true;
      }
      mouse.tx = nx;
      mouse.ty = ny;
    };

    const onPointerLeave = () => {
      mouse.tx = 10;
      mouse.ty = 10;
      mouse.active = false;
    };

    const onScrollStatic = () => draw(4);
    const onVisibilityChange = () => {
      running = !document.hidden;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let io: IntersectionObserver | null = null;
    const startTime = performance.now();

    const loop = (now: number) => {
      if (disposed) return;
      if (running && visible) {
        mouse.x += (mouse.tx - mouse.x) * 0.08;
        mouse.y += (mouse.ty - mouse.y) * 0.08;
        draw((now - startTime) / 1000 + 2);
      }
      raf = requestAnimationFrame(loop);
    };

    if (prefersReducedMotion) {
      draw(4);
      window.addEventListener("scroll", onScrollStatic, { passive: true });
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
      document.addEventListener("visibilitychange", onVisibilityChange);

      io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { threshold: 0 }
      );
      io.observe(canvas);

      raf = requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      window.removeEventListener("scroll", onScrollStatic);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      gl.deleteBuffer(pBuf);
      gl.deleteBuffer(lBuf);
      gl.deleteProgram(pProg);
      gl.deleteProgram(lProg);
    };
  }, []);

  if (failed) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(60%_60%_at_70%_45%,#000,transparent)] ${className}`}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 block h-full w-full ${className}`}
    />
  );
}