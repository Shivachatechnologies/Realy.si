import { useEffect, useState } from "react";
import { Mark } from "../components/ui.jsx";
import { useVisible } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";

const initials = (s) => s.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

/**
 * Existing product path: the systems a company already runs stream into
 * Realy, which then moves the product through connect → scale.
 * Event counters are illustrative (DEMO).
 */
export default function ConnectFlow({ data }) {
  const { sources, flow } = data;
  const [ref, visible] = useVisible();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!visible || prefersReducedMotion()) return;
    const iv = setInterval(() => setTick((t) => t + 1), 900);
    return () => clearInterval(iv);
  }, [visible]);

  const step = tick % (flow.length + 2);
  const events = (i) => 120 + i * 37 + ((tick * (i + 3) * 7) % 97);
  const rows = sources.length;

  return (
    <div ref={ref} className="cf">
      <div className="cf__panel">
        <div className="cf__phead"><strong>Connections</strong><span>{rows} sources</span></div>
        <ul className="cf__src">
          {sources.map((s, i) => (
            <li key={s.name}>
              <span className="cf__glyph" aria-hidden="true">{initials(s.name)}</span>
              <span className="cf__name"><strong>{s.name}</strong><em>{s.kind}</em></span>
              <span className={`cf__state ${(tick + i) % 5 === 0 ? "is-sync" : ""}`}>{(tick + i) % 5 === 0 ? "Syncing" : "Connected"}</span>
              <span className="cf__ev tnum">{events(i)} ev/min</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="cf__bridge" aria-hidden="true">
        <svg viewBox={`0 0 100 ${rows * 10}`} preserveAspectRatio="none">
          {sources.map((_, i) => {
            const y = i * 10 + 5, d = `M0 ${y} C 55 ${y}, 45 ${rows * 5}, 100 ${rows * 5}`;
            return (
              <g key={i}>
                <path d={d} className="cf__line" />
                <circle r="0.9" className="cf__pkt"><animateMotion dur={`${1.6 + (i % 4) * 0.35}s`} repeatCount="indefinite" path={d} /></circle>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="cf__right">
        <div className="cf__hub"><Mark size={24} /><div><strong>Realy</strong><span>Model of your product and business</span></div></div>
        <ol className="cf__flow">
          {flow.map((f, i) => (
            <li key={f.name} className={i < step ? "is-done" : i === step ? "is-now" : ""}>
              <span className="cf__fi tnum">{String(i + 1).padStart(2, "0")}</span>
              <div><strong>{f.name}</strong><p>{f.text}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
