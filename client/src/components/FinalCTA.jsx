import { Button, Reveal } from "./ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";

export default function FinalCTA({ eyebrow = "Your company starts here", title = "Tell Realy what you want to build.", lede = "The intelligence takes it from there." }) {
  const { links } = useData();
  return (
    <section className="final">
      <div className="final__field" aria-hidden="true" />
      <div className="container final__inner">
        <Reveal as="p" className="eyebrow">{eyebrow}</Reveal>
        <Reveal as="h2" className="display display--final">{title}</Reveal>
        <Reveal as="p" className="lede lede--lg">{lede}</Reveal>
        <Reveal className="final__cta">
          <Button href={links.signup} size="lg" arrow>Start building</Button>
          <Button to="/platform" variant="ghost" size="lg">Explore the system</Button>
        </Reveal>
      </div>
    </section>
  );
}
