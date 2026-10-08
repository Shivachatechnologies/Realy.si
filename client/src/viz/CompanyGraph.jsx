import { useMemo, useState } from "react";
import { Mark } from "../components/ui.jsx";

/**
 * Company intelligence graph: one intelligence layer at the center, every
 * company system around it, plus the system-to-system dependencies it manages.
 * Hover or focus a system to trace its connections.
 */
export default function CompanyGraph({ data }) {
  const [sel, setSel] = useState(-1);
  const W = 1000, H = 640, C = { x: W / 2, y: H / 2 };

  const nodes = useMemo(() => data.nodes.map((n, i) => {
    const a = -Math.PI / 2 + (i / data.nodes.length) * Math.PI * 2;
    return { ...n, i, x: C.x + Math.cos(a) * 400, y: C.y + Math.sin(a) * 250 };
  }), [data.nodes]); // eslint-disable-line react-hooks/exhaustive-deps
  const byKey = Object.fromEntries(nodes.map((n) => [n.key, n]));
  const links = data.links.map(([a, b]) => [byKey[a], byKey[b]]).filter(([a, b]) => a && b);

  const S = nodes[sel];
  const related = new Set(S ? links.filter(([a, b]) => a === S || b === S).flatMap(([a, b]) => [a.key, b.key]) : []);
  const curve = (a, b) => {
    // bend cross-links toward the center so the graph reads as one system
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const cx = mx + (C.x - mx) * 0.35, cy = my + (C.y - my) * 0.35;
    return `M${a.x} ${a.y} Q${cx} ${cy} ${b.x} ${b.y}`;
  };

  return (
    <div className={`cg ${S ? "has-sel" : ""}`}>
      <div className="cg__stage">
        <svg viewBox={`0 0 ${W} ${H}`} className="cg__svg" aria-hidden="true">
          <ellipse cx={C.x} cy={C.y} rx="400" ry="250" className="cg__orbit" />
          <ellipse cx={C.x} cy={C.y} rx="230" ry="144" className="cg__orbit cg__orbit--in" />
          {links.map(([a, b], k) => {
            const on = S && (a === S || b === S);
            return <path key={k} d={curve(a, b)} className={`cg__x ${on ? "is-on" : ""}`} />;
          })}
          {nodes.map((n) => {
            const on = !S || S === n || related.has(n.key);
            const d = `M${C.x} ${C.y} L${n.x} ${n.y}`;
            return (
              <g key={n.key} className={`cg__spoke ${on ? "" : "is-dim"} ${S === n ? "is-on" : ""}`}>
                <path d={d} />
                <circle r="2.6" className="cg__pkt">
                  <animateMotion dur={`${2.2 + (n.i % 4) * 0.45}s`} repeatCount="indefinite" path={d} keyPoints={n.i % 2 ? "0;1" : "1;0"} keyTimes="0;1" calcMode="linear" />
                </circle>
              </g>
            );
          })}
        </svg>

        <div className="cg__center">
          <span className="cg__ring" aria-hidden="true" />
          <Mark size={28} />
          <strong>{data.center}</strong>
        </div>

        {nodes.map((n) => {
          const on = !S || S === n || related.has(n.key);
          return (
            <button
              key={n.key}
              type="button"
              className={`cg__node ${S === n ? "is-sel" : ""} ${on ? "" : "is-dim"}`}
              style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }}
              onMouseEnter={() => setSel(n.i)}
              onMouseLeave={() => setSel(-1)}
              onFocus={() => setSel(n.i)}
              onBlur={() => setSel(-1)}
              aria-describedby="cg-info"
            >
              {n.name}
            </button>
          );
        })}
      </div>

      <div className="cg__info" id="cg-info" aria-live="polite">
        {S ? (
          <>
            <span className="cg__k">System</span>
            <strong>{S.name}</strong>
            <p>{S.text}</p>
            <span className="cg__k">Coordinated with</span>
            <p className="cg__rel">{[...related].filter((k) => k !== S.key).map((k) => byKey[k].name).join(", ") || "Realy Intelligence"}</p>
          </>
        ) : (
          <>
            <span className="cg__k">One intelligence layer</span>
            <strong>{nodes.length} systems. One shared memory.</strong>
            <p>Every system reads and writes the same model of the company, so work in one place changes the plan everywhere else. Hover a system to trace it.</p>
          </>
        )}
      </div>
    </div>
  );
}
