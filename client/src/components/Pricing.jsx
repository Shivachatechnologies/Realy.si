import { Reveal } from "./ui.jsx";

export default function Pricing({ pricing, links }) {
  return (
    <section className="section section--tint" id="pricing" aria-labelledby="price-h">
      <div className="container">
        <div className="section__head section__head--center">
          <Reveal as="p" className="eyebrow">Pricing</Reveal>
          <Reveal as="h2" id="price-h" className="h2">Simple pricing for an entire team.</Reveal>
        </div>
        <div className="pricing">
          {pricing.map((p) => (
            <Reveal as="article" key={p.plan} className={`card plan ${p.recommended ? "plan--rec" : ""}`}>
              {p.recommended && <span className="plan__badge">Recommended</span>}
              <h3 className="plan__name">{p.name}</h3>
              <div className="plan__price"><strong>{p.price}</strong>{p.period && <span>{p.period}</span>}</div>
              <p className="plan__blurb">{p.blurb}</p>
              <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
              <a
                className={`btn ${p.recommended ? "btn--primary" : "btn--ghost"}`}
                href={`${links.signup}?plan=${encodeURIComponent(p.plan)}`}
              >{p.cta || "Start Building"}</a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
