import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";
import { Mark } from "../components/ui.jsx";

/**
 * "Launch my company." → intelligence core → seven intelligence layers →
 * actions executing in parallel. The action counter is a DEMO visualization.
 */
export default function DecompositionGraph({ data, compact = false }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [step, setStep] = useState(0); // 0 idle → 1 instruction → 2 core → 3 layers → 4 executing
  const [actions, setActions] = useState(0);
  const [done, setDone] = useState([]);
  const allActions = useMemo(() => data.layers.flatMap((l, li) => l.actions.map((a, ai) => ({ id: `${li}-${ai}`, layer: l.name, text: a }))), [data]);

  const cleanup = useRef(() => {});
  const run = () => {
    cleanup.current();
    const reduced = prefersReducedMotion();
    setStep(0); setActions(0); setDone([]);
    if (reduced) { setStep(4); setActions(312); setDone(allActions.map((a) => a.id)); return; }
    const ts = [setTimeout(() => setStep(1), 200), setTimeout(() => setStep(2), 900), setTimeout(() => setStep(3), 1600), setTimeout(() => setStep(4), 2400)];
    allActions.forEach((a, i) => ts.push(setTimeout(() => setDone((d) => [...d, a.id]), 2700 + i * 160)));
    let n = 0;
    let iv;
    ts.push(setTimeout(() => { iv = setInterval(() => { n = Math.min(312, n + 7); setActions(n); if (n >= 312) clearInterval(iv); }, 60); }, 2400));
    cleanup.current = () => { ts.forEach(clearTimeout); clearInterval(iv); };
  };

  useEffect(() => {
    if (!inView) return;
    run();
    return () => cleanup.current();
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} className={`decomp ${compact ? "decomp--compact" : ""} step-${step}`}>
      <div className="decomp__col decomp__col--in">
        <div className="decomp__node decomp__node--founder"><span className="mono">Founder</span><strong>“{data.instruction}”</strong></div>
        <div className="decomp__beam" />
        <div className="decomp__node decomp__node--core">
          <Mark size={22} />
          <div><strong>Realy Intelligence Core</strong><span className="mono">objective → plan → actions</span></div>
        </div>
      </div>

      <div className="decomp__fan" aria-hidden="true">
        <svg viewBox="0 0 100 700" preserveAspectRatio="none">
          {data.layers.map((_, i) => {
            const y = 50 + i * 100;
            return <path key={i} className="decomp__edge" style={{ animationDelay: `${i * 0.25}s` }} d={`M0 350 C 50 350, 50 ${y}, 100 ${y}`} />;
          })}
        </svg>
      </div>

      <ol className="decomp__layers">
        {data.layers.map((l) => (
          <li key={l.name} className="decomp__layer">
            <div className="decomp__lname"><i />{l.name} Intelligence</div>
            <ul className="decomp__actions">
              {l.actions.map((a, ai) => {
                const id = `${data.layers.indexOf(l)}-${ai}`;
                return <li key={a} className={done.includes(id) ? "is-done" : ""}><span className="decomp__tick" />{a}</li>;
              })}
            </ul>
          </li>
        ))}
      </ol>

      <div className="decomp__meter">
        <div><span className="mono">Actions generated</span><strong className="tnum">{actions}</strong></div>
        <div><span className="mono">Executing in parallel</span><strong className="tnum">{step >= 4 ? Math.min(46, Math.round(actions / 6.8)) : 0}</strong></div>
        <button type="button" className="chip-btn" onClick={run}>Replay</button>
      </div>
    </div>
  );
}
