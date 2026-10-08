import { PageHero, Reveal } from "../components/ui.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

const ITEMS = [
  ["Documentation", "How the platform, workforce and controls work.", "Guide"],
  ["Founder playbooks", "From idea to first customers, step by step.", "Playbook"],
  ["Company setup guides", "Choosing a jurisdiction and entity structure.", "Guide"],
  ["Autonomy design", "Deciding what to delegate, supervise and keep.", "Essay"],
  ["Product engineering", "Writing specs the system can build from.", "Guide"],
  ["Changelog", "What shipped, and what changed.", "Updates"],
];

export default function Resources() {
  return (
    <>
      <PageHero eyebrow="Resources" title={<>Learn the system.<br />Build faster.</>} lede="Guides, playbooks and documentation for building companies with Realy." />
      <section className="section section--tight">
        <div className="container">
          <Reveal as="ul" className="grid3">
            {ITEMS.map(([t, x, k]) => <li key={t} className="tile tile--res"><span className="mono">{k}</span><strong>{t}</strong><p>{x}</p><span className="mono soon">Coming soon</span></li>)}
          </Reveal>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
