import { Pill, Reveal } from "./ui.jsx";

function Lock() {
  return (
    <svg className="lock" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

export default function Autonomy() {
  return (
    <section className="section" aria-labelledby="auto-h">
      <div className="container">
        <div className="section__head">
          <Reveal as="p" className="eyebrow">Autonomy</Reveal>
          <Reveal as="h2" id="auto-h" className="h2">AI that doesn’t just answer.<br /><span className="muted-h">AI that works.</span></Reveal>
          <Reveal as="p" className="sub">You decide how much the AI team can do on its own. Every action falls into one of three levels.</Reveal>
        </div>

        <div className="auto">
          <Reveal className="auto__spectrum mono" aria-hidden="true"><span>More autonomy</span><span className="auto__line" /><span>More control</span></Reveal>
          <Reveal as="article" className="card auto__card">
            <p className="mono auto__lvl">Level 1</p>
            <h3 className="h3">Autonomous</h3>
            <p>AI executes approved tasks automatically.</p>
            <div className="mini">
              <ul className="mini__list">
                <li><span>Publish scheduled posts</span><Pill tone="live">Auto</Pill></li>
                <li><span>Triage support tickets</span><Pill tone="live">Auto</Pill></li>
              </ul>
            </div>
          </Reveal>
          <Reveal as="article" className="card auto__card">
            <p className="mono auto__lvl">Level 2</p>
            <h3 className="h3">Approval</h3>
            <p>AI prepares actions for founder approval.</p>
            <div className="mini">
              <div className="approve">
                <span>Send outreach to 120 leads</span>
                <div className="approve__btns"><span className="b b--ok">Approve</span><span className="b">Edit</span></div>
              </div>
            </div>
          </Reveal>
          <Reveal as="article" className="card auto__card">
            <p className="mono auto__lvl">Level 3</p>
            <h3 className="h3">Founder control</h3>
            <p>Important financial, legal and strategic decisions remain with the founder.</p>
            <div className="mini">
              <ul className="mini__list">
                <li><span><Lock />Sign contracts</span><span className="mono muted">Founder</span></li>
                <li><span><Lock />Move funds</span><span className="mono muted">Founder</span></li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
