import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion.js";

/**
 * From thought to company — a scroll-driven sequence. The section pins while
 * scrolling; each stage takes over the screen and hands its artifacts to the
 * company being assembled on the right. Small screens and reduced motion get a
 * static, fully readable list instead.
 */
export default function Pipeline({ stages }) {
  const wrapRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const mq = window.matchMedia("(max-width: 860px)");
    const decide = () => setPinned(!mq.matches && !prefersReducedMotion());
    decide();
    mq.addEventListener("change", decide);

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const node = wrapRef.current;
        if (!node) return;
        const r = node.getBoundingClientRect();
        const span = r.height - window.innerHeight;
        const p = span > 0 ? Math.min(0.999, Math.max(0, -r.top / span)) : 0;
        setIdx(Math.floor(p * stages.length));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); mq.removeEventListener("change", decide); cancelAnimationFrame(raf); };
  }, [stages.length]);

  if (!pinned) {
    return (
      <div ref={wrapRef} className="tc tc--static">
        <ol className="tc__list">
          {stages.map((s, i) => (
            <li key={s.name}>
              <span className="tc__n tnum">{String(i + 1).padStart(2, "0")}</span>
              <div><strong>{s.name}</strong><p>{s.out}</p><ul>{s.artifact.map((a) => <li key={a}>{a}</li>)}</ul></div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const S = stages[idx];
  const built = stages.slice(0, idx + 1).flatMap((s) => s.artifact.map((a) => ({ a, s: s.name })));

  return (
    <div ref={wrapRef} className="tc" style={{ height: `${stages.length * 55 + 60}vh` }}>
      <div className="tc__pin">
        <div className="tc__rail" aria-hidden="true">
          {stages.map((s, i) => (
            <span key={s.name} className={i < idx ? "is-past" : i === idx ? "is-now" : ""}>
              <i />{s.name}
            </span>
          ))}
        </div>

        <div className="tc__main" aria-live="polite">
          <span className="tc__count tnum">{String(idx + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</span>
          <h3 className="tc__name" key={S.name}>{S.name}</h3>
          <p className="tc__out" key={`o-${S.name}`}>{S.out}</p>
          <ul className="tc__art" key={`a-${S.name}`}>{S.artifact.map((a) => <li key={a}>{a}</li>)}</ul>
          <div className="tc__bar" aria-hidden="true"><span style={{ width: `${((idx + 1) / stages.length) * 100}%` }} /></div>
        </div>

        <div className="tc__company" aria-label="Company being assembled">
          <div className="tc__chead"><span>Your company</span><span className="tnum">{built.length} artifacts</span></div>
          <div className="tc__stack">
            {built.map((b, i) => (
              <div key={`${b.s}-${b.a}`} className={`tc__block ${b.s === S.name ? "is-new" : ""}`} style={{ animationDelay: `${(i % 3) * 60}ms` }}>
                <span>{b.a}</span><em>{b.s}</em>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
