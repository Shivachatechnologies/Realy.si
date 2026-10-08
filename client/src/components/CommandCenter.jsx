import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CountUp, Pill, Reveal } from "./ui.jsx";
import { useInView } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";

function Chart({ series, animate }) {
  const lineRef = useRef(null);
  const W = 600, H = 180, P = 6;
  const max = Math.max(...series) * 1.1, min = Math.min(...series) * 0.8;
  const pts = series.map((v, i) => [(i / (series.length - 1)) * W, P + (1 - (v - min) / (max - min)) * (H - P * 2)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

  useLayoutEffect(() => {
    const el = lineRef.current;
    if (!el || !animate || prefersReducedMotion()) return;
    el.style.setProperty("--len", Math.ceil(el.getTotalLength()));
    el.classList.remove("draw");
    void el.getBoundingClientRect();
    el.classList.add("draw");
  }, [animate, line]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1764ff" stopOpacity=".14" />
          <stop offset="1" stopColor="#1764ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="grid">{[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} />)}</g>
      <path className="area" d={`${line} L ${W} ${H} L 0 ${H} Z`} />
      <path className="line" ref={lineRef} d={line} />
    </svg>
  );
}

export default function CommandCenter({ dashboard }) {
  const { views, company } = dashboard;
  const [active, setActive] = useState(views[0]?.id);
  const [play, setPlay] = useState(0); // bump to replay count-ups / chart
  const [appRef, inView] = useInView({ threshold: 0.25 });
  const tabs = useRef([]);

  useEffect(() => { if (inView) setPlay((p) => p + 1); }, [inView]);
  useEffect(() => { if (!views.some((v) => v.id === active)) setActive(views[0]?.id); }, [views, active]);

  const v = views.find((x) => x.id === active) || views[0];
  if (!v) return null;
  const hasChart = Array.isArray(v.series) && v.series.length > 1;

  const select = (id) => { setActive(id); setPlay((p) => p + 1); };
  const onKey = (e) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const i = views.findIndex((x) => x.id === v.id);
    let n = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % views.length;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + views.length) % views.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = views.length - 1;
    tabs.current[n]?.focus();
    select(views[n].id);
  };

  return (
    <section className="section section--tint" id="command" aria-labelledby="cmd-h">
      <div className="container">
        <div className="section__head section__head--center">
          <Reveal as="p" className="eyebrow">Command center</Reveal>
          <Reveal as="h2" id="cmd-h" className="h2">Your company, in one command center.</Reveal>
          <Reveal as="p" className="sub">Revenue, product, pipeline and every AI employee — one live view of the whole company.</Reveal>
        </div>

        <Reveal className="app">
          <aside className="app__side" ref={appRef}>
            <div className="app__brand"><span className="hv-avatar" aria-hidden="true">{company[0]}</span><span>{company}</span></div>
            <div className="app__nav" role="tablist" aria-label="Dashboard views" onKeyDown={onKey}>
              {views.map((x, i) => (
                <button
                  key={x.id}
                  ref={(el) => (tabs.current[i] = el)}
                  className="app__tab"
                  role="tab"
                  id={`tab-${x.id}`}
                  aria-controls="dash-panel"
                  aria-selected={x.id === v.id}
                  tabIndex={x.id === v.id ? 0 : -1}
                  onClick={() => select(x.id)}
                ><span className="ico" />{x.label}</button>
              ))}
            </div>
          </aside>

          <div className="app__main" role="tabpanel" id="dash-panel" aria-labelledby={`tab-${v.id}`}>
            <div className="fade-swap" key={`${v.id}-${play}`}>
              <div className="dash__head">
                <div><h3 className="dash__title">{v.title}</h3><p className="dash__sub">{v.subtitle}</p></div>
                <Pill tone="live">Live</Pill>
              </div>
              <div className="metrics">
                {v.metrics.map((m) => (
                  <div className="metric" key={m.label}>
                    <div className="metric__k">{m.label}</div>
                    <div className="metric__v"><CountUp value={m.value} format={m.format} suffix={m.suffix || ""} play={play} /></div>
                    <div className={`metric__d ${/^\+/.test(m.delta) ? "up" : ""}`}>{m.delta}</div>
                  </div>
                ))}
              </div>
              <div className={`dash__body ${hasChart ? "" : "dash__body--single"}`}>
                {hasChart && (
                  <div className="chart">
                    <div className="chart__k"><span>{v.seriesLabel}</span><span className="mono">{v.series.length}w</span></div>
                    <Chart series={v.series} animate={play} />
                  </div>
                )}
                <ul className="rows">
                  <li className="rows__k" style={{ border: 0, padding: "0 0 4px" }}><span>{hasChart ? "Activity" : "Overview"}</span></li>
                  {v.rows.map((r, i) => (
                    <li key={i}>
                      <span className="txt"><span className="who">{r.who}</span><span className="what">{r.what}</span></span>
                      <Pill tone={r.tone}>{r.meta}</Pill>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
        <p className="footnote">Demo interface. Values are illustrative.</p>
      </div>
    </section>
  );
}
