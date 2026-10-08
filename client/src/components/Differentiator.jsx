import { Pill, Reveal, Tick } from "./ui.jsx";

export default function Differentiator() {
  return (
    <section className="section" aria-labelledby="diff-h">
      <div className="container">
        <Reveal as="h2" id="diff-h" className="diff__h">
          <span>Have an idea? <em>Build it.</em></span>
          <span>Have a product? <em>Grow it.</em></span>
          <span>Need a product? <em>Launch one.</em></span>
        </Reveal>

        <div className="diff">
          <Reveal as="article" className="card diff__card">
            <span className="mono diff__n">01</span>
            <h3 className="h3">“I have an idea.”</h3>
            <p>Realy validates it and creates the company blueprint.</p>
            <div className="mini">
              <div className="mini__head"><span>Blueprint</span><Pill tone="live">Validated</Pill></div>
              <ul className="mini__list">
                {["Market", "Customer", "Business model", "Name & brand"].map((x) => (
                  <li key={x}><span>{x}</span><span className="ok"><Tick /></span></li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal as="article" className="card diff__card">
            <span className="mono diff__n">02</span>
            <h3 className="h3">“I already have a product.”</h3>
            <p>Connect your product and let Realy’s AI team improve and grow it.</p>
            <div className="mini">
              <div className="mini__head"><span>Connections</span><span className="mono muted">3 of 3</span></div>
              <ul className="mini__list">
                {["Code repository", "Payments", "Analytics"].map((x) => (
                  <li key={x}><span><i className="sq" />{x}</span><Pill tone="live">Synced</Pill></li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal as="article" className="card diff__card">
            <span className="mono diff__n">03</span>
            <h3 className="h3">“I need a product.”</h3>
            <p>Build from scratch or choose from the Realy product marketplace.</p>
            <div className="mini mini--split">
              <div className="choice"><span className="mono muted">A</span><strong>Build from scratch</strong><span>AI-powered development</span></div>
              <div className="choice choice--on"><span className="mono">B</span><strong>Start from marketplace</strong><span>Ready-to-launch software</span></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
