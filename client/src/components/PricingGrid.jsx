import { Button, Reveal } from "./ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";

export default function PricingGrid() {
  const { pricing, links } = useData();
  return (
    <div className="pricing">
      {pricing.map((p) => (
        <Reveal as="article" key={p.plan} className={`plan ${p.recommended ? "plan--rec" : ""}`}>
          <div className="plan__top">
            <h3 className="plan__name">{p.name}</h3>
            {p.recommended && <span className="plan__badge mono">Recommended</span>}
          </div>
          <div className="plan__price"><strong>{p.price}</strong>{p.period && <span>{p.period}</span>}</div>
          <p className="plan__blurb">{p.blurb}</p>
          <ul className="plan__list">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
          <Button href={`${links.signup}?plan=${encodeURIComponent(p.plan)}`} variant={p.recommended ? "primary" : "ghost"} className="plan__cta">
            {p.cta || "Start building"}
          </Button>
        </Reveal>
      ))}
    </div>
  );
}
