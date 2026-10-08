import { useEffect, useState } from "react";
import { CountUp, Mark, Sparkline } from "../components/ui.jsx";
import { useInView, useVisible } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";

const MODE = { auto: "Autonomous", approval: "Needs approval", signal: "Signal" };

function Gauge({ value, play }) {
  const r = 52, c = 2 * Math.PI * r;
  const v = play ? value : 0;
  return (
    <div className="gauge">
      <svg viewBox="0 0 128 128" aria-hidden="true">
        <circle cx="64" cy="64" r={r} className="gauge__track" />
        {Array.from({ length: 48 }, (_, i) => {
          const a = (i / 48) * Math.PI * 2 - Math.PI / 2;
          return <line key={i} x1={64 + Math.cos(a) * 58} y1={64 + Math.sin(a) * 58} x2={64 + Math.cos(a) * 61} y2={64 + Math.sin(a) * 61} className={i / 48 < v ? "gauge__tick is-on" : "gauge__tick"} />;
        })}
        <circle cx="64" cy="64" r={r} className="gauge__arc" style={{ strokeDasharray: c, strokeDashoffset: c * (1 - v) }} />
      </svg>
      <div className="gauge__val">
        <strong className="tnum"><CountUp value={value * 100} format="number" play={play} /></strong>
        <span className="mono">System intelligence</span>
      </div>
    </div>
  );
}

/**
 * Founder command center. Every value comes from `data` (DEMO values in
 * shared/siteData.js → commandCenter) so it can be swapped for live company data.
 */
export default function CommandCenter({ data }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const [vref, visible] = useVisible();
  const [play, setPlay] = useState(0);
  const [head, setHead] = useState(0);
  const I = data.intelligence;

  useEffect(() => { if (inView) setPlay(1); }, [inView]);
  useEffect(() => {
    if (!visible || prefersReducedMotion()) return;
    const iv = setInterval(() => setHead((h) => (h + 1) % data.stream.length), 2200);
    return () => clearInterval(iv);
  }, [visible, data.stream.length]);

  const stream = Array.from({ length: Math.min(5, data.stream.length) }, (_, i) => data.stream[(head + i) % data.stream.length]);
  const indicators = [
    ["Active agents", I.activeAgents, 1],
    ["Objectives", I.objectives, 0.6],
    ["Autonomous actions", I.autonomousActions, 0.92],
    ["Pending approvals", I.pendingApprovals, 0.15, "warn"],
    ["Risk signals", I.riskSignals, 0.1, "risk"],
    ["Opportunities", I.opportunities, 0.35, "opp"],
  ];

  return (
    <div ref={(el) => { ref.current = el; vref.current = el; }} className="cc">
      <div className="cc__bar">
        <div className="cc__id"><Mark size={18} /><strong>{data.company}</strong><span className="mono">{data.period}</span></div>
        <div className="cc__sys mono"><i />All systems nominal</div>
      </div>

      <div className="cc__grid">
        <div className="cc__biz">
          {data.business.map((m, i) => (
            <div key={m.key} className={`cc__tile ${i >= 4 ? "cc__tile--extra" : ""}`}>
              <div className="cc__k">{m.label}</div>
              <div className="cc__v tnum"><CountUp value={m.value} format={m.format} suffix={m.suffix || ""} play={play} /></div>
              <div className={`cc__d mono ${/^\+/.test(m.delta) ? "up" : /^−/.test(m.delta) ? "down" : ""}`}>{m.delta}</div>
              <Sparkline data={m.series} />
            </div>
          ))}
        </div>

        <div className="cc__intel">
          <Gauge value={I.systemIntelligence} play={play} />
          <ul className="cc__ind">
            {indicators.map(([k, v, f, tone]) => (
              <li key={k} className={tone ? `t-${tone}` : ""}>
                <span>{k}</span>
                <strong className="tnum"><CountUp value={v} format="number" play={play} /></strong>
                <span className="cc__bar2"><span style={{ transform: `scaleX(${play ? f : 0})` }} /></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="cc__stream">
          <div className="cc__k">Live action stream</div>
          <ol aria-live="off">
            {stream.map((s, i) => (
              <li key={`${head}-${i}`} className={`m-${s.mode}`}>
                <span className="mono cc__fn">{s.fn}</span>
                <span className="cc__txt">{s.text}</span>
                <span className="cc__mode mono">{MODE[s.mode]}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
