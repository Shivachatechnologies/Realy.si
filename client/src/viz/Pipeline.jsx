import { useEffect, useState } from "react";
import { useInView, useVisible } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";

/** From thought to company: a system pipeline with a traveling signal. */
export default function Pipeline({ stages }) {
  const [ref, inView] = useInView({ threshold: 0.25 });
  const [vref, visible] = useVisible();
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) { setActive(stages.length - 1); return; }
    let i = -1;
    const iv = setInterval(() => {
      if (!visible) return;
      i = i + 1 > stages.length ? 0 : i + 1;
      setActive(i >= stages.length ? stages.length - 1 : i);
    }, 700);
    return () => clearInterval(iv);
  }, [inView, visible, stages.length]);

  const pct = active < 0 ? 0 : ((active + 1) / stages.length) * 100;

  return (
    <div ref={(el) => { ref.current = el; vref.current = el; }} className="pipe">
      <div className="pipe__rail" aria-hidden="true"><span style={{ width: `${pct}%` }} /></div>
      <ol className="pipe__stages">
        {stages.map((s, i) => (
          <li key={s.name} className={`pipe__stage ${i <= active ? "is-on" : ""} ${i === active ? "is-now" : ""}`}>
            <span className="pipe__idx mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="pipe__dot" />
            <strong>{s.name}</strong>
            <span className="pipe__out">{s.out}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
