import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal, Tick } from "./ui.jsx";
import { useInView } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";

const idle = (n) => Array.from({ length: n }, () => ({ state: "", text: "Idle" }));

function Card({ role, node, ceo }) {
  return (
    <div className={`oc ${ceo ? "oc--ceo" : ""} ${node.state}`}>
      <div className="oc__top"><span className="oc__role">{role}</span><span className="oc__dot" /></div>
      <div className="oc__task">{node.text}</div>
    </div>
  );
}

function Link({ n, hot }) {
  return (
    <div className="oc-link" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        {Array.from({ length: n }, (_, i) => (
          <path key={i} className={hot ? "hot" : ""} d={`M50 0 V50 H${(((i + 0.5) / n) * 100).toFixed(2)} V100`} />
        ))}
      </svg>
    </div>
  );
}

export default function AIEmployees({ org }) {
  const { command, ceo, executives, departments } = org;
  const [cmd, setCmd] = useState("");
  const [log, setLog] = useState([]);
  const [ceoNode, setCeo] = useState({ state: "", text: "Idle" });
  const [execs, setExecs] = useState(() => idle(executives.length));
  const [depts, setDepts] = useState(() => idle(departments.length));
  const [hot, setHot] = useState({ exec: false, dept: false });
  const timers = useRef([]);
  const t0 = useRef(0);
  const [ref, inView] = useInView({ threshold: 0.35 });

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const run = useCallback(() => {
    clear();
    const reduced = prefersReducedMotion();
    const at = (ms, fn) => timers.current.push(setTimeout(fn, reduced ? 0 : ms));
    const say = (who, msg, ok) => {
      const s = ((performance.now() - t0.current) / 1000).toFixed(1);
      setLog((l) => [...l, { id: Math.random(), t: ("00" + s).slice(-4) + "s", who, msg, ok }].slice(-12));
    };
    const setAt = (setter, i, node) => setter((arr) => arr.map((x, j) => (j === i ? node : x)));

    t0.current = performance.now();
    setLog([]); setCmd(""); setHot({ exec: false, dept: false });
    setCeo({ state: "", text: "Idle" });
    setExecs(idle(executives.length)); setDepts(idle(departments.length));

    if (reduced) setCmd(command);
    else [...command].forEach((_, i) => at(300 + i * 45, () => setCmd(command.slice(0, i + 1))));
    let t = reduced ? 0 : 300 + command.length * 45 + 350;

    at(t, () => { say("founder", "→ " + command); setCeo({ state: "is-on", text: "Planning launch…" }); });
    t += 900;
    at(t, () => { say("ai-ceo", "Plan ready · delegating to executives"); setCeo({ state: "is-on", text: ceo.task }); setHot((h) => ({ ...h, exec: true })); });
    executives.forEach((e, i) => at(t + 250 + i * 220, () => setAt(setExecs, i, { state: "is-on", text: e.task })));
    t += 250 + executives.length * 220 + 500;
    at(t, () => { say("orchestrator", `Routing ${departments.length} workstreams`); setHot((h) => ({ ...h, dept: true })); });
    departments.forEach((d, i) => {
      at(t + 300 + i * 260, () => setAt(setDepts, i, { state: "is-on", text: "Working…" }));
      at(t + 1500 + i * 330, () => { setAt(setDepts, i, { state: "is-done", text: d.task }); say(d.name.toLowerCase(), d.task, true); });
    });
    t += 1500 + departments.length * 330 + 300;
    at(t, () => {
      setExecs((arr) => arr.map((x) => ({ ...x, state: "is-done" })));
      setHot({ exec: false, dept: false });
      setCeo({ state: "is-done", text: "Launch underway" });
      say("ai-ceo", "Week 1 plan approved · reporting to founder", true);
    });
  }, [command, ceo.task, executives, departments]);

  // Auto-play once when the section scrolls into view.
  const runRef = useRef(run);
  runRef.current = run;
  useEffect(() => {
    if (!inView) return;
    runRef.current();
    return clear;
  }, [inView]);

  return (
    <section className="section section--dark" id="team" aria-labelledby="team-h">
      <div className="hero__bg hero__bg--dark" aria-hidden="true" />
      <div className="container">
        <div className="section__head">
          <Reveal as="p" className="eyebrow eyebrow--dark">AI employees</Reveal>
          <Reveal as="h2" id="team-h" className="h2">One command.<br />The whole company moves.</Reveal>
          <Reveal as="p" className="sub">An executive layer that plans, delegates and reports — and departments that execute in parallel.</Reveal>
        </div>

        <Reveal className="org">
          <div className="org__console" ref={ref}>
            <div className="console__bar mono"><span>founder@nova</span><button className="console__run" type="button" onClick={run}>Run ↻</button></div>
            <div className="console__input"><span className="mono prompt">›</span><span className="typed">{cmd}</span><span className="caret" aria-hidden="true" /></div>
            <ol className="console__log mono" aria-live="polite">
              {log.map((l) => (
                <li key={l.id}>
                  <span className="t">{l.t}</span>
                  <span><span className="a">{l.who}</span> {l.msg}{l.ok && <> <span className="ok"><Tick /></span></>}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="org__chart" aria-label="AI organization chart">
            <div className="oc-row oc-row--ceo"><Card role={ceo.role} node={ceoNode} ceo /></div>
            <Link n={executives.length} hot={hot.exec} />
            <div className="oc-row oc-row--exec">{executives.map((e, i) => <Card key={e.role} role={e.role} node={execs[i] || idle(1)[0]} />)}</div>
            <Link n={3} hot={hot.dept} />
            <div className="oc-row oc-row--dept">{departments.map((d, i) => <Card key={d.name} role={d.name} node={depts[i] || idle(1)[0]} />)}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
