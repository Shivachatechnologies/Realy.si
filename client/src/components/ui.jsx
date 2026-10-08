import { useEffect, useRef, useState } from "react";
import { useInView } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";
import { fmt } from "../lib/format.js";

/** Brand R mark (brand book construction: one stroke, one 56° angle). */
export function Mark({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M3 16A16 16 0 0 1 19 0H67A30 30 0 0 1 68.18 59.96L93 100H73L35.8 40H67A10 10 0 0 0 67 20H3Z" />
      <path d="M3 64A16 16 0 0 1 19 48H29.5L61.7 100H3Z" />
    </svg>
  );
}

export function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Realy.si home">
      <Mark className="logo__mark" />
      <span className="logo__word">Realy<span>.si</span></span>
    </a>
  );
}

export function Tick() {
  return (
    <svg className="tick" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.3l2.3 2.2 4.7-4.8" /></svg>
  );
}

export function Pill({ tone = "info", dot = tone === "live", children }) {
  return <span className={`pill pill--${tone}`}>{dot && <i />}{children}</span>;
}

export function Arrow() {
  return <span className="arrow" aria-hidden="true">→</span>;
}

/**
 * Fades/slides in when scrolled into view. Siblings that are also <Reveal>
 * stagger automatically by DOM order.
 */
export function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const [ref, inView] = useInView();
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el?.parentElement) return;
    const sibs = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
    setDelay(Math.min(Math.max(0, sibs.indexOf(el)), 5) * 70);
    const t = setTimeout(() => setDelay(0), 1200);
    return () => clearTimeout(t);
  }, [inView, ref]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Counts from 0 to `value` whenever `play` changes to a new truthy token. */
export function CountUp({ value, format, suffix = "", play, duration = 1100 }) {
  const [shown, setShown] = useState(value);
  const raf = useRef(0);

  useEffect(() => {
    if (!play || prefersReducedMotion()) { setShown(value); return; }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setShown(value * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, play, duration]);

  return fmt(shown, format, suffix);
}
