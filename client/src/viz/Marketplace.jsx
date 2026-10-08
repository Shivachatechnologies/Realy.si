import { useState } from "react";

const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2);

/** Marketplace interface. Listings are placeholders until the catalog is connected. */
export default function Marketplace({ data, limit }) {
  const [cat, setCat] = useState("All");
  const [stage, setStage] = useState(0);
  const cats = ["All", ...data.categories];
  let items = cat === "All" ? data.items : data.items.filter((x) => x.category === cat);
  if (limit) items = items.slice(0, limit);

  return (
    <div className="mk">
      <div className="mk__top">
        <ol className="mk__life" aria-label="Product lifecycle">
          {data.lifecycle.map((l, i) => (
            <li key={l}>
              <button className={i <= stage ? "is-on" : ""} onClick={() => setStage(i)} aria-pressed={i === stage}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>{l}
              </button>
            </li>
          ))}
        </ol>
        <div className="mk__count"><strong>{data.total}</strong><span>ready-to-launch products</span></div>
      </div>

      <div className="mk__filters" role="toolbar" aria-label="Filter by category">
        {cats.map((c) => <button key={c} className="chip" aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
      </div>

      <ul className="mk__grid" key={cat}>
        {items.map((p, i) => (
          <li key={p.name} className="mk__item" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
            <div className="mk__head">
              <span className="mk__glyph" aria-hidden="true">{initials(p.name)}</span>
              <span className="mono mk__cat">{p.category}</span>
            </div>
            <strong>{p.name}</strong>
            <span className="mk__desc">{p.desc}</span>
            <div className="mk__foot mono"><span>White-label</span><span className="mk__state">{data.lifecycle[stage]} →</span></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
