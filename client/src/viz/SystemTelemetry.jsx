import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../lib/motion.js";

/**
 * Live readout for the hero: the selected system (or the whole core) with
 * agents, task rate and status. Numbers drift slightly to read as live (DEMO).
 */
export default function SystemTelemetry({ systems, active, onSelect }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const iv = setInterval(() => setTick((t) => t + 1), 1400);
    return () => clearInterval(iv);
  }, []);
  const jitter = (n, i) => Math.max(1, Math.round(n + Math.sin(tick * 0.9 + i * 1.7) * Math.max(1, n * 0.08)));

  const sel = systems[active];
  const totalAgents = systems.reduce((a, s) => a + s.agents, 0);
  const totalRate = systems.reduce((a, s, i) => a + jitter(s.rate, i), 0);
  const tiers = [...new Set(systems.map((s) => s.tier))];

  return (
    <div className="tel" aria-live="polite">
      <div className="tel__head">
        <span className="tel__k">{sel ? `${sel.tier} · ${sel.name} system` : "Realy intelligence core"}</span>
        <span className="tel__live"><i />Live</span>
      </div>
      <div className="tel__nums">
        <div><strong className="tnum">{sel ? sel.agents : totalAgents}</strong><span>Active agents</span></div>
        <div><strong className="tnum">{sel ? jitter(sel.rate, active) : totalRate}</strong><span>Tasks / min</span></div>
        <div><strong>{sel ? sel.status : `${systems.length} systems`}</strong><span>{sel ? "State" : "Coordinated"}</span></div>
      </div>
      <div className="tel__tiers" role="group" aria-label="Activate a system">
        {tiers.map((t) => (
          <div key={t} className="tel__tier">
            <span className="tel__tname">{t}</span>
            {systems.map((s, i) => s.tier === t && (
              <button key={s.key} type="button" className={`tel__sys ${i === active ? "is-on" : ""}`} aria-pressed={i === active} onClick={() => onSelect(i === active ? -1 : i)}>
                {s.name}
              </button>
            ))}
          </div>
        ))}
      </div>
      <p className="tel__note">Select a system to activate its intelligence layer. Demonstration telemetry.</p>
    </div>
  );
}
