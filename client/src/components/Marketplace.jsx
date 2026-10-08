import { useState } from "react";
import { Reveal } from "./ui.jsx";

const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2);

export default function Marketplace({ marketplace }) {
  const [cat, setCat] = useState("All");
  const cats = ["All", ...marketplace.categories];
  const items = cat === "All" ? marketplace.items : marketplace.items.filter((x) => x.category === cat);

  return (
    <section className="section section--tint" id="marketplace" aria-labelledby="mkt-h">
      <div className="container">
        <div className="section__head section__head--split">
          <div>
            <Reveal as="p" className="eyebrow">White-label marketplace</Reveal>
            <Reveal as="h2" id="mkt-h" className="h2">Start with software that’s already built.</Reveal>
          </div>
          <Reveal as="p" className="mkt__count"><strong>{marketplace.total}</strong><span>ready-to-launch products</span></Reveal>
        </div>

        <Reveal className="market">
          <div className="chips chips--scroll" role="toolbar" aria-label="Filter by category">
            {cats.map((c) => (
              <button key={c} className="chip" aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <ul className="market__grid" key={cat}>
            {items.map((p, i) => (
              <li className="prod" key={p.name} style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }}>
                <div className="prod__top">
                  <span className="prod__glyph" aria-hidden="true">{initials(p.name)}</span>
                  <span className="prod__cat">{p.category}</span>
                </div>
                <div className="prod__name">{p.name}</div>
                <div className="prod__desc">{p.desc}</div>
                <div className="prod__foot"><span>White-label · Ready to launch</span><b aria-hidden="true">→</b></div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
