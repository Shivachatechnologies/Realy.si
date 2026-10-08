import { Button, PageHero, Reveal } from "../components/ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";
import Marketplace from "../viz/Marketplace.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

export default function MarketplacePage() {
  const d = useData();
  return (
    <>
      <PageHero eyebrow="Marketplace" title={<>Start with intelligence.<br />Or start with a product.</>} lede={`${d.marketplace.total} ready-to-launch, white-label products. Discover, customize, brand, deploy, launch and scale — with the workforce operating it from day one.`}>
        <Button href={d.links.signup} size="lg" arrow>Browse in the app</Button>
      </PageHero>
      <section className="section section--tight">
        <div className="container">
          <Reveal className="frame"><Marketplace data={d.marketplace} /></Reveal>
          <p className="footnote">Listings shown are representative. The full catalog is available in the app.</p>
        </div>
      </section>
      <FinalCTA title="Launch a product this week." />
    </>
  );
}
