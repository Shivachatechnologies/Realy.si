import { useMemo, useState } from "react";

/* Category-specific product previews, drawn in SVG/CSS (no stock imagery). */
function Preview({ category, name }) {
  const bars = useMemo(() => Array.from({ length: 24 }, (_, i) => 30 + Math.round(40 * Math.abs(Math.sin(i * 0.7 + name.length)))), [name]);
  const line = bars.map((v, i) => `${(i / 23) * 300},${110 - v}`).join(" ");
  switch (category) {
    case "Trading":
      return (
        <svg viewBox="0 0 300 120" className="pv pv--chart" aria-hidden="true">
          {bars.map((v, i) => {
            const up = i % 3 !== 1, x = 6 + i * 12.2;
            return <g key={i} className={up ? "up" : "dn"}><line x1={x} x2={x} y1={100 - v - 12} y2={100 - v + 18} /><rect x={x - 3.5} y={100 - v} width="7" height="12" /></g>;
          })}
        </svg>
      );
    case "FinTech":
      return (
        <div className="pv pv--fin" aria-hidden="true">
          <div className="pv__bal"><span>Balance</span><strong>$24,180.40</strong></div>
          <svg viewBox="0 0 300 60" preserveAspectRatio="none"><polyline points={line.replace(/,(\d+)/g, (m, y) => `,${Number(y) / 2}`)} /></svg>
          <ul><li><span>Card ·· 4821</span><b>−$42.00</b></li><li><span>Payout</span><b className="pos">+$1,200.00</b></li></ul>
        </div>
      );
    case "Web3":
      return (
        <div className="pv pv--web3" aria-hidden="true">
          <div className="pv__tok"><i /><div><strong>NOVA</strong><span>Vesting · 38% unlocked</span></div></div>
          <div className="pv__prog"><span style={{ width: "38%" }} /></div>
          <div className="pv__chips"><span>Claim</span><span>Stake</span><span>Bridge</span></div>
        </div>
      );
    case "AI":
      return (
        <div className="pv pv--ai" aria-hidden="true">
          <div className="pv__msg pv__msg--u">Summarize this week’s support tickets</div>
          <div className="pv__msg">118 resolved · 3 escalations · top issue: billing export</div>
          <div className="pv__tools"><span>search_tickets</span><span>classify</span><span>draft_reply</span></div>
        </div>
      );
    case "Gaming":
      return (
        <div className="pv pv--game" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => <div key={i} className="pv__tile"><i />{["Arena", "Puzzle", "Cards", "Race", "Quiz", "Tower", "Words", "Dice"][i]}</div>)}
        </div>
      );
    case "Marketplace":
      return (
        <div className="pv pv--mkt" aria-hidden="true">
          {["Design review", "Logo pack", "Copywriting", "Data cleanup"].map((t, i) => (
            <div key={t} className="pv__listing"><i /><div><strong>{t}</strong><span>from ${(i + 1) * 45}</span></div><b>★ 4.{9 - i}</b></div>
          ))}
        </div>
      );
    default:
      return (
        <div className="pv pv--saas" aria-hidden="true">
          <div className="pv__kpis"><div><span>MRR</span><strong>$31.6k</strong></div><div><span>Seats</span><strong>412</strong></div><div><span>Churn</span><strong>1.8%</strong></div></div>
          <svg viewBox="0 0 300 70" preserveAspectRatio="none"><polyline points={line.replace(/,(\d+)/g, (m, y) => `,${Number(y) * 0.55}`)} /></svg>
        </div>
      );
  }
}

/**
 * Marketplace showroom: a large live preview of the selected product, the
 * lifecycle to launch it, and the catalog to browse. Listings are placeholders
 * until the real catalog is connected.
 */
export default function Marketplace({ data, limit }) {
  const [cat, setCat] = useState("All");
  const [sel, setSel] = useState(0);
  const [stage, setStage] = useState(0);
  const cats = ["All", ...data.categories];
  let items = cat === "All" ? data.items : data.items.filter((x) => x.category === cat);
  if (limit) items = items.slice(0, limit);
  const P = items[Math.min(sel, items.length - 1)] || data.items[0];

  return (
    <div className="sr">
      <div className="sr__show">
        <div className="sr__meta">
          <span className="sr__cat">{P.category} · White-label</span>
          <h3 className="sr__name">{P.name}</h3>
          <p className="sr__desc">{P.desc}</p>
          <ol className="sr__life" aria-label="Launch lifecycle">
            {data.lifecycle.map((l, i) => (
              <li key={l}><button className={i <= stage ? "is-on" : ""} aria-pressed={i === stage} onClick={() => setStage(i)}>{l}</button></li>
            ))}
          </ol>
          <p className="sr__stage">Next: <strong>{data.lifecycle[stage]}</strong> — {[
            "browse ready-to-launch products by category.",
            "choose the product that fits your business.",
            "configure features, plans and workflows.",
            "apply your name, identity and domain.",
            "deploy to production infrastructure.",
            "go live with launch content and channels.",
            "the workforce operates and grows it.",
          ][stage] || "the workforce operates and grows it."}</p>
        </div>
        <div className="sr__screen">
          <div className="sr__chrome"><i /><i /><i /><span>{P.name.toLowerCase().replace(/\s+/g, "")}.app</span></div>
          <div className="sr__view" key={P.name}><Preview category={P.category} name={P.name} /></div>
        </div>
      </div>

      <div className="sr__browse">
        <div className="sr__filters" role="toolbar" aria-label="Filter by category">
          {cats.map((c) => <button key={c} className="chip" aria-pressed={c === cat} onClick={() => { setCat(c); setSel(0); }}>{c}</button>)}
          <span className="sr__total"><strong>{data.total}</strong> ready-to-launch products</span>
        </div>
        <ul className="sr__list">
          {items.map((p, i) => (
            <li key={p.name}>
              <button className={p === P ? "is-sel" : ""} aria-pressed={p === P} onClick={() => setSel(i)} onMouseEnter={() => setSel(i)}>
                <strong>{p.name}</strong><span>{p.category}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
