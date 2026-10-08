import { useEffect, useState } from "react";
import { useVisible } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";

/**
 * The growth engine as one connected system. A funnel band narrows from market
 * to customers while signal particles flow through every stage; the active
 * stage is highlighted. `focus` ("marketing" | "sales") emphasizes one half.
 */
export default function GrowthEngine({ stages, focus }) {
  const [ref, visible] = useVisible();
  const [tick, setTick] = useState(0);
  const n = stages.length;

  useEffect(() => {
    if (!visible || prefersReducedMotion()) return;
    const iv = setInterval(() => setTick((t) => (t + 1) % (n + 2)), 650);
    return () => clearInterval(iv);
  }, [visible, n]);

  const W = 1000, H = 160, mid = H / 2;
  const half = (i) => 62 - (i / (n - 1)) * 44; // band half-height narrows toward customers
  const xs = stages.map((_, i) => (i / (n - 1)) * W);
  const top = xs.map((x, i) => `${x},${mid - half(i)}`).join(" ");
  const bot = xs.map((x, i) => `${x},${mid + half(i)}`).reverse().join(" ");
  const split = stages.findIndex((s) => s.group === "sales");
  const splitX = split > 0 ? (xs[split - 1] + xs[split]) / 2 : W / 2;
  const lanes = [-0.6, -0.25, 0.1, 0.45, 0.75];

  return (
    <div ref={ref} className={`ge ${focus ? `ge--${focus}` : ""}`}>
      <div className="ge__flow" aria-hidden="true">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="geBand" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#1764ff" stopOpacity=".05" />
              <stop offset="1" stopColor="#1764ff" stopOpacity=".18" />
            </linearGradient>
          </defs>
          <polygon points={`${top} ${bot}`} fill="url(#geBand)" />
          <line x1={splitX} x2={splitX} y1="0" y2={H} className="ge__split" />
          {lanes.map((l, k) => {
            const d = "M" + xs.map((x, i) => `${x} ${mid + l * half(i)}`).join(" L");
            return (
              <g key={k}>
                <path d={d} className="ge__lane" />
                {[0, 1, 2].map((p) => (
                  <circle key={p} r="2.4" className="ge__pkt">
                    <animateMotion dur={`${5 + k * 0.7}s`} begin={`${-(p * (5 + k * 0.7)) / 3}s`} repeatCount="indefinite" path={d} />
                  </circle>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
      <ol className="ge__chain" style={{ "--n": n }}>
        {stages.map((s, i) => (
          <li key={s.name} className={`ge__stage g-${s.group} ${i === tick ? "is-hot" : ""} ${i < tick ? "is-past" : ""}`}>
            <span className="ge__node"><span className="tnum">{String(i + 1).padStart(2, "0")}</span></span>
            <strong>{s.name}</strong>
            <span className="ge__text">{s.text}</span>
          </li>
        ))}
      </ol>
      <div className="ge__groups"><span>Marketing intelligence</span><span>Sales intelligence</span></div>
    </div>
  );
}
