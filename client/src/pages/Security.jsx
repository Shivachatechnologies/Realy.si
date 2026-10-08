import { PageHero, Reveal, SectionHead } from "../components/ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";
import AutonomyControl from "../viz/AutonomyControl.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

const PRINCIPLES = [
  ["Founder-only decisions", "Contracts, funds, capital and ownership can never be executed autonomously."],
  ["Approval gates", "Supervised actions wait for you, with the reasoning and expected impact attached."],
  ["Complete action log", "Every autonomous action is recorded: what, why, when and with which inputs."],
  ["Scoped access", "Connected tools are granted the narrowest permissions each workflow needs."],
  ["Your data, your company", "Your company data is used to run your company — and you can export it."],
  ["Kill switch", "Pause any unit, any workflow or the entire system instantly."],
];

export default function Security() {
  const d = useData();
  return (
    <>
      <PageHero eyebrow="Security & control" title={<>Autonomous.<br />Never unaccountable.</>} lede="Autonomy is only useful if you can trust it. Realy is built so the founder always holds the final authority." />
      <section className="section section--tight">
        <div className="container"><Reveal><AutonomyControl layers={d.autonomy} /></Reveal></div>
      </section>
      <section className="section section--deep">
        <div className="container">
          <SectionHead eyebrow="Principles" title="Control is part of the architecture." />
          <Reveal as="ul" className="grid3">
            {PRINCIPLES.map(([t, x]) => <li key={t} className="tile"><strong>{t}</strong><p>{x}</p></li>)}
          </Reveal>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
