import { PageHero, Reveal, SectionHead } from "../components/ui.jsx";
import FinalCTA from "../components/FinalCTA.jsx";

const VALUES = [
  ["Bold", "We say it straight and build it loud. One idea per screen, no clutter."],
  ["Real", "No jargon, no fake promises. If it is on the page, it is true."],
  ["Simple", "Complex systems, simple to command."],
  ["Forward", "Every product we make moves the founder forward."],
];

export default function About() {
  return (
    <>
      <PageHero eyebrow="About" title={<>The operating system<br />for the next generation of companies.</>} lede="Companies used to need dozens of people before they could move. We believe one founder with the right intelligence should be able to build, launch and run an entire company." />
      <section className="section section--tight">
        <div className="container split">
          <SectionHead eyebrow="Mission" title="One founder. One intelligence. An entire company." />
          <Reveal className="prose">
            <p>Realy is building the intelligence layer that sits underneath a company: one system that researches, plans, builds, sells and operates — and keeps the founder in control of every decision that matters.</p>
            <p>We started in 2026 with a simple promise, written into our name: keep it real. Everything we ship should be honest, clear and built to be used.</p>
          </Reveal>
        </div>
      </section>
      <section className="section section--deep">
        <div className="container">
          <SectionHead eyebrow="Principles" title="Keep it Realy." />
          <Reveal as="ul" className="grid4">
            {VALUES.map(([t, x]) => <li key={t} className="tile"><strong>{t}</strong><p>{x}</p></li>)}
          </Reveal>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
