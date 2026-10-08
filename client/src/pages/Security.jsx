import { PageHero, Reveal, SectionHead } from "../components/ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";
import AutonomyControl from "../viz/AutonomyControl.jsx";
import SecurityGrid from "../components/SecurityGrid.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

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
          <SectionHead eyebrow="Security architecture" title="Control is part of the architecture." />
          <SecurityGrid />
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
