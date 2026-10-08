import { PageHero, Reveal, SectionHead } from "../components/ui.jsx";
import PricingGrid from "../components/PricingGrid.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

const FAQ = [
  ["What does a plan include?", "Access to the Realy intelligence platform and the digital workforce for your company, at the capacity of your plan."],
  ["Is product engineering included?", "Custom product engineering is scoped and priced separately, from $500 to $100,000+, and confirmed before any work begins."],
  ["Are company formation fees included?", "Government and partner fees for formation vary by jurisdiction and are shown before you proceed."],
  ["Can I change plans?", "Yes. Upgrade or downgrade at any time from the app."],
];

export default function Pricing() {
  return (
    <>
      <PageHero eyebrow="Pricing" title={<>Priced like software.<br />Works like a company.</>} lede="One plan for the intelligence layer and the workforce. No per-seat pricing for digital employees." />
      <section className="section section--tight"><div className="container"><PricingGrid /></div></section>
      <section className="section section--deep">
        <div className="container split">
          <SectionHead eyebrow="Questions" title="Plain answers." />
          <Reveal as="dl" className="faq">
            {FAQ.map(([q, a]) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}
          </Reveal>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
