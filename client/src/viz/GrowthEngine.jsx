import { useEffect, useState } from "react";
import { useVisible } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";

/**
 * The growth engine as one connected system: a signal runs from Market to
 * Customers. `focus` ("marketing" | "sales") highlights a half of the engine.
 */
export default function GrowthEngine({ stages, focus }) {
  const [ref, visible] = useVisible();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!visible || prefersReducedMotion()) return;
    const iv = setInterval(() => setTick((t) => (t + 1) % (stages.length + 3)), 520);
    return () => clearInterval(iv);
  }, [visible, stages.length]);

  return (
    <div ref={ref} className={`ge ${focus ? `ge--${focus}` : ""}`}>
      <div className="ge__groups mono" aria-hidden="true">
        <span>Marketing intelligence</span><span>Sales intelligence</span>
      </div>
      <ol className="ge__chain">
        {stages.map((s, i) => (
          <li key={s.name} className={`ge__stage g-${s.group} ${i === tick ? "is-hot" : ""} ${i < tick ? "is-past" : ""}`}>
            <span className="ge__node"><span className="mono">{String(i + 1).padStart(2, "0")}</span></span>
            <strong>{s.name}</strong>
            <span className="ge__text">{s.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
