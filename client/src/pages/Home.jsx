import { useRef, useState } from "react";
import { Link } from "react-router";
import { Button, Reveal, SectionHead } from "../components/ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";
import CoreHero from "../viz/CoreHero.jsx";
import SystemTelemetry from "../viz/SystemTelemetry.jsx";
import DecompositionGraph from "../viz/DecompositionGraph.jsx";
import CompanyGraph from "../viz/CompanyGraph.jsx";
import WorkforceMap from "../viz/WorkforceMap.jsx";
import Pipeline from "../viz/Pipeline.jsx";
import ConnectFlow from "../viz/ConnectFlow.jsx";
import CommandCenter from "../viz/CommandCenter.jsx";
import AutonomyControl from "../viz/AutonomyControl.jsx";
import ProductEngineering from "../viz/ProductEngineering.jsx";
import Marketplace from "../viz/Marketplace.jsx";
import GlobalNetwork from "../viz/GlobalNetwork.jsx";
import GrowthEngine from "../viz/GrowthEngine.jsx";
import SystemArchitecture from "../viz/SystemArchitecture.jsx";
import SecurityGrid from "../components/SecurityGrid.jsx";
import PricingGrid from "../components/PricingGrid.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

const More = ({ to, children }) => (
  <Reveal className="more"><Link to={to} className="more__link">{children} <span aria-hidden="true">→</span></Link></Reveal>
);

export default function Home() {
  const d = useData();
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const [active, setActive] = useState(-1);

  return (
    <>
      {/* 01 — Superintelligence Core */}
      <section className="hero dark" data-dark ref={heroRef}>
        <CoreHero systems={d.systems} stageRef={stageRef} containerRef={heroRef} active={active} onSelect={setActive} theme="dark" />
        <div className="hero__scrim" aria-hidden="true" />
        <div className="container hero__copy">
          <Reveal as="p" className="eyebrow">The company intelligence platform</Reveal>
          <Reveal as="h1" className="display hero__title">
            <span>Build your company</span> <span>with superintelligence.</span>
          </Reveal>
          <Reveal as="p" className="lede lede--lg hero__lede">
            From the first idea to a fully operating company, Realy coordinates intelligence across every critical function of your business.
          </Reveal>
          <Reveal className="hero__cta">
            <Button href={d.links.signup} size="lg" arrow magnetic>Start building</Button>
            <Button to="/platform" variant="ghost" size="lg">Explore the system</Button>
          </Reveal>
          <Reveal as="p" className="hero__tag">One founder. One intelligence layer. An entire digital workforce.</Reveal>
        </div>
        <div className="hero__stage" ref={stageRef} aria-hidden="true" />
        <div className="container hero__tel">
          <SystemTelemetry systems={d.systems} active={active} onSelect={setActive} />
        </div>
      </section>

      {/* 02 — Founder command → autonomous execution */}
      <section className="section dark" data-dark id="system">
        <div className="container container--wide">
          <SectionHead
            eyebrow="Superintelligence"
            title={<>Not an AI assistant.<br />An intelligence system.</>}
            lede="Traditional software waits for instructions. Realy understands objectives, decomposes complex goals, coordinates specialized intelligence, executes the work and learns from the results."
          />
          <Reveal className="frame frame--dark"><DecompositionGraph data={d.decomposition} /></Reveal>
          <More to="/superintelligence">How the intelligence system works</More>
        </div>
      </section>

      {/* 03 — Company intelligence graph */}
      <section className="section">
        <div className="container container--wide">
          <SectionHead eyebrow="Company intelligence" title={<>One intelligence layer.<br />Every system of the company.</>} lede="Strategy, product, engineering, marketing, sales, finance and operations share one model of the company — so a change anywhere updates the plan everywhere." />
          <Reveal className="frame"><CompanyGraph data={d.graph} /></Reveal>
          <More to="/platform">Explore the platform</More>
        </div>
      </section>

      {/* 04 — Digital workforce */}
      <section className="section section--deep">
        <div className="container container--wide">
          <SectionHead eyebrow="Digital workforce" title={<>A computational organization.<br />Working in real time.</>} lede="Executives and functions operate as one organization around the intelligence core, each with live state and a clear line of approval back to the founder." />
          <Reveal className="frame frame--bleed"><WorkforceMap data={d.workforce} /></Reveal>
          <More to="/ai-employees">Meet the digital workforce</More>
        </div>
      </section>

      {/* 05 — Idea → company */}
      <section className="section section--flush">
        <div className="container">
          <SectionHead eyebrow="Company creation" title={<>From thought<br />to company.</>} lede="Every stage hands its output to the next. Scroll to watch an idea become an operating company." />
        </div>
        <Pipeline stages={d.pipeline} />
      </section>

      {/* Existing product path */}
      <section className="section section--deep">
        <div className="container container--wide">
          <SectionHead eyebrow="Already built something?" title={<>Connect it to Realy.</>} lede="Bring the systems you already run. Realy builds a model of your product and business, then improves, markets, sells and scales it." />
          <Reveal className="frame"><ConnectFlow data={d.connect} /></Reveal>
        </div>
      </section>

      {/* Product engineering */}
      <section className="section">
        <div className="container container--wide">
          <SectionHead eyebrow="Product engineering" title={<>If it doesn’t exist,<br />build it.</>} lede="Product engineering infrastructure: specified, built, verified and deployed by the system, with human review where it matters." />
          <Reveal className="frame"><ProductEngineering data={d.productEngineering} /></Reveal>
          <More to="/product-development">Explore product engineering</More>
        </div>
      </section>

      {/* Marketplace showroom */}
      <section className="section section--deep">
        <div className="container container--wide">
          <SectionHead eyebrow="Marketplace" title={<>Start with an idea.<br />Or start with a product.</>} lede="Ready-to-launch, white-label software — selected, customized, branded and deployed by the system." />
          <Reveal className="frame"><Marketplace data={d.marketplace} /></Reveal>
          <More to="/marketplace">Browse the marketplace</More>
        </div>
      </section>

      {/* Growth engine */}
      <section className="section">
        <div className="container container--wide">
          <SectionHead eyebrow="Marketing + sales" title={<>One growth engine.<br />From market to customer.</>} lede="Not a stack of tools handing off leads — one connected system that learns from every outcome." />
          <Reveal className="frame"><GrowthEngine stages={d.growth} /></Reveal>
          <div className="more more--pair"><Link to="/marketing" className="more__link">Marketing intelligence →</Link><Link to="/sales" className="more__link">Sales intelligence →</Link></div>
        </div>
      </section>

      {/* 07 — Global company infrastructure */}
      <section className="section dark" data-dark>
        <div className="container container--wide infra">
          <div className="infra__copy">
            <SectionHead eyebrow="Company infrastructure" title={<>From digital idea<br />to real company.</>} lede="Guided workflows for formation, legal, compliance, accounting, banking preparation and operations — across regions." />
            <Reveal as="ul" className="infra__list">
              {d.infrastructure.workflows.map((w) => <li key={w.name}><strong>{w.name}</strong><span>{w.text}</span></li>)}
            </Reveal>
            <p className="footnote">Realy is not a law firm, accounting firm or bank. Filings run through licensed local partners; requirements vary by jurisdiction.</p>
          </div>
          <Reveal className="infra__globe"><GlobalNetwork hubs={d.infrastructure.hubs} theme="dark" /></Reveal>
        </div>
      </section>

      {/* 06 — Command center */}
      <section className="section dark" data-dark>
        <div className="container container--wide">
          <SectionHead eyebrow="Founder command center" title={<>The command center<br />of an autonomous company.</>} lede="Business telemetry and machine intelligence side by side: what the company is doing, what the system is doing, and what needs you." />
          <Reveal className="frame frame--dark"><CommandCenter data={d.commandCenter} /></Reveal>
          <p className="footnote">Demonstration interface. Values are illustrative.</p>
        </div>
      </section>

      {/* Autonomy */}
      <section className="section">
        <div className="container container--wide">
          <SectionHead eyebrow="Autonomy" title={<>Your company<br />can move without you.</>} lede="Three layers of control. You decide what the system does alone, what it prepares for you, and what only you can decide." />
          <Reveal><AutonomyControl layers={d.autonomy} /></Reveal>
        </div>
      </section>

      {/* Platform + security */}
      <section className="section section--deep">
        <div className="container container--wide split">
          <div>
            <SectionHead eyebrow="Platform" title="Five layers. One system." lede="From founder interface to company infrastructure — the architecture of intelligence infrastructure." />
            <More to="/platform">Platform architecture</More>
          </div>
          <Reveal className="frame"><SystemArchitecture /></Reveal>
        </div>
        <div className="container container--wide sec-wrap">
          <SectionHead eyebrow="Security" title="Built to be trusted with a company." />
          <SecurityGrid />
        </div>
      </section>

      {/* Pricing */}
      <section className="section">
        <div className="container container--wide">
          <SectionHead eyebrow="Pricing" title="Priced like software. Works like a company." />
          <PricingGrid />
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
