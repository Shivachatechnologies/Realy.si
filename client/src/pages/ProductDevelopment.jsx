import { Button, PageHero, Reveal, SectionHead } from "../components/ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";
import ProductEngineering from "../viz/ProductEngineering.jsx";
import ConnectFlow from "../viz/ConnectFlow.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

export default function ProductDevelopment() {
  const d = useData();
  const P = d.productEngineering;
  return (
    <>
      <PageHero eyebrow="Product engineering" title={<>If it doesn’t exist,<br />build it.</>} lede={`Landing pages to enterprise platforms — ${P.min} to ${P.max}. Specified, engineered, verified and deployed by the system, with human review where it matters.`}>
        <Button href={d.links.signup} size="lg" arrow>Scope a product</Button>
        <Button to="/marketplace" variant="ghost" size="lg">Or start from the marketplace</Button>
      </PageHero>
      <section className="section section--tight">
        <div className="container">
          <Reveal className="frame"><ProductEngineering data={P} /></Reveal>
          <p className="footnote">Final scope and price are confirmed before any work begins.</p>
        </div>
      </section>
      <section className="section section--deep">
        <div className="container container--wide">
          <SectionHead eyebrow="Already built something?" title="Connect it to Realy." lede="Bring your existing product. The system learns it, then improves, markets and scales it." />
          <Reveal className="frame"><ConnectFlow data={d.connect} /></Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Engineering standard" title="Built to be operated, not just delivered." />
          <Reveal as="ul" className="grid4">
            <li className="tile"><strong>Specified first</strong><p>Every build starts from a written spec and acceptance criteria.</p></li>
            <li className="tile"><strong>Verified</strong><p>Automated tests and review gates before anything ships.</p></li>
            <li className="tile"><strong>Yours</strong><p>You own the code, the data and the deployment.</p></li>
            <li className="tile"><strong>Operated</strong><p>After launch, the workforce keeps improving it.</p></li>
          </Reveal>
        </div>
      </section>
      <FinalCTA title="Describe the product. The system builds it." />
    </>
  );
}
