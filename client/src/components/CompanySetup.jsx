import { useRef, useState } from "react";
import { Reveal, Tick } from "./ui.jsx";

const STEPS = ["Idea", "Jurisdiction", "Entity", "Documents", "Registration", "Operations"];
const PREPARES = [
  "Entity recommendation for your goals",
  "Formation documents for your review",
  "Partner-led filing and registration",
  "Day-one operations: domain, email, workspace",
];

export default function CompanySetup({ jurisdictions }) {
  const [selId, setSelId] = useState(jurisdictions[0]?.id);
  const chips = useRef([]);
  const idx = Math.max(0, jurisdictions.findIndex((j) => j.id === selId));
  const j = jurisdictions[idx];

  const onKey = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const n = (idx + step + jurisdictions.length) % jurisdictions.length;
    setSelId(jurisdictions[n].id);
    chips.current[n]?.focus();
  };

  return (
    <section className="section section--tint" id="setup" aria-labelledby="setup-h">
      <div className="container">
        <div className="section__head">
          <Reveal as="p" className="eyebrow">Company setup</Reveal>
          <Reveal as="h2" id="setup-h" className="h2">From idea to incorporated company.</Reveal>
          <Reveal as="p" className="sub">
            Choose a jurisdiction, and Realy prepares the entity, documents and filings, then sets up the operations
            your company needs on day one.
          </Reveal>
        </div>

        <Reveal as="ol" className="flow" aria-label="Company setup workflow">
          {STEPS.map((s, i) => <li key={s}><span className="mono">{String(i + 1).padStart(2, "0")}</span>{s}</li>)}
        </Reveal>

        <Reveal className="setup">
          <div className="setup__pick">
            <p className="mono muted setup__k">Jurisdiction</p>
            <div className="chips" role="radiogroup" aria-label="Jurisdiction" onKeyDown={onKey}>
              {jurisdictions.map((x, i) => (
                <button
                  key={x.id}
                  ref={(el) => (chips.current[i] = el)}
                  className="chip"
                  role="radio"
                  aria-checked={x.id === j?.id}
                  tabIndex={x.id === j?.id ? 0 : -1}
                  onClick={() => setSelId(x.id)}
                >{x.name}</button>
              ))}
            </div>
            <p className="mono muted setup__k setup__k--gap">What Realy prepares</p>
            <ul className="setup__list">{PREPARES.map((p) => <li key={p}><Tick />{p}</li>)}</ul>
          </div>
          {j && (
            <div className="setup__card panel" aria-live="polite">
              <div className="setup__row"><span className="muted">Entity</span><strong className="fade-swap" key={`e-${j.id}`}>{j.entity}</strong></div>
              <div className="setup__row"><span className="muted">Note</span><span className="fade-swap" key={`n-${j.id}`}>{j.note}</span></div>
              <div className="setup__row"><span className="muted">Documents</span><span>Formation documents prepared for your review</span></div>
              <div className="setup__row"><span className="muted">Filing</span><span>Submitted through licensed local partners</span></div>
            </div>
          )}
        </Reveal>
        <p className="footnote">
          Realy is not a law firm and does not provide legal or tax advice. Company formation and filings are carried
          out with licensed local partners; availability and requirements vary by jurisdiction.
        </p>
      </div>
    </section>
  );
}
