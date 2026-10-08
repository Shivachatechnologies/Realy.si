import { useSiteData } from "./hooks/useSiteData.js";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Statement from "./components/Statement.jsx";
import Architecture from "./components/Architecture.jsx";
import CommandCenter from "./components/CommandCenter.jsx";
import Differentiator from "./components/Differentiator.jsx";
import CompanySetup from "./components/CompanySetup.jsx";
import ProductScale from "./components/ProductScale.jsx";
import Marketplace from "./components/Marketplace.jsx";
import AIEmployees from "./components/AIEmployees.jsx";
import Autonomy from "./components/Autonomy.jsx";
import Pricing from "./components/Pricing.jsx";
import { FinalCTA, Footer, StickyCTA } from "./components/Footer.jsx";

export default function App() {
  const data = useSiteData();
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav links={data.links} />
      <main id="main">
        <Hero hero={data.hero} links={data.links} />
        <Statement />
        <Architecture />
        <CommandCenter dashboard={data.dashboard} />
        <Differentiator />
        <CompanySetup jurisdictions={data.jurisdictions} />
        <ProductScale products={data.products} />
        <Marketplace marketplace={data.marketplace} />
        <AIEmployees org={data.org} />
        <Autonomy />
        <Pricing pricing={data.pricing} links={data.links} />
        <FinalCTA links={data.links} />
      </main>
      <Footer />
      <StickyCTA links={data.links} />
    </>
  );
}
