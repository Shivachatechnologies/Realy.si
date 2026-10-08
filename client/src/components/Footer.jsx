import { useEffect, useState } from "react";
import { Arrow, Logo, Reveal } from "./ui.jsx";

export function FinalCTA({ links }) {
  return (
    <section className="final" aria-labelledby="final-h">
      <div className="hero__bg" aria-hidden="true" />
      <div className="container final__inner">
        <Reveal as="p" className="eyebrow">Your company starts here.</Reveal>
        <Reveal as="h2" id="final-h" className="display display--final">Tell Realy what you want to build.</Reveal>
        <Reveal as="p" className="lede">Your AI company takes it from there.</Reveal>
        <Reveal><a className="btn btn--primary btn--lg" href={links.signup}>Start Building <Arrow /></a></Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Logo />
        <nav className="footer__links" aria-label="Footer">
          <a href="#platform">Platform</a>
          <a href="#team">AI Team</a>
          <a href="#setup">Company Setup</a>
          <a href="#marketplace">Marketplace</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <p className="footer__meta">© {new Date().getFullYear()} Realy.si · Keep it Realy.</p>
      </div>
    </footer>
  );
}

/** Mobile-only (CSS) sticky CTA: visible after the hero, hidden near the end. */
export function StickyCTA({ links }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector(".hero");
      if (!hero) return;
      const y = window.scrollY;
      const pastHero = y > hero.offsetTop + hero.offsetHeight - 120;
      const nearEnd = window.innerHeight + y > document.body.scrollHeight - 520;
      setOn(pastHero && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`sticky-cta ${on ? "is-on" : ""}`}>
      <a className="btn btn--primary btn--block" href={links.signup}>Start Building <Arrow /></a>
    </div>
  );
}
