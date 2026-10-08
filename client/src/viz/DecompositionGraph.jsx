import { useEffect, useRef, useState } from "react";
import { useVisible } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";
import { Mark } from "../components/ui.jsx";

/*
 * Founder command → autonomous execution.
 * One instruction is decomposed into stages, each stage into tasks; tasks move
 * queued → running → done (a few wait for founder approval). Cells are mutated
 * directly in the DOM so hundreds of them animate without React re-renders.
 * DEMO visualization — not real workload data.
 */
const IDLE = 0, QUEUED = 1, RUNNING = 2, DONE = 3, APPROVAL = 4;

export default function DecompositionGraph({ data }) {
  const { stages, tasksPerStage: N, instruction } = data;
  const total = stages.length * N;
  const cells = useRef([]);
  const state = useRef(new Uint8Array(total));
  const [ref, visible] = useVisible("0px");
  const [typed, setTyped] = useState("");
  const [counts, setCounts] = useState({ gen: 0, run: 0, done: 0, wait: 0 });
  const [stageDone, setStageDone] = useState(() => stages.map(() => 0));
  const [hover, setHover] = useState(-1);
  const cycle = useRef(0);

  const paint = (i) => { const el = cells.current[i]; if (el) el.dataset.s = state.current[i]; };

  useEffect(() => {
    if (!visible) return;
    const S = state.current;
    const reduced = prefersReducedMotion();

    const tally = () => {
      let gen = 0, run = 0, done = 0, wait = 0;
      const per = stages.map(() => 0);
      for (let i = 0; i < total; i++) {
        const v = S[i];
        if (v) gen++;
        if (v === RUNNING) run++;
        if (v === DONE) { done++; per[Math.floor(i / N)]++; }
        if (v === APPROVAL) wait++;
      }
      setCounts({ gen, run, done, wait });
      setStageDone(per);
    };

    if (reduced) {
      for (let i = 0; i < total; i++) { S[i] = i % 41 === 7 ? APPROVAL : DONE; paint(i); }
      setTyped(instruction); tally();
      return;
    }

    let t = 0, raf = 0, last = performance.now(), acc = 0, tallyAcc = 0;
    const reset = () => {
      S.fill(IDLE); for (let i = 0; i < total; i++) paint(i);
      t = 0; setTyped(""); cycle.current++;
    };
    reset();

    const step = (dt) => {
      t += dt;
      // 1) the founder types one instruction
      const chars = Math.min(instruction.length, Math.floor(t / 0.05));
      setTyped((p) => (p.length === chars ? p : instruction.slice(0, chars)));
      const t0 = instruction.length * 0.05 + 0.4;
      if (t < t0) return;
      const tt = t - t0;
      // 2) decomposition: each stage's tasks are generated as a wave
      stages.forEach((_, s) => {
        const start = s * 0.16, k = Math.floor(Math.max(0, Math.min(1, (tt - start) / 0.9)) * N);
        for (let j = 0; j < k; j++) { const i = s * N + j; if (S[i] === IDLE) { S[i] = QUEUED; paint(i); } }
      });
      // 3) execution: stages unlock in sequence, tasks run in parallel
      const unlocked = Math.min(stages.length, Math.floor((tt - 1.0) / 0.4) + 1);
      for (let n = 0; n < 26; n++) {
        const s = Math.floor(Math.random() * Math.max(0, unlocked));
        const i = s * N + Math.floor(Math.random() * N);
        if (S[i] === QUEUED) { S[i] = Math.random() < 0.025 ? APPROVAL : RUNNING; paint(i); }
      }
      for (let n = 0; n < 60; n++) {
        const i = Math.floor(Math.random() * total);
        if (S[i] === RUNNING && Math.random() < 0.35) { S[i] = DONE; paint(i); }
      }
      // 4) hold the finished state, then run again
      let open = 0;
      for (let i = 0; i < total; i++) if (S[i] === QUEUED || S[i] === RUNNING) open++;
      if (tt > 3 && open === 0) { if (!step.hold) step.hold = t; if (t - step.hold > 3.5) { step.hold = 0; reset(); } }
    };

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      acc += dt; tallyAcc += dt;
      if (acc > 0.05) { step(acc); acc = 0; }
      if (tallyAcc > 0.25) { tally(); tallyAcc = 0; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [visible, stages, total, N, instruction]);

  return (
    <div ref={ref} className="xm">
      <div className="xm__left">
        <div className="xm__cmd">
          <span className="xm__k">Founder command</span>
          <div className="xm__input"><span className="xm__prompt">›</span><span>{typed}</span><span className="caret" aria-hidden="true" /></div>
        </div>
        <div className="xm__wire" aria-hidden="true" />
        <div className="xm__core">
          <Mark size={22} />
          <div><strong>Realy Intelligence Core</strong><span>Objective → plan → tasks → execution</span></div>
        </div>
        <dl className="xm__counts">
          <div><dt>Tasks generated</dt><dd className="tnum">{counts.gen}</dd></div>
          <div><dt>Running now</dt><dd className="tnum">{counts.run}</dd></div>
          <div><dt>Completed</dt><dd className="tnum">{counts.done}</dd></div>
          <div className="is-wait"><dt>Awaiting approval</dt><dd className="tnum">{counts.wait}</dd></div>
        </dl>
      </div>

      <div className="xm__grid" role="img" aria-label={`${instruction} decomposed into ${stages.length} stages and ${total} tasks executing in parallel`}>
        {stages.map((st, s) => (
          <div
            key={st.name}
            className={`xm__row ${hover === s ? "is-hover" : ""}`}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(-1)}
          >
            <div className="xm__stage">
              <span className="xm__idx">{String(s + 1).padStart(2, "0")}</span>
              <strong>{st.name}</strong>
              <span className="xm__pct tnum">{Math.round((stageDone[s] / N) * 100)}%</span>
            </div>
            <div className="xm__cells">
              {Array.from({ length: N }, (_, j) => (
                <i key={j} ref={(el) => (cells.current[s * N + j] = el)} data-s="0" />
              ))}
            </div>
            <div className="xm__tasks">{st.tasks.join(" · ")}</div>
          </div>
        ))}
        <div className="xm__legend">
          <span><i data-s="1" />Queued</span><span><i data-s="2" />Running</span><span><i data-s="3" />Done</span><span><i data-s="4" />Needs approval</span>
        </div>
      </div>
    </div>
  );
}
