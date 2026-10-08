import { Button, PageHero, Reveal, SectionHead } from "../components/ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";
import WorkforceMap from "../viz/WorkforceMap.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

const ROLES = [
  ["CEO", "Sets direction, prioritizes objectives and reports to the founder."],
  ["CTO", "Owns architecture, engineering velocity and reliability."],
  ["CMO", "Owns positioning, brand, demand and channels."],
  ["CFO", "Owns budget, forecasting, runway and pricing."],
  ["COO", "Owns processes, vendors and company operations."],
  ["Product", "Specs, roadmap and success metrics."],
  ["Engineering", "Builds, tests and ships."],
  ["Design", "Interfaces, identity and assets."],
  ["Research", "Markets, competitors and customers."],
  ["Marketing", "Content, campaigns and growth loops."],
  ["Sales", "Pipeline, outreach and closing support."],
  ["Finance", "Bookkeeping structure and reporting."],
  ["Legal", "Drafts and workflows for qualified review."],
  ["Operations", "Tools, workflows and vendors."],
  ["Support", "Customer resolution, around the clock."],
];

export default function Workforce() {
  const d = useData();
  return (
    <>
      <PageHero eyebrow="Digital workforce" title={<>A living<br />digital organization.</>} lede="Fifteen units around one intelligence core. They think, plan, execute, analyze and optimize together — and wait for you when a decision is yours.">
        <Button href={d.links.signup} size="lg" arrow>Assemble your workforce</Button>
      </PageHero>
      <section className="section section--tight">
        <div className="container">
          <Reveal className="frame frame--bleed"><WorkforceMap data={d.workforce} /></Reveal>
          <p className="footnote">Live statuses are simulated for demonstration.</p>
        </div>
      </section>
      <section className="section section--deep">
        <div className="container">
          <SectionHead eyebrow="Roles" title="Every function. One organization." />
          <Reveal as="ul" className="roles">
            {ROLES.map(([r, t], i) => <li key={r} className={i < 5 ? "is-exec" : ""}><span className="mono">{i < 5 ? "Executive" : "Function"}</span><strong>{r}</strong><p>{t}</p></li>)}
          </Reveal>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
