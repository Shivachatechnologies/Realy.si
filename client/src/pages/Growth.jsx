import { Button, PageHero, Reveal, SectionHead } from "../components/ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";
import GrowthEngine from "../viz/GrowthEngine.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

const COPY = {
  marketing: {
    eyebrow: "Marketing intelligence",
    title: <>Demand,<br />engineered.</>,
    lede: "The system maps the market, defines the customer, produces content, runs campaigns and captures every lead — then learns from what converts.",
    points: [["Market sensing", "Continuous research on segments, competitors and demand signals."], ["Positioning", "Messaging tested against your ICP before it ships."], ["Content at scale", "Pages, posts, emails and assets for each segment."], ["Campaign control", "Budgets move toward what works, inside the limits you set."]],
  },
  sales: {
    eyebrow: "Sales intelligence",
    title: <>From lead<br />to customer.</>,
    lede: "Every lead is qualified, every sequence personalized, every follow-up sent on time — and every closed deal feeds back into who the system targets next.",
    points: [["Qualification", "Fit and intent scored continuously, not once."], ["Outreach", "Personalized sequences across email and social."], ["Pipeline", "Proposals, meetings and follow-ups managed for you."], ["Expansion", "Onboarding and retention signals routed to the right unit."]],
  },
};

export default function Growth({ focus }) {
  const d = useData();
  const c = COPY[focus];
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} lede={c.lede}>
        <Button href={d.links.signup} size="lg" arrow>Start the engine</Button>
      </PageHero>
      <section className="section section--tight">
        <div className="container">
          <Reveal className="frame frame--wide"><GrowthEngine stages={d.growth} focus={focus} /></Reveal>
        </div>
      </section>
      <section className="section section--deep">
        <div className="container">
          <SectionHead eyebrow="Capabilities" title="One system, not a stack of tools." />
          <Reveal as="ul" className="grid4">
            {c.points.map(([t, x]) => <li key={t} className="tile"><strong>{t}</strong><p>{x}</p></li>)}
          </Reveal>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
