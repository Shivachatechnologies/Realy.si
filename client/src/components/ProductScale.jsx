import { Reveal } from "./ui.jsx";

export default function ProductScale({ products }) {
  return (
    <section className="section" id="product" aria-labelledby="prod-h">
      <div className="container">
        <div className="section__head">
          <Reveal as="p" className="eyebrow">AI-powered product development</Reveal>
          <Reveal as="h2" id="prod-h" className="h2">From $500 to $100,000+.</Reveal>
          <Reveal as="p" className="sub">
            From a landing page to an enterprise platform — scoped, built and shipped by AI engineering teams with
            human review where it matters.
          </Reveal>
        </div>
        <Reveal className="scale">
          <div className="scale__axis mono" aria-hidden="true"><span>$500</span><span>Complexity</span><span>$100,000+</span></div>
          <ol className="scale__list">
            {products.map((p, i) => {
              const t = products.length > 1 ? i / (products.length - 1) : 1;
              const curve = Math.pow(t, 1.35);
              const style = {
                "--h": `${Math.round(28 + curve * 212)}px`,
                "--w": `${Math.round(16 + curve * 84)}px`,
                "--o": (0.06 + t * 0.22).toFixed(2),
                transitionDelay: `${i * 70}ms`,
              };
              return (
                <li className="scale__item" tabIndex={0} key={p.name}>
                  <span className="scale__bar" style={style} aria-hidden="true" />
                  <div><div className="scale__name">{p.name}</div><div className="scale__scope">{p.scope}</div></div>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
