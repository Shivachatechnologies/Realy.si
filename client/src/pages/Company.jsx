import { Button, PageHero, Reveal, SectionHead } from "../components/ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";
import Pipeline from "../viz/Pipeline.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

export default function Company() {
  const d = useData();
  return (
    <>
      <PageHero eyebrow="Company creation" title={<>From thought<br />to company.</>} lede="Realy turns one sentence into a researched, branded, incorporated company with a product in market — as one continuous system, not a series of vendors.">
        <Button href={d.links.signup} size="lg" arrow>Start with an idea</Button>
        <Button to="/company-setup" variant="ghost" size="lg">Company setup</Button>
      </PageHero>
      <section className="section section--tight section--flush">
        <Pipeline stages={d.pipeline} />
      </section>
      <section className="section section--deep">
        <div className="container">
          <SectionHead eyebrow="Stages" title="Ten stages. Zero handoffs." />
          <Reveal as="ol" className="stages">
            {d.pipeline.map((s, i) => <li key={s.name}><span className="mono">{String(i + 1).padStart(2, "0")}</span><strong>{s.name}</strong><p>{s.out}</p></li>)}
          </Reveal>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
