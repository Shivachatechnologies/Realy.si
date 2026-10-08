import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import { SiteDataProvider } from "./hooks/useSiteData.jsx";
import { usePageMeta } from "./hooks/usePageMeta.js";

const Platform = lazy(() => import("./pages/Platform.jsx"));
const Superintelligence = lazy(() => import("./pages/Superintelligence.jsx"));
const Workforce = lazy(() => import("./pages/Workforce.jsx"));
const Company = lazy(() => import("./pages/Company.jsx"));
const ProductDevelopment = lazy(() => import("./pages/ProductDevelopment.jsx"));
const MarketplacePage = lazy(() => import("./pages/MarketplacePage.jsx"));
const Growth = lazy(() => import("./pages/Growth.jsx"));
const CompanySetup = lazy(() => import("./pages/CompanySetup.jsx"));
const Pricing = lazy(() => import("./pages/Pricing.jsx"));
const Security = lazy(() => import("./pages/Security.jsx"));
const Resources = lazy(() => import("./pages/Resources.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}

function Shell() {
  usePageMeta();
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <ScrollManager />
      <Nav />
      <main id="main">
        <Suspense fallback={<div className="route-loading" aria-hidden="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/superintelligence" element={<Superintelligence />} />
            <Route path="/ai-employees" element={<Workforce />} />
            <Route path="/company" element={<Company />} />
            <Route path="/product-development" element={<ProductDevelopment />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketing" element={<Growth focus="marketing" key="marketing" />} />
            <Route path="/sales" element={<Growth focus="sales" key="sales" />} />
            <Route path="/company-setup" element={<CompanySetup />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/security" element={<Security />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <Shell />
    </SiteDataProvider>
  );
}
