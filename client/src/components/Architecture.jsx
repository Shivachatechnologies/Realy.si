import { Mark, Reveal } from "./ui.jsx";

const DEPTS = ["Strategy", "Product", "Engineering", "Marketing", "Sales", "Operations"];

export default function Architecture() {
  return (
    <section className="section" id="platform" aria-labelledby="arch-h">
      <div className="container">
        <div className="section__head">
          <Reveal as="p" className="eyebrow">Platform</Reveal>
          <Reveal as="h2" id="arch-h" className="h2">One founder.<br />An entire AI team.</Reveal>
          <Reveal as="p" className="sub">
            Realy is structured like a company, not a chatbot. You set direction. An AI executive layer plans. An
            orchestrator routes work to specialized teams that execute.
          </Reveal>
        </div>

        <Reveal className="arch" aria-label="Realy system architecture">
          <div className="arch__layer">
            <span className="arch__tag mono">01 · Intent</span>
            <div className="node node--founder"><span className="node__dot" />Founder</div>
          </div>
          <div className="arch__wire" aria-hidden="true" />
          <div className="arch__layer">
            <span className="arch__tag mono">02 · Executive</span>
            <div className="node node--primary"><Mark className="node__icon" />AI CEO</div>
          </div>
          <div className="arch__wire" aria-hidden="true" />
          <div className="arch__layer">
            <span className="arch__tag mono">03 · Orchestration</span>
            <div className="node node--orch">AI Orchestrator <span className="mono node__meta">routes · schedules · verifies</span></div>
          </div>
          <div className="arch__wire" aria-hidden="true" />
          <div className="arch__layer arch__layer--depts">
            <span className="arch__tag mono">04 · Execution</span>
            <div className="arch__bus" aria-hidden="true" />
            <ul className="arch__depts">
              {DEPTS.map((d) => <li key={d} className="node"><span className="node__dot" />{d}</li>)}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
