"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const GLYPHS = "0123456789#%+/<>";

/**
 * Reveals a value when scrolled into view without ever changing its size.
 * The final text is server-rendered and stays in the layout (invisible while the effect runs),
 * so the box is measured once and nothing around it reflows. The effect plays on a clipped
 * overlay: numbers decode from noise; values that are mostly words wipe in instead,
 * because scrambled letters read as a bug.
 */
export function Scramble({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const root = useRef<HTMLSpanElement>(null);
  const layer = useRef<HTMLSpanElement>(null);
  const letters = (text.match(/[a-z]/gi) ?? []).length;
  const wordy = letters / Math.max(1, text.replace(/\s/g, "").length) > 0.5;

  useGSAP(() => {
    const el = root.current;
    const fx = layer.current;
    if (!el || !fx || prefersReducedMotion()) return;
    const st = { trigger: el, start: "top 90%", once: true };
    // the overlay takes over from the start (no visible flash before the trigger); without JS or
    // with reduced motion this never runs and the plain final text shows
    el.setAttribute("data-fx", "");
    if (wordy) gsap.set(fx, { clipPath: "inset(0 100% 0 0)" });
    const show = () => el.setAttribute("data-fx", "");
    const done = () => {
      el.removeAttribute("data-fx");
      el.removeAttribute("aria-busy");
    };

    if (wordy) {
      gsap.to(
        fx,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1,
          delay,
          ease: "expo.out",
          scrollTrigger: st,
          onStart: () => {
            show();
            el.setAttribute("aria-busy", "true");
          },
          onComplete: done,
        }
      );
      return;
    }

    const state = { p: 0 };
    gsap.to(state, {
      p: 1,
      duration: 1.1,
      delay,
      ease: "power2.out",
      scrollTrigger: st,
      onStart: () => {
        show();
        el.setAttribute("aria-busy", "true");
      },
      onUpdate: () => {
        const n = Math.floor(state.p * text.length);
        let out = text.slice(0, n);
        // only digits are scrambled; letters, spaces and punctuation hold their place
        for (let i = n; i < text.length; i++) out += /\d/.test(text[i]) ? GLYPHS[(Math.random() * 10) | 0] : text[i];
        fx.textContent = out;
      },
      onComplete: () => {
        fx.textContent = text;
        done();
      },
    });
  });

  return (
    <span ref={root} className={`scramble ${className ?? ""}`}>
      <span className="scramble__final">{text}</span>
      <span ref={layer} className="scramble__fx" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
