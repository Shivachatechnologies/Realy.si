import { useState } from "react";

/**
 * Control-system visualization: three concentric layers. The founder layer sits
 * at the center and is locked; outer layers are delegated to the system.
 */
export default function AutonomyControl({ layers }) {
  const [sel, setSel] = useState(0);
  const L = layers[sel];
  const radii = [230, 165, 98];

  return (
    <div className="auto">
      <div className="auto__dial" role="tablist" aria-label="Autonomy layers">
        <svg viewBox="0 0 520 520" aria-hidden="true">
          <defs>
            <radialGradient id="autoCore" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#1764ff" stopOpacity=".35" />
              <stop offset="1" stopColor="#1764ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="260" cy="260" r="250" className="auto__frame" />
          {radii.map((r, i) => (
            <g key={i} className={`auto__ring ${i === sel ? "is-sel" : ""}`}>
              <circle cx="260" cy="260" r={r} className="auto__band" />
              <circle cx="260" cy="260" r={r} className="auto__scan" style={{ animationDuration: `${14 + i * 6}s` }} />
              {Array.from({ length: 36 }, (_, k) => {
                const a = (k / 36) * Math.PI * 2;
                return <line key={k} x1={260 + Math.cos(a) * (r - 4)} y1={260 + Math.sin(a) * (r - 4)} x2={260 + Math.cos(a) * (r + 4)} y2={260 + Math.sin(a) * (r + 4)} className="auto__tick" />;
              })}
            </g>
          ))}
          <circle cx="260" cy="260" r="60" fill="url(#autoCore)" />
          <g className="auto__lock" transform="translate(260 260)">
            <rect x="-13" y="-4" width="26" height="20" rx="4" />
            <path d="M-8 -4 V-10 a8 8 0 0 1 16 0 V-4" />
          </g>
        </svg>
        <div className="auto__tabs">
          {layers.map((l, i) => (
            <button key={l.key} role="tab" aria-selected={i === sel} className={`auto__tab ${i === sel ? "is-sel" : ""}`} onClick={() => setSel(i)}>
              <span className="mono">L{i + 1}</span>{l.name}
            </button>
          ))}
        </div>
      </div>

      <div className="auto__panel" role="tabpanel">
        <p className="mono auto__lvl">Layer {sel + 1} · {sel === 2 ? "Locked to founder" : sel === 1 ? "Approval gate" : "Delegated"}</p>
        <h3 className="h3">{L.name}</h3>
        <p className="auto__text">{L.text}</p>
        <ul className="auto__ex">
          {L.examples.map((e) => (
            <li key={e}><span>{e}</span><span className={`mono auto__tag t-${L.key}`}>{sel === 0 ? "Executes" : sel === 1 ? "Requests approval" : "Founder only"}</span></li>
          ))}
        </ul>
        <div className="auto__legend">
          {layers.map((l, i) => (
            <button key={l.key} className={i === sel ? "is-sel" : ""} onClick={() => setSel(i)}>
              <i className={`d-${l.key}`} />{l.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
