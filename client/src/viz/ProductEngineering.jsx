import { useState } from "react";

/** Product engineering marketplace: complexity spectrum from $500 to $100,000+. */
export default function ProductEngineering({ data }) {
  const types = [...data.types].sort((a, b) => a.level - b.level);
  const [sel, setSel] = useState(Math.floor(types.length / 2));
  const T = types[sel];

  return (
    <div className="pe">
      <div className="pe__spectrum">
        <div className="pe__scale mono"><span>{data.min}</span><span>Scope &amp; complexity</span><span>{data.max}</span></div>
        <div className="pe__track" aria-hidden="true">
          <span className="pe__fill" style={{ width: `${Math.max(4, T.level * 100)}%` }} />
          {types.map((t, i) => (
            <span key={t.name} className={`pe__pin ${i === sel ? "is-sel" : ""}`} style={{ left: `${Math.max(2, t.level * 100)}%` }} />
          ))}
        </div>
        <label className="sr-only" htmlFor="pe-range">Product type</label>
        <input id="pe-range" className="pe__range" type="range" min="0" max={types.length - 1} step="1" value={sel} onChange={(e) => setSel(Number(e.target.value))} aria-valuetext={T.name} />
      </div>

      <div className="pe__grid">
        {types.map((t, i) => (
          <button key={t.name} className={`pe__card ${i === sel ? "is-sel" : ""}`} onClick={() => setSel(i)} aria-pressed={i === sel}>
            <span className="pe__lvl" aria-hidden="true">{Array.from({ length: 5 }, (_, k) => <i key={k} className={k < Math.ceil(t.level * 5) ? "on" : ""} />)}</span>
            <strong>{t.name}</strong>
            <span>{t.scope}</span>
          </button>
        ))}
      </div>

      <ol className="pe__process">
        {data.process.map((p, i) => <li key={p}><span className="mono">{String(i + 1).padStart(2, "0")}</span>{p}</li>)}
      </ol>
    </div>
  );
}
