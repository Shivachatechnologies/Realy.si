import { useRef } from "react";
import { Mark, Tick, Pill, Arrow, Reveal } from "./ui.jsx";
import { prefersReducedMotion } from "../lib/motion.js";

export default function Hero({ hero, links }) {
  const layers = useRef({});

  // Subtle depth on pointer move (fine pointers only)
  const onMove = (e) => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    [["main", 6], ["a", 14], ["b", 12]].forEach(([k, d]) => {
      const el = layers.current[k];
      if (el) el.style.transform = `translate3d(${(-x * d).toFixed(2)}px, ${(-y * d).toFixed(2)}px, 0)`;
    });
  };
  const onLeave = () => Object.values(layers.current).forEach((el) => el && (el.style.transform = ""));

  return (
    <section className="hero" id="top" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="hero__bg" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__copy">
          <Reveal as="p" className="eyebrow">The AI company operating system</Reveal>
          <Reveal as="h1" className="display">
            <span>Build your</span> <span>entire company</span> <span>with AI.</span>
          </Reveal>
          <Reveal as="p" className="lede">
            From idea to company setup, product development, launch, marketing, sales and growth — Realy gives you
            an AI-powered team to build and run your company.
          </Reveal>
          <Reveal className="hero__cta">
            <a className="btn btn--primary btn--lg" href={links.signup}>Start Building <Arrow /></a>
            <a className="btn btn--ghost btn--lg" href="#platform">Explore Platform</a>
          </Reveal>
        </div>

        {/* Product visual: layered command center (DEMO values) */}
        <Reveal className="hero__visual" role="img" aria-label="Preview of the Realy company command center">
          <div className="hv-label mono">Realy AI · Company Command</div>
          <div className="panel hv-main" ref={(el) => (layers.current.main = el)}>
            <div className="panel__bar">
              <span className="hv-avatar" aria-hidden="true">{hero.company[0]}</span>
              <strong>{hero.company}</strong>
            </div>
            <div className="hv-progress">
              <div className="hv-progress__row"><span>Launch progress</span><span className="mono">{hero.launchProgress}%</span></div>
              <div className="bar"><span style={{ "--v": `${hero.launchProgress}%` }} /></div>
            </div>
            <ul className="hv-agents">
              {hero.agents.map((a) => (
                <li key={a.role}>
                  <span className="role"><span className="role__icon"><Mark /></span>{a.role}</span>
                  <Pill tone={a.tone} dot>{a.status}</Pill>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel hv-float hv-float--a" aria-hidden="true" ref={(el) => (layers.current.a = el)}>
            <span className="mono hv-k">Pipeline</span>
            <strong className="hv-v">$184,000</strong>
            <svg viewBox="0 0 120 32" className="spark"><polyline points="0,28 15,24 30,26 45,18 60,20 75,12 90,14 105,6 120,4" /></svg>
          </div>
          <div className="panel hv-float hv-float--b" aria-hidden="true" ref={(el) => (layers.current.b = el)}>
            <span className="hv-check"><Tick /></span>
            <div><strong>Incorporation documents ready</strong><span>Awaiting founder approval</span></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
