import { useState } from "react";
import { Button, PageHero, Reveal, SectionHead } from "../components/ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";
import GlobalNetwork from "../viz/GlobalNetwork.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

const FLOW = ["Idea", "Jurisdiction", "Entity", "Documents", "Registration", "Operations"];

export default function CompanySetup() {
  const d = useData();
  const I = d.infrastructure;
  const [hub, setHub] = useState(I.hubs[0].id);
  const H = I.hubs.find((h) => h.id === hub) || I.hubs[0];
  return (
    <>
      <PageHero eyebrow="Company setup" title={<>From digital idea<br />to real company.</>} lede="Choose where to build. Realy prepares the entity, documents and filings, then sets up the operations a real company needs on day one." visual={<GlobalNetwork hubs={I.hubs} />}>
        <Button href={d.links.signup} size="lg" arrow>Start formation</Button>
      </PageHero>

      <section className="section section--tight">
        <div className="container">
          <Reveal as="ol" className="flow">
            {FLOW.map((f, i) => <li key={f}><span className="mono">{String(i + 1).padStart(2, "0")}</span>{f}</li>)}
          </Reveal>
          <Reveal className="jur">
            <div className="jur__pick" role="radiogroup" aria-label="Region">
              {I.hubs.map((h) => <button key={h.id} role="radio" aria-checked={h.id === hub} className="chip" onClick={() => setHub(h.id)}>{h.name}</button>)}
              <span className="chip chip--ghost">Global — more regions</span>
            </div>
            <div className="jur__card" aria-live="polite">
              <div><span className="mono">Region</span><strong>{H.name}</strong></div>
              <div><span className="mono">Typical structure</span><strong key={H.id} className="swap">{H.entity}</strong></div>
              <div><span className="mono">Filing</span><span>Through licensed local partners</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--deep">
        <div className="container">
          <SectionHead eyebrow="Infrastructure" title="Everything a company runs on." />
          <Reveal as="ul" className="grid3">
            {I.workflows.map((w) => <li key={w.name} className="tile"><strong>{w.name}</strong><p>{w.text}</p></li>)}
          </Reveal>
          <p className="footnote">Realy is not a law firm, accounting firm or bank and does not provide legal, tax or financial advice. Formation and filings are carried out with licensed local partners; availability and requirements vary by jurisdiction. Banking preparation does not guarantee account approval.</p>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
