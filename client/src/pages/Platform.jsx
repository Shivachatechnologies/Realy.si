import { Button, PageHero, Reveal, SectionHead } from "../components/ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";
import SystemArchitecture from "../viz/SystemArchitecture.jsx";
import CommandCenter from "../viz/CommandCenter.jsx";
import AutonomyControl from "../viz/AutonomyControl.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

const PRINCIPLES = [
  ["One intelligence", "Every function shares one memory, one plan and one view of the company — no silos, no handoffs."],
  ["Objectives, not prompts", "You set outcomes. The system decomposes them into work, schedules it and verifies the results."],
  ["Verifiable by design", "Every autonomous action is logged with its reasoning, inputs and outcome."],
  ["Founder authority", "Approval gates and founder-only decisions are part of the architecture, not a setting."],
];

export default function Platform() {
  const d = useData();
  return (
    <>
      <PageHero eyebrow="Platform" title={<>The intelligence layer<br />for companies.</>} lede="Realy is a single system: a founder interface, an intelligence core, an orchestration layer, a digital workforce and the company infrastructure underneath.">
        <Button href={d.links.signup} size="lg" arrow>Start building</Button>
        <Button to="/superintelligence" variant="ghost" size="lg">How it thinks</Button>
      </PageHero>

      <section className="section section--tight">
        <div className="container split">
          <SectionHead eyebrow="Architecture" title="Five layers. One system." lede="Signals move down the stack as instructions and back up as results, metrics and decisions that need you." />
          <Reveal className="frame"><SystemArchitecture /></Reveal>
        </div>
      </section>

      <section className="section section--deep">
        <div className="container">
          <SectionHead eyebrow="Principles" title="Engineered, not assembled." />
          <Reveal as="ul" className="grid4">
            {PRINCIPLES.map(([t, x]) => <li key={t} className="tile"><strong>{t}</strong><p>{x}</p></li>)}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Founder command center" title="See everything. Decide what matters." />
          <Reveal className="frame frame--wide"><CommandCenter data={d.commandCenter} /></Reveal>
          <p className="footnote">Demonstration interface. Values are illustrative.</p>
        </div>
      </section>

      <section className="section section--deep">
        <div className="container">
          <SectionHead eyebrow="Control" title="Autonomy with boundaries." />
          <Reveal><AutonomyControl layers={d.autonomy} /></Reveal>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
