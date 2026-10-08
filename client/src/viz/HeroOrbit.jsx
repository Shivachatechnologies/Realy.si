/**
 * Decorative orbital system for sub-page heroes (pure SVG + CSS animation).
 * `label` shows the current route as a system readout.
 */
export default function HeroOrbit({ label = "system" }) {
  const rings = [210, 160, 112, 66];
  return (
    <div className="horbit" aria-hidden="true">
      <svg viewBox="0 0 520 520">
        <defs>
          <radialGradient id="horbitCore" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#cfe0ff" stopOpacity=".9" />
            <stop offset=".25" stopColor="#1764ff" stopOpacity=".55" />
            <stop offset="1" stopColor="#1764ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <line x1="260" y1="20" x2="260" y2="500" className="horbit__axis" />
        <line x1="20" y1="260" x2="500" y2="260" className="horbit__axis" />
        {rings.map((r, i) => (
          <g key={r} className={`horbit__ring horbit__ring--${i}`}>
            <circle cx="260" cy="260" r={r} />
            <circle cx={260 + r} cy="260" r={i === 0 ? 4 : 3} className="horbit__node" />
            {i % 2 === 0 && <circle cx={260 - r * 0.7071} cy={260 - r * 0.7071} r="2.5" className="horbit__node horbit__node--dim" />}
          </g>
        ))}
        <circle cx="260" cy="260" r="70" fill="url(#horbitCore)" className="horbit__core" />
        <circle cx="260" cy="260" r="6" fill="#eef3ff" />
      </svg>
      <div className="horbit__readout mono">
        <span>realy://{label}</span>
        <span><i />online</span>
      </div>
    </div>
  );
}
