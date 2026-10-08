import { useEffect, useMemo, useState } from "react";
import { useVisible } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";
import { Mark } from "../components/ui.jsx";

const TONE = { Thinking: "think", Planning: "plan", Executing: "exec", Analyzing: "analyze", Optimizing: "opt", "Waiting for approval": "wait" };

/**
 * Living organization map: executives on an inner orbit, functions on an outer
 * orbit, all connected to the intelligence core. Statuses are simulated (DEMO).
 */
export default function WorkforceMap({ data }) {
  const nodes = useMemo(() => {
    const ex = data.executives.map((n, i, a) => ({ n, ring: "exec", a: -Math.PI / 2 + (i / a.length) * Math.PI * 2 }));
    const fn = data.functions.map((n, i, a) => ({ n, ring: "fn", a: -Math.PI / 2 + Math.PI / a.length + (i / a.length) * Math.PI * 2 }));
    // each function reports to the executive closest to it on the map
    const angDist = (x, y) => Math.abs(Math.atan2(Math.sin(x - y), Math.cos(x - y)));
    fn.forEach((f) => { f.parent = ex.reduce((best, e, j) => (angDist(f.a, e.a) < angDist(f.a, ex[best].a) ? j : best), 0); });
    return [...ex, ...fn];
  }, [data]);

  const seed = (i) => data.statuses[(i * 7 + 3) % data.statuses.length];
  const [status, setStatus] = useState(() => nodes.map((_, i) => seed(i)));
  const [pulse, setPulse] = useState(-1);
  const [ref, visible] = useVisible();

  useEffect(() => {
    if (!visible || prefersReducedMotion()) return;
    const iv = setInterval(() => {
      const i = Math.floor(Math.random() * nodes.length);
      const pool = data.statuses.filter((s) => s !== "Waiting for approval" || Math.random() < 0.35);
      setStatus((s) => s.map((x, j) => (j === i ? pool[Math.floor(Math.random() * pool.length)] : x)));
      setPulse(i);
    }, 900);
    return () => clearInterval(iv);
  }, [visible, nodes.length, data.statuses]);

  // geometry in a 1000×640 viewBox
  const C = { x: 500, y: 320 };
  const R = { exec: [190, 140], fn: [430, 262] };
  const pos = (nd) => ({ x: C.x + Math.cos(nd.a) * R[nd.ring][0], y: C.y + Math.sin(nd.a) * R[nd.ring][1] });

  return (
    <div ref={ref} className="wf">
      <svg className="wf__links" viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <ellipse cx={C.x} cy={C.y} rx={R.exec[0]} ry={R.exec[1]} className="wf__orbit" />
        <ellipse cx={C.x} cy={C.y} rx={R.fn[0]} ry={R.fn[1]} className="wf__orbit wf__orbit--outer" />
        {nodes.map((nd, i) => {
          const p = pos(nd);
          const from = nd.ring === "exec" ? C : pos(nodes[nd.parent]);
          return (
            <g key={nd.n}>
              <path className={`wf__link ${i === pulse ? "is-hot" : ""}`} d={`M${from.x} ${from.y} L${p.x} ${p.y}`} />
              <circle className="wf__packet" r="2.4">
                <animateMotion dur={`${2.4 + (i % 5) * 0.5}s`} repeatCount="indefinite" path={`M${from.x} ${from.y} L${p.x} ${p.y}`} />
              </circle>
            </g>
          );
        })}
      </svg>

      <div className="wf__center">
        <span className="wf__halo" />
        <Mark size={30} />
        <strong>{data.center}</strong>
        <span className="mono">{nodes.length} units online</span>
      </div>

      {nodes.map((nd, i) => {
        const p = pos(nd);
        const st = status[i];
        return (
          <div
            key={nd.n}
            className={`wf__node wf__node--${nd.ring} ${i === pulse ? "is-pulse" : ""}`}
            style={{ left: `${(p.x / 1000) * 100}%`, top: `${(p.y / 640) * 100}%` }}
          >
            <strong>{nd.n}</strong>
            <span className={`wf__status s-${TONE[st]}`}><i />{st}</span>
          </div>
        );
      })}

      {/* Small screens: the same organization as a list */}
      <ul className="wf__list">
        {nodes.map((nd, i) => (
          <li key={nd.n} className={nd.ring === "exec" ? "is-exec" : ""}>
            <strong>{nd.n}</strong>
            <span className={`wf__status s-${TONE[status[i]]}`}><i />{status[i]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
