import { Button, PageHero, Reveal, SectionHead } from "../components/ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";
import DecompositionGraph from "../viz/DecompositionGraph.jsx";
import ReasoningTrace from "../viz/ReasoningTrace.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

export default function Superintelligence() {
  const d = useData();
  return (
    <>
      <PageHero eyebrow="Superintelligence" title={<>Not an AI assistant.<br />An intelligence system.</>} lede="Give Realy one objective. It decomposes it into hundreds of coordinated actions, executes them across every function, and keeps optimizing after the first result.">
        <Button href={d.links.signup} size="lg" arrow>Give it an objective</Button>
      </PageHero>

      <section className="section dark" data-dark>
        <div className="container container--wide">
          <SectionHead eyebrow="Decomposition" title={<>One instruction.<br />Hundreds of tasks.</>} lede="“Launch my company.” becomes strategy, research, brand, product, engineering, marketing, sales, operations and growth — executing in parallel. Hover a stage to see its work." />
          <Reveal className="frame frame--dark"><DecompositionGraph data={d.decomposition} /></Reveal>
        </div>
      </section>

      <section className="section section--deep">
        <div className="container">
          <SectionHead eyebrow="Capabilities" title="Seven capabilities. One loop." />
          <Reveal as="ol" className="caps caps--loop">
            {d.capabilities.map((c, i) => <li key={c.name}><span className="mono">{String(i + 1).padStart(2, "0")}</span><strong>{c.name}</strong><p>{c.text}</p></li>)}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <SectionHead eyebrow="Machine reasoning" title="Every decision shows its work." lede="Realy records what it read, what it concluded, what it decided and why — so you can audit any action, at any time." />
          <Reveal className="frame"><ReasoningTrace /></Reveal>
        </div>
      </section>
      <FinalCTA title="Give the system an objective." />
    </>
  );
}
