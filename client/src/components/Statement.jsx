import { Reveal } from "./ui.jsx";

const CATS = ["Strategy", "Product", "Engineering", "Marketing", "Sales", "Operations"];

export default function Statement() {
  return (
    <section className="statement" aria-labelledby="statement-h">
      <div className="container">
        <Reveal as="h2" id="statement-h" className="statement__h">One platform for the work of an entire company.</Reveal>
        <Reveal as="ul" className="statement__cats">{CATS.map((c) => <li key={c}>{c}</li>)}</Reveal>
      </div>
    </section>
  );
}
