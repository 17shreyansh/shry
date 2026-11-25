"use client";

import * as React from "react";

/**
 * Cinematic hero scene, drawn with one raymarched fragment shader (raw WebGL, no libraries).
 *
 * A dark, studio-lit twisting monolith with three satellites fused to it ("connected systems").
 * Lime strip-light on the left, cool key on the right; the cursor steers a moving highlight,
 * scroll dollies the camera in. Film grain + vignette for a lens feel.
 *
 * Performance:
 *  - renders at a fraction of screen resolution and upscales (CSS), adaptive to frame time
 *  - starts after first paint, pauses off-screen and when the tab is hidden
 *  - one still frame for prefers-reduced-motion; CSS glow fallback without WebGL
 */

const VS = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FS = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uShift;
uniform float uIntro;
uniform float uLift;

mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

float sdRoundBox(vec3 p, vec3 b, float r){
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}
float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float map(vec3 p){
  float t = uTime;
  p.xz *= rot(t * 0.12 + uScroll * 1.4 + uMouse.x * 0.35);
  p.yz *= rot(0.18 + uMouse.y * 0.18);
  vec3 q = p;
  q.xz *= rot(q.y * (0.95 + 0.3 * sin(t * 0.27)));
  float d = sdRoundBox(q, vec3(0.52, 1.18, 0.52), 0.16);
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float a = t * 0.42 + fi * 2.0944;
    vec3 o = vec3(cos(a) * 1.25, sin(t * 0.6 + fi * 1.9) * 0.9, sin(a) * 1.25);
    d = smin(d, length(p - o) - 0.17, 0.38);
  }
  return d * 0.72;
}

vec3 normal(vec3 p){
  const vec2 e = vec2(0.0015, -0.0015);
  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}

const vec3 LIME = vec3(0.749, 0.918, 0.353);

// Studio environment: softbox overhead, lime strip left, cool kicker right, dark floor.
vec3 env(vec3 r){
  vec3 c = vec3(0.012, 0.013, 0.016);
  c += vec3(0.95) * smoothstep(0.55, 0.92, r.y) * 0.85;
  c += LIME * pow(max(0.0, dot(r, normalize(vec3(-1.0, 0.15, 0.25)))), 7.0) * 1.9;
  c += vec3(0.9, 0.95, 1.0) * pow(max(0.0, dot(r, normalize(vec3(0.2, 0.3, -1.0)))), 6.0) * 0.9;
  c += vec3(0.55, 0.68, 1.0) * pow(max(0.0, dot(r, normalize(vec3(1.0, 0.35, -0.3)))), 12.0) * 0.7;
  vec3 m = normalize(vec3(uMouse.x * 1.6, 0.6 + uMouse.y, 1.0));
  c += vec3(1.0) * pow(max(0.0, dot(r, m)), 90.0) * 2.5;
  return c;
}

float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 suv = uv - vec2(uShift, uLift);

  float dolly = mix(8.6, 6.2, uScroll);
  vec3 ro = vec3(0.0, 0.0, dolly);
  vec3 rd = normalize(vec3(suv, -2.5));

  // background: deep graphite with a lime bloom behind the object
  float r0 = length(suv);
  vec3 col = vec3(0.022, 0.024, 0.03) * (1.0 - 0.55 * length(uv));
  col += LIME * 0.07 * exp(-r0 * 3.2);
  col += vec3(0.35, 0.45, 0.8) * 0.03 * exp(-length(suv - vec2(0.5, 0.45)) * 2.0);

  float t = 0.0, hit = 0.0;
  for (int i = 0; i < 80; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    if (d < 0.0012 * t) { hit = 1.0; break; }
    t += d;
    if (t > 14.0) break;
  }

  if (hit > 0.5) {
    vec3 p = ro + rd * t;
    vec3 n = normal(p);
    vec3 v = -rd;
    vec3 rf = reflect(rd, n);
    float fre = pow(1.0 - max(dot(n, v), 0.0), 3.5);
    float ao = clamp(map(p + n * 0.12) / 0.12 * 0.72 + 0.28, 0.0, 1.0);
    vec3 base = vec3(0.018, 0.019, 0.022);
    vec3 refl = env(rf);
    col = base + refl * (0.22 + 0.78 * fre) * ao;
    col += LIME * fre * 0.18;
  }

  // ground glow under the object
  col += LIME * 0.045 * exp(-abs(suv.y + 0.36) * 14.0) * exp(-abs(suv.x) * 4.0);

  // lens: vignette, grain, intro fade
  col *= 1.0 - 0.6 * smoothstep(0.35, 1.25, length(uv * vec2(0.85, 1.0)));
  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * 0.035;
  col = 1.0 - exp(-col * 1.5);
  col = pow(col, vec3(0.92));
  col *= uIntro;
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
  return s;
}

export function HeroScene({ className = "" }: { className?: string }) {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const gl = c.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: false });
    if (!gl) { setFailed(true); return; }
    const vs = compile(gl, gl.VERTEX_SHADER, VS), fs = compile(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { setFailed(true); return; }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setFailed(true); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("uRes"), uTime = U("uTime"), uMouse = U("uMouse"), uScroll = U("uScroll"), uShift = U("uShift"), uIntro = U("uIntro"), uLift = U("uLift");

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    let scale = small ? 0.45 : 0.62; // fraction of CSS pixels rendered
    const minScale = 0.3;

    const resize = () => {
      const w = c.clientWidth, h = c.clientHeight;
      c.width = Math.max(1, Math.round(w * scale));
      c.height = Math.max(1, Math.round(h * scale));
      gl.viewport(0, 0, c.width, c.height);
      gl.uniform2f(uRes, c.width, c.height);
      const aspect = w / Math.max(1, h);
      gl.uniform1f(uShift, aspect > 1.15 ? Math.min(0.55, 0.27 * aspect) : 0.0);
      gl.uniform1f(uLift, aspect > 1.15 ? 0.0 : 0.2);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => { mouse.tx = (e.clientX / window.innerWidth) * 2 - 1; mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1); };
    window.addEventListener("pointermove", onMove, { passive: true });

    let frozen = false, visible = true, raf = 0, start = performance.now(), last = start, slow = 0, intro = calm ? 1 : 0;
    const draw = (now: number) => {
      const dt = now - last; last = now;
      // adaptive resolution: sustained slow frames lower the render scale
      if (dt > 26) slow++; else slow = Math.max(0, slow - 1);
      if (slow > 40 && scale > minScale) { scale = Math.max(minScale, scale - 0.08); slow = 0; resize(); }
      // still too slow at the lowest resolution: hold a single beautiful frame instead of stuttering
      else if (slow > 90 && scale <= minScale) frozen = true;
      mouse.x += (mouse.tx - mouse.x) * 0.05; mouse.y += (mouse.ty - mouse.y) * 0.05;
      intro = Math.min(1, intro + dt / 1400);
      const sc = Math.min(1, Math.max(0, window.scrollY / Math.max(1, c.clientHeight)));
      gl.uniform1f(uTime, (now - start) / 1000 + 4.0);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uScroll, sc);
      gl.uniform1f(uIntro, 1 - Math.pow(1 - intro, 3));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => { draw(now); raf = visible && !document.hidden && !frozen ? requestAnimationFrame(loop) : 0; };
    const play = () => { if (!raf && !calm && !frozen && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) play(); }, { threshold: 0 });
    io.observe(c);
    const onVis = () => play();
    document.addEventListener("visibilitychange", onVis);

    // first frame after paint, so the scene never delays the headline
    const idle = window.setTimeout(() => { if (calm) draw(performance.now()); else play(); }, 60);

    return () => {
      window.clearTimeout(idle);
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div aria-hidden className={`absolute inset-0 ${className}`}>
      {/* CSS poster: visible before the first frame and when WebGL is unavailable */}
      <div className="absolute inset-0 bg-[radial-gradient(40%_50%_at_72%_45%,rgba(191,234,90,0.12),transparent_70%),radial-gradient(80%_80%_at_50%_50%,#0c0d11,#08090b)]" />
      {!failed && <canvas ref={canvas} className="absolute inset-0 h-full w-full" />}
    </div>
  );
}
