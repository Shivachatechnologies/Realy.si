import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";

/** A machine reasoning trace, typed line by line (illustrative). */
const TRACE = [
  ["objective", "Launch Nova — B2B analytics for logistics SMBs"],
  ["research", "312 sources · 14 competitors · demand concentrated in mid-market"],
  ["reason", "Price below enterprise incumbents; win on onboarding speed"],
  ["plan", "6 workstreams · 41 milestones · critical path: product → launch"],
  ["risk", "Data-privacy obligations in EU → route legal review to founder"],
  ["decide", "Proceed with US entity first; EU after first 20 customers"],
  ["execute", "Workstreams dispatched to 46 agents"],
  ["monitor", "Tracking 9 business metrics · 7 opportunity signals"],
];

export default function ReasoningTrace() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) { setN(TRACE.length); return; }
    const iv = setInterval(() => setN((x) => (x >= TRACE.length ? x : x + 1)), 650);
    return () => clearInterval(iv);
  }, [inView]);
  return (
    <div ref={ref} className="trace">
      <div className="trace__bar mono"><span>reasoning.trace</span><span>{n < TRACE.length ? "thinking…" : "complete"}</span></div>
      <ol className="trace__lines mono">
        {TRACE.slice(0, n).map(([k, v]) => (
          <li key={k}><span className={`trace__k k-${k}`}>{k}</span><span>{v}</span></li>
        ))}
        {n < TRACE.length && <li className="trace__cursor"><span className="trace__k">…</span><span className="caret" /></li>}
      </ol>
    </div>
  );
}
