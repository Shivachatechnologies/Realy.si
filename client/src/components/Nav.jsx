import { useEffect, useState } from "react";
import { Logo, Arrow } from "./ui.jsx";

const LINKS = [
  ["#platform", "Platform"],
  ["#team", "AI Team"],
  ["#setup", "Company Setup"],
  ["#product", "Product"],
  ["#marketplace", "Marketplace"],
  ["#pricing", "Pricing"],
];

export default function Nav({ links }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 1080 && setOpen(false);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav__inner container">
        <Logo />
        <nav className="nav__links" aria-label="Primary">
          {LINKS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="nav__actions">
          <a className="nav__login" href={links.login}>Log in</a>
          <a className="btn btn--primary btn--sm" href={links.signup}>Start Building <Arrow /></a>
          <button
            className="nav__toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          ><span /><span /></button>
        </div>
      </div>
      <div className="mobile-menu" id="mobile-menu" hidden={!open}>
        <nav className="container" aria-label="Mobile">
          {LINKS.map(([href, label]) => <a key={href} href={href} onClick={close}>{label}</a>)}
          <a href={links.login} onClick={close}>Log in</a>
        </nav>
      </div>
    </header>
  );
}
