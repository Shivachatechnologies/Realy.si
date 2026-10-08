import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useInView } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";
import { fmt } from "../lib/format.js";

/** Official Realy logo (brand book v2, "Primary — full colour" variant). Never recolored or redrawn. */
export function Logo({ className = "", height = 26, onDark = false }) {
  return (
    <img className={`logo-img ${className}`} src={onDark ? "/brand/realy-logo-on-dark.svg" : "/brand/realy-logo.svg"} alt="Realy.si" height={height} width={Math.round(height * 4.4635)} decoding="async" />
  );
}

export function Mark({ className = "", size = 28 }) {
  return <img className={className} src="/brand/realy-mark.svg" alt="" aria-hidden="true" width={size} height={Math.round(size * 1.0636)} decoding="async" />;
}

/** Button that renders an internal <Link> or an external <a>. */
export function Button({ to, href, variant = "primary", size, children, arrow, magnetic, className = "", ...rest }) {
  const cls = `btn btn--${variant} ${size ? `btn--${size}` : ""} ${className}`.trim();
  const inner = <>{children}{arrow && <span className="btn__arrow" aria-hidden="true">→</span>}</>;
  // Subtle magnetic pull toward the cursor (fine pointers, motion allowed).
  const mag = magnetic ? {
    onPointerMove: (e) => {
      if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
      const r = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18, y = (e.clientY - r.top - r.height / 2) * 0.3;
      e.currentTarget.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    },
    onPointerLeave: (e) => { e.currentTarget.style.transform = ""; },
  } : {};
  if (to) return <Link className={cls} to={to} {...mag} {...rest}>{inner}</Link>;
  return <a className={cls} href={href} {...mag} {...rest}>{inner}</a>;
}

/** Fades in when scrolled into view; sibling reveals stagger by DOM order. */
export function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const [ref, inView] = useInView();
  const [delay, setDelay] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!inView || !el?.parentElement) return;
    const sibs = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
    setDelay(Math.min(Math.max(0, sibs.indexOf(el)), 6) * 80);
    const t = setTimeout(() => setDelay(0), 1400);
    return () => clearTimeout(t);
  }, [inView, ref]);
  return (
    <Tag ref={ref} className={`reveal ${inView ? "is-in" : ""} ${className}`.trim()} style={delay ? { transitionDelay: `${delay}ms` } : undefined} {...rest}>
      {children}
    </Tag>
  );
}

/** Counts up to `value` each time `play` changes to a new truthy token. */
export function CountUp({ value, format, suffix = "", play, duration = 1400 }) {
  const [shown, setShown] = useState(value);
  const raf = useRef(0);
  useEffect(() => {
    if (!play || prefersReducedMotion()) { setShown(value); return; }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setShown(value * (1 - Math.pow(1 - t, 4)));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, play, duration]);
  return fmt(shown, format, suffix);
}

/** Standard section header. */
export function SectionHead({ eyebrow, title, lede, align = "left", children }) {
  return (
    <header className={`shead shead--${align}`}>
      {eyebrow && <Reveal as="p" className="eyebrow">{eyebrow}</Reveal>}
      <Reveal as="h2" className="h2">{title}</Reveal>
      {lede && <Reveal as="p" className="lede">{lede}</Reveal>}
      {children}
    </header>
  );
}

/** Sub-page hero: editorial split (title left, intro + actions right) unless a visual is given. */
export function PageHero({ eyebrow, title, lede, children, visual }) {
  const intro = (
    <>
      {lede && <Reveal as="p" className="lede lede--lg">{lede}</Reveal>}
      {children && <Reveal className="phero__cta">{children}</Reveal>}
    </>
  );
  return (
    <section className={`phero ${visual ? "phero--visual" : "phero--text"}`}>
      <div className="container phero__inner">
        <div className="phero__copy">
          <Reveal as="p" className="eyebrow">{eyebrow}</Reveal>
          <Reveal as="h1" className="h1">{title}</Reveal>
          {visual && intro}
        </div>
        {visual ? <div className="phero__visual">{visual}</div> : <div className="phero__side">{intro}</div>}
      </div>
    </section>
  );
}

export function Sparkline({ data, className = "" }) {
  const w = 100, h = 28;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${((i / (data.length - 1)) * w).toFixed(1)},${(h - 2 - ((v - min) / (max - min || 1)) * (h - 4)).toFixed(1)}`).join(" ");
  return (
    <svg className={`spark ${className}`} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} />
    </svg>
  );
}
