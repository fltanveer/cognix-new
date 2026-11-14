"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import "./inspect-demo.css";

/**
 * Auto Inspect, the recorded run, as the agent sees it: one phone, four guided photos, each uploaded as
 * it's taken, then quality check, damage detection and a signed-off report. A pipeline rail beside the
 * phone tracks the same five stages. Playback is compressed; the clock shows the recorded 1 min 47 s.
 * Loops while on screen (pauses offscreen). The server markup is the finished run, so no-JS and reduced
 * motion show the end state.
 */
const RUN_S = 107;
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const VIEWS = ["Front", "Driver side", "Rear", "Passenger side"];
const FINDINGS = [
  { view: 1, part: "Front bumper", kind: "Dent", sev: "Moderate", conf: "94%", box: { left: "41%", top: "57%", width: "17%", height: "13%" } },
  { view: 2, part: "Rear door", kind: "Scratch", sev: "Minor", conf: "88%", box: { left: "49%", top: "40%", width: "17%", height: "13%" } },
  { view: 3, part: "Tail light", kind: "Crack", sev: "Minor", conf: "81%", box: { left: "55%", top: "44%", width: "16%", height: "11%" } },
];
const STEPS = [
  { name: "Guided capture", note: "4 photos, one phone" },
  { name: "Upload", note: "Sent as each photo is taken" },
  { name: "Quality check", note: "Sharp, well lit, in frame" },
  { name: "Damage detection", note: "3 findings, boxed" },
  { name: "Report", note: "6 pages, signed off" },
];
const img = (v: number) => `/img/inspect/view-${v}.webp`;

export function InspectDemo() {
  const root = useRef<HTMLElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [done, setDone] = useState(true);

  useGSAP(
    () => {
      const el = root.current!;
      if (prefersReducedMotion()) return; // server markup already shows the finished run
      const q = (s: string) => Array.from(el.querySelectorAll<HTMLElement>(s));
      const one = (s: string) => el.querySelector<HTMLElement>(s)!;
      const flag = (els: HTMLElement[], v: boolean, attr = "data-on") => els.forEach((e) => (v ? e.setAttribute(attr, "") : e.removeAttribute(attr)));
      const scene = (name: string) => {
        const order = ["capture", "upload", "analysis", "report"];
        q(".idm-scene").forEach((s) => {
          const d = order.indexOf(s.dataset.scene!) - order.indexOf(name);
          s.dataset.state = d === 0 ? "now" : d < 0 ? "past" : "next";
        });
      };
      const step = (i: number, state: "wait" | "now" | "done") => (q(".idm-step")[i].dataset.state = state);
      const nth = (s: string, i: number) => q(s).filter((e) => e.dataset.i === String(i));

      const reset = () => {
        scene("capture");
        STEPS.forEach((_, i) => step(i, "wait"));
        ["[data-i]", ".idm-qc", ".idm-stamp", ".idm-flash"].forEach((s) => q(`.idm ${s}`).forEach((e) => e.removeAttribute("data-on")));
        q(".idm-up").forEach((e) => e.removeAttribute("data-done"));
        q(".idm-dot").forEach((e) => e.removeAttribute("data-now"));
        flag(nth(".idm-vf-img", 1), true);
        flag(nth(".idm-title", 0), true);
        if (clock.current) clock.current.textContent = fmt(0);
        setDone(false);
      };

      const run = gsap.timeline({ paused: true, onStart: reset });
      const t = { s: 0 };
      run.fromTo(t, { s: 0 }, { s: RUN_S, duration: 9, ease: "none", onUpdate: () => clock.current && (clock.current.textContent = fmt(t.s)) }, 0);

      // 1. Guided capture: four views, one phone. Each photo starts uploading as soon as it's taken.
      run.call(() => step(0, "now"), [], 0.1);
      VIEWS.forEach((_, i) => {
        const at = 0.35 + i * 0.85;
        run.call(() => {
          q(".idm-title").forEach((e) => e.removeAttribute("data-on"));
          flag(nth(".idm-title", i), true);
          q(".idm-vf-img").forEach((e) => e.removeAttribute("data-on"));
          flag(nth(".idm-vf-img", i + 1), true);
          flag(nth(".idm-dot", i), true, "data-now");
        }, [], at);
        run.call(() => {
          const f = one(".idm-flash");
          f.removeAttribute("data-on");
          void f.offsetWidth; // restart the flash
          f.setAttribute("data-on", "");
          flag(nth(".idm-dot", i), true);
          flag(nth(".idm-thumb", i), true);
          if (i === 0) step(1, "now");
        }, [], at + 0.5);
      });
      // 2. Upload: the batch view; bars run, each tile ticks
      run.call(() => { step(0, "done"); scene("upload"); }, [], 3.85);
      [0, 1, 2, 3].forEach((i) => run.call(() => flag(nth(".idm-up", i), true), [], 3.95 + i * 0.12));
      [0, 1, 2, 3].forEach((i) => run.call(() => nth(".idm-up", i).forEach((e) => e.setAttribute("data-done", "")), [], 4.75 + i * 0.12));
      // 3. Quality check
      run.call(() => { step(1, "done"); step(2, "now"); flag(q(".idm-qc"), true); }, [], 5.25);
      // 4. Damage detection: three findings, each boxed on its photo
      run.call(() => { step(2, "done"); step(3, "now"); scene("analysis"); }, [], 5.8);
      FINDINGS.forEach((f, i) => {
        run.call(() => {
          q(".idm-an-img").forEach((e) => e.removeAttribute("data-on"));
          flag(nth(".idm-an-img", f.view), true);
          q(".idm-box").forEach((e) => e.removeAttribute("data-on"));
          flag(nth(".idm-box", i), true);
          flag(nth(".idm-find", i), true);
        }, [], 6.0 + i * 0.7);
      });
      // 5. Report: six pages, signed off
      run.call(() => { step(3, "done"); step(4, "now"); scene("report"); }, [], 8.2);
      run.call(() => flag(q(".idm-stamp"), true), [], 8.75);
      run.call(() => step(4, "done"), [], 9);
      tl.current = run;

      // Plays when it comes into view, holds on the report, then runs again while it stays on screen.
      // Scrolling away pauses it; coming back resumes.
      let visible = false;
      const again = gsap.delayedCall(3.5, () => visible && run.play(0)).pause();
      run.eventCallback("onComplete", () => {
        setDone(true);
        if (visible) again.restart(true);
      });
      const show = () => {
        visible = true;
        if (run.progress() === 0) run.play(0);
        else if (run.progress() === 1) again.restart(true);
        else run.resume();
      };
      const hide = () => {
        visible = false;
        run.pause();
        again.pause();
      };
      reset();
      const st = ScrollTrigger.create({ trigger: el, start: "top 75%", end: "bottom 15%", onEnter: show, onEnterBack: show, onLeave: hide, onLeaveBack: hide });
      return () => {
        st.kill();
        again.kill();
        run.kill();
      };
    },
    { scope: root }
  );

  return (
    <figure ref={root} className="idm" aria-label="Auto Inspect recorded run: four guided photos on one phone, uploaded, checked, three damage findings, and a signed-off six-page report in 1 minute 47 seconds.">
      <div className="flex items-center justify-between gap-4 text-[13px]">
        <span className="flex items-center gap-2 text-[var(--ink-3)]">
          <span className={`h-1.5 w-1.5 rounded-full ${done ? "bg-[var(--accent)]" : "bg-[var(--ink-3)]"}`} />
          Fig 2 · Auto Inspect, recorded run
        </span>
        <span className="flex items-center gap-3">
          <span ref={clock} className="tnum font-mono text-[15px] text-[var(--ink)]" aria-label="Recorded run time">
            {fmt(RUN_S)}
          </span>
          <button type="button" onClick={() => tl.current?.play(0)} className="btn btn-ghost btn-sm" disabled={!done}>
            Replay
          </button>
        </span>
      </div>

      <div className="idm-stage" aria-hidden="true">
        <span className="idm-glow" />

        {/* ---------- the phone ---------- */}
        <div className="idm-phone">
          <div className="idm-screen">
            <div className="idm-status">
              <span>9:41</span>
              <span className="idm-island" />
              <span className="idm-batt" />
            </div>
            <div className="idm-appbar">
              <span className="idm-back">‹</span>
              <span className="min-w-0 flex-1">
                <b>Claim #4821</b>
                <em>Auto Inspect</em>
              </span>
              <span className="idm-pill">SUV</span>
            </div>

            {/* Scene 1: guided capture */}
            <section className="idm-scene" data-scene="capture" data-state="past">
              <div className="idm-titles">
                {VIEWS.map((v, i) => (
                  <span key={v} className="idm-title" data-i={i}>
                    {v} <i>· {i + 1} of 4</i>
                  </span>
                ))}
              </div>
              <div className="idm-vf">
                {[1, 2, 3, 4].map((v) => (
                  <Image key={v} src={img(v)} alt="" fill sizes="280px" className="idm-vf-img" data-i={v} />
                ))}
                <span className="idm-brackets" />
                <span className="idm-thirds" />
                <span className="idm-hint">Fit the whole car in the frame</span>
                <span className="idm-flash" />
              </div>
              <div className="idm-dots">
                {VIEWS.map((v, i) => (
                  <span key={v} className="idm-dot" data-i={i} />
                ))}
              </div>
              <div className="idm-strip">
                {[1, 2, 3, 4].map((v, i) => (
                  <span key={v} className="idm-thumb" data-i={i}>
                    <Image src={img(v)} alt="" fill sizes="60px" />
                  </span>
                ))}
              </div>
              <div className="idm-shutter">
                <span />
              </div>
            </section>

            {/* Scene 2: upload + quality check */}
            <section className="idm-scene" data-scene="upload" data-state="past">
              <div className="idm-h">Uploading 4 photos</div>
              <div className="idm-grid">
                {[1, 2, 3, 4].map((v, i) => (
                  <span key={v} className="idm-up" data-i={i} data-on="" data-done="">
                    <Image src={img(v)} alt="" fill sizes="120px" />
                    <span className="idm-bar">
                      <span />
                    </span>
                    <span className="idm-tick">✓</span>
                  </span>
                ))}
              </div>
              <div className="idm-row">
                <svg className="idm-lock" viewBox="0 0 24 24">
                  <path d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3" />
                </svg>
                Encrypted upload
              </div>
              <div className="idm-qc" data-on="">
                <span className="idm-ok">✓</span>
                <span>
                  <b>Quality check passed</b>
                  <em>Sharp, well lit, whole car in frame</em>
                </span>
              </div>
            </section>

            {/* Scene 3: damage detection */}
            <section className="idm-scene" data-scene="analysis" data-state="past">
              <div className="idm-h">Damage detection</div>
              <div className="idm-an">
                {[1, 2, 3].map((v) => (
                  <Image key={v} src={img(v)} alt="" fill sizes="280px" className="idm-an-img" data-i={v} />
                ))}
                {FINDINGS.map((f, i) => (
                  <span key={f.part} className="idm-box" data-i={i} style={f.box}>
                    <i>
                      {f.kind} · {f.conf}
                    </i>
                  </span>
                ))}
                <span className="idm-scan" />
              </div>
              <ul className="idm-finds">
                {FINDINGS.map((f, i) => (
                  <li key={f.part} className="idm-find" data-i={i} data-on="">
                    <span className="idm-fdot" />
                    <span className="min-w-0 flex-1">
                      <b>{f.kind}</b> · {f.part}
                    </span>
                    <span className={`idm-sev ${f.sev === "Moderate" ? "is-mod" : ""}`}>{f.sev}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Scene 4: the report */}
            <section className="idm-scene" data-scene="report" data-state="now">
              <div className="idm-h">Report ready</div>
              <div className="idm-report">
                <div className="idm-doc">
                  <span className="idm-pages">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="min-w-0 flex-1">
                    <b>Inspection report</b>
                    <em>PDF · 6 pages · time-stamped</em>
                  </span>
                </div>
                <div className="idm-thumbs3">
                  {[1, 2, 3].map((v) => (
                    <span key={v}>
                      <Image src={img(v)} alt="" fill sizes="80px" />
                    </span>
                  ))}
                </div>
                <dl className="idm-kv">
                  <div>
                    <dt>Photos</dt>
                    <dd>4</dd>
                  </div>
                  <div>
                    <dt>Findings</dt>
                    <dd>3</dd>
                  </div>
                  <div>
                    <dt>Time</dt>
                    <dd>1:47</dd>
                  </div>
                </dl>
                <ul className="idm-rfinds">
                  {FINDINGS.map((f) => (
                    <li key={f.part}>
                      <span className="idm-fdot" />
                      <span className="min-w-0 flex-1">
                        {f.kind} · {f.part}
                      </span>
                      <span className={`idm-sev ${f.sev === "Moderate" ? "is-mod" : ""}`}>{f.sev}</span>
                    </li>
                  ))}
                </ul>
                <span className="idm-stamp" data-on="">
                  <span>✓</span> Signed off
                </span>
              </div>
              <div className="idm-actions">
                <span>View</span>
                <span className="is-lime">Share PDF</span>
              </div>
            </section>
          </div>
        </div>

        {/* ---------- the pipeline rail ---------- */}
        <ol className="idm-rail">
          {STEPS.map((s) => (
            <li key={s.name} className="idm-step" data-state="done">
              <span className="idm-node" />
              <span>
                <b>{s.name}</b>
                <em>{s.note}</em>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <figcaption className="mt-2 text-[13px] text-[var(--ink-3)]">
        Totals from a recorded run: 4 photos on one phone, 3 findings, a 6-page report in 1 min 47 s. Car photos are illustrative; playback
        compressed.
      </figcaption>
    </figure>
  );
}
