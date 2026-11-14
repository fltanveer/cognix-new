"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const vert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const frag = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uIntro;
uniform float uScroll;
uniform float uPointer;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform vec3 uBg;
uniform vec3 uInk;
uniform vec3 uAccent;
varying vec2 vUv;

float hash(float n) { return fract(sin(n) * 43758.5453123); }
float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash2(i), hash2(i + vec2(1.0, 0.0)), u.x),
             mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // order: 0 = tangled, 1 = straight lanes
  float order = clamp(0.1 + 0.22 * uIntro + 0.68 * uScroll, 0.0, 1.0);
  float chaos = 1.0 - order;

  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float d = distance(p, m);
  float pull = exp(-d * d * 14.0) * uPointer;

  float t = uTime * 0.05;
  float warp = (fbm(vec2(p.x * 1.4 + t, p.y * 1.1 - t * 0.6)) - 0.5) * 1.2 * chaos
             + (fbm(vec2(p.x * 3.2 - t * 1.4, p.y * 2.2 + t)) - 0.5) * 0.32 * chaos
             + sin(p.x * 10.0 - uTime * 1.6) * 0.035 * pull
             + (fbm(p * 6.0 + uTime * 0.3) - 0.5) * 0.08 * pull;

  float N = 30.0;
  float lane = (uv.y + warp) * N;
  float id = floor(lane);
  float f = fract(lane) - 0.5;
  float w = fwidth(lane);
  float line = 1.0 - smoothstep(0.0, w * 1.4, abs(f));

  float depth = 0.07 + 0.22 * hash(id * 1.7);

  // Fade near the top/bottom edges and under the headline (bottom-left).
  float edge = smoothstep(0.0, 0.18, uv.y) * smoothstep(1.0, 0.82, uv.y);
  // Quiet zone behind the copy (left two-thirds, lower 80%), full strength top-right.
  float copyMask = mix(0.32, 1.0, smoothstep(0.35, 0.95, uv.x * 0.9 + uv.y * 0.55));
  float mask = edge * copyMask;

  vec3 col = uBg + uInk * line * depth * mask;

  // Live lanes: a few carry a traveling lime pulse once the field is ordered.
  float live = step(0.83, hash(id * 3.13 + 1.0));
  float speed = 0.07 + 0.08 * hash(id * 5.7);
  float px = fract(uv.x * 0.55 - uTime * speed + hash(id * 9.1));
  float tail = pow(px, 9.0) * (1.0 - smoothstep(0.985, 1.0, px));
  float lit = live * tail * smoothstep(0.45, 0.95, order);
  float glow = exp(-abs(f) * 9.0) * 0.35;
  col += uAccent * (line + glow) * lit * mask * 1.25;

  gl_FragColor = vec4(col, 1.0);
}
`;

type Props = { triggerRef: React.RefObject<HTMLElement | null>; className?: string };

/**
 * Hero signal field. One responsibility: dramatize "disconnected → connected".
 * DPR capped, paused offscreen and when hidden, static poster under reduced motion or WebGL failure.
 */
export function SignalField({ triggerRef, className }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setFallback(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch {
      setFallback(true);
      return;
    }
    THREE.ColorManagement.enabled = false;
    const css = getComputedStyle(document.documentElement);
    const col = (v: string, fb: string) => new THREE.Color(css.getPropertyValue(v).trim() || fb);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.7, 0.6) },
      uBg: { value: col("--canvas", "#10120d") },
      uInk: { value: new THREE.Color("#e9ede3") },
      uAccent: { value: col("--accent", "#c9f31d") },
    };
    const material = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      uniforms.uRes.value.set(width, height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Pointer: throttled to a target, eased in the frame loop.
    const target = new THREE.Vector2(0.7, 0.6);
    let pointerEnergy = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
      pointerEnergy = 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Intro + scroll-driven order.
    const intro = gsap.to(uniforms.uIntro, { value: 1, duration: 2.6, ease: "power2.inOut", delay: 0.2 });
    const st = ScrollTrigger.create({
      trigger: triggerRef.current ?? el,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => (uniforms.uScroll.value = self.progress),
    });

    let visible = true;
    let raf = 0;
    let last = performance.now();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !document.hidden) loop();
    });
    io.observe(el);
    const onVis = () => {
      if (!document.hidden && visible && !raf) loop();
    };
    document.addEventListener("visibilitychange", onVis);

    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      setFallback(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost);

    function loop() {
      if (!visible || document.hidden) {
        raf = 0;
        return;
      }
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      uniforms.uTime.value += dt;
      uniforms.uMouse.value.lerp(target, 0.06);
      pointerEnergy *= 0.985;
      uniforms.uPointer.value += (pointerEnergy - uniforms.uPointer.value) * 0.08;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(raf);
      intro.kill();
      st.kill();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [triggerRef]);

  return (
    <div ref={host} className={className} aria-hidden="true">
      {fallback && (
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, transparent 0 calc(100%/30 - 1px), color-mix(in srgb, var(--ink) 22%, transparent) calc(100%/30 - 1px) calc(100%/30))",
            maskImage: "radial-gradient(ellipse 80% 70% at 75% 45%, black 30%, transparent 80%)",
          }}
        />
      )}
    </div>
  );
}
