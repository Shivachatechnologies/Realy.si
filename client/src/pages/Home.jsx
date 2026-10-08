import { useRef } from "react";
import { Link } from "react-router";
import { Button, Reveal, SectionHead } from "../components/ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";
import CoreHero from "../viz/CoreHero.jsx";
import DecompositionGraph from "../viz/DecompositionGraph.jsx";
import WorkforceMap from "../viz/WorkforceMap.jsx";
import Pipeline from "../viz/Pipeline.jsx";
import CommandCenter from "../viz/CommandCenter.jsx";
import AutonomyControl from "../viz/AutonomyControl.jsx";
import ProductEngineering from "../viz/ProductEngineering.jsx";
import Marketplace from "../viz/Marketplace.jsx";
import GlobalNetwork from "../viz/GlobalNetwork.jsx";
import GrowthEngine from "../viz/GrowthEngine.jsx";
import PricingGrid from "../components/PricingGrid.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

const More = ({ to, children }) => (
  <Reveal className="more"><Link to={to} className="more__link">{children} <span aria-hidden="true">→</span></Link></Reveal>
);

export default function Home() {
  const d = useData();
  const heroRef = useRef(null);
  const stageRef = useRef(null);

  return (
    <>
      {/* ------------------------------------------------------------ HERO */}
      <section className="hero" ref={heroRef}>
        <CoreHero functions={d.functions} stageRef={stageRef} containerRef={heroRef} />
        <div className="hero__scrim" aria-hidden="true" />
        <div className="container hero__copy">
          <Reveal as="p" className="eyebrow">The company intelligence platform</Reveal>
          <Reveal as="h1" className="display hero__title">
            <span>Build your company</span> <span>with superintelligence.</span>
          </Reveal>
          <Reveal as="p" className="lede lede--lg hero__lede">
            From a single idea to a fully operating company, Realy coordinates intelligence across product,
            engineering, marketing, sales, finance and operations.
          </Reveal>
          <Reveal className="hero__cta">
            <Button href={d.links.signup} size="lg" arrow>Start building</Button>
            <Button to="/platform" variant="ghost" size="lg">Explore the system</Button>
          </Reveal>
          <Reveal as="p" className="hero__tag mono">One founder · One intelligence layer · An entire digital workforce</Reveal>
        </div>
        <div className="hero__stage" ref={stageRef} aria-hidden="true" />
      </section>

      {/* ------------------------------------------------------------ SIGNAL */}
      <section className="signal">
        <div className="container signal__inner">
          <Reveal as="p" className="signal__lead">The intelligence layer for the next generation of companies.</Reveal>
          <Reveal as="ul" className="signal__terms mono">
            <li>Company intelligence</li><li>Autonomous systems</li><li>Digital workforce</li><li>Intelligence infrastructure</li><li>Machine intelligence</li>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ SUPERINTELLIGENCE */}
      <section className="section section--deep" id="system">
        <div className="container">
          <SectionHead
            eyebrow="Superintelligence"
            title={<>Not an assistant.<br />An intelligence system.</>}
            lede="A chatbot answers questions. Realy runs a company: it researches, reasons, plans, creates, executes, monitors and optimizes — continuously, across every function."
          />
          <Reveal as="ol" className="caps">
            {d.capabilities.map((c, i) => (
              <li key={c.name}><span className="mono">{String(i + 1).padStart(2, "0")}</span><strong>{c.name}</strong><p>{c.text}</p></li>
            ))}
          </Reveal>
          <Reveal className="frame frame--wide"><DecompositionGraph data={d.decomposition} /></Reveal>
          <More to="/superintelligence">How the intelligence system works</More>
        </div>
      </section>

      {/* ------------------------------------------------------------ WORKFORCE */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Digital workforce"
            title={<>A living organization.<br />Engineered around you.</>}
            lede="Executives and functions operate as one system around the intelligence core — each with live status, shared memory and a clear line of approval back to the founder."
          />
          <Reveal className="frame frame--bleed"><WorkforceMap data={d.workforce} /></Reveal>
          <More to="/ai-employees">Meet the digital workforce</More>
        </div>
      </section>

      {/* ------------------------------------------------------------ COMPANY */}
      <section className="section section--deep">
        <div className="container">
          <SectionHead eyebrow="Company creation" title={<>From thought<br />to company.</>} lede="One continuous pipeline. Every stage hands its output to the next — without a single handoff meeting." />
          <Reveal className="frame frame--wide"><Pipeline stages={d.pipeline} /></Reveal>
          <More to="/company">See the full transformation</More>
        </div>
      </section>

      {/* ------------------------------------------------------------ COMMAND CENTER */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Founder command center" title={<>Your autonomous company,<br />in one view.</>} lede="Business telemetry and machine intelligence side by side: what the company is doing, what the system is doing, and what needs you." />
          <Reveal className="frame frame--wide"><CommandCenter data={d.commandCenter} /></Reveal>
          <p className="footnote">Demonstration interface. Values are illustrative.</p>
        </div>
      </section>

      {/* ------------------------------------------------------------ AUTONOMY */}
      <section className="section section--deep">
        <div className="container">
          <SectionHead eyebrow="Autonomy" title={<>Your company<br />can move without you.</>} lede="Three layers of control. You decide what the system does alone, what it prepares for you, and what only you can decide." />
          <Reveal><AutonomyControl layers={d.autonomy} /></Reveal>
          <More to="/security">Security &amp; control</More>
        </div>
      </section>

      {/* ------------------------------------------------------------ PRODUCT ENGINEERING */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Product engineering" title={<>If it doesn’t exist,<br />build it.</>} lede="From a launch page to an enterprise platform, specified and engineered by the system — with human review where it matters." />
          <Reveal className="frame"><ProductEngineering data={d.productEngineering} /></Reveal>
          <More to="/product-development">Explore product engineering</More>
        </div>
      </section>

      {/* ------------------------------------------------------------ MARKETPLACE */}
      <section className="section section--deep">
        <div className="container">
          <SectionHead eyebrow="Marketplace" title={<>Start with intelligence.<br />Or start with a product.</>} lede="Ready-to-launch, white-label software — discovered, customized, branded and deployed by the system." />
          <Reveal className="frame"><Marketplace data={d.marketplace} limit={10} /></Reveal>
          <More to="/marketplace">Browse the marketplace</More>
        </div>
      </section>

      {/* ------------------------------------------------------------ INFRASTRUCTURE */}
      <section className="section">
        <div className="container infra">
          <div className="infra__copy">
            <SectionHead eyebrow="Global company infrastructure" title={<>From digital idea<br />to real company.</>} lede="Formation, legal workflows, compliance, accounting, banking preparation and operations — coordinated across regions." />
            <Reveal as="ul" className="infra__list">
              {d.infrastructure.workflows.map((w) => <li key={w.name}><strong>{w.name}</strong><span>{w.text}</span></li>)}
            </Reveal>
            <More to="/company-setup">Company setup</More>
          </div>
          <Reveal className="infra__globe"><GlobalNetwork hubs={d.infrastructure.hubs} /></Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ GROWTH */}
      <section className="section section--deep">
        <div className="container">
          <SectionHead eyebrow="Marketing + sales" title={<>One growth engine.<br />From market to customer.</>} lede="Marketing and sales are not two teams handing off leads. They are one connected system that learns from every outcome." />
          <Reveal className="frame frame--wide"><GrowthEngine stages={d.growth} /></Reveal>
          <div className="more more--pair"><Link to="/marketing" className="more__link">Marketing intelligence →</Link><Link to="/sales" className="more__link">Sales intelligence →</Link></div>
        </div>
      </section>

      {/* ------------------------------------------------------------ PRICING */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Pricing" title="Priced like software. Works like a company." align="center" />
          <PricingGrid />
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
