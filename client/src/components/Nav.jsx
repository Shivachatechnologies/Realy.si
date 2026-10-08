import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Button, Logo } from "./ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";

const PRIMARY = [
  ["/platform", "Platform"],
  ["/superintelligence", "Superintelligence"],
  ["/ai-employees", "AI Workforce"],
  ["/company", "Company"],
  ["/product-development", "Product"],
  ["/marketplace", "Marketplace"],
  ["/pricing", "Pricing"],
  ["/resources", "Resources"],
];

export const SYSTEM_MENU = [
  { title: "System", links: [["/platform", "Platform", "The intelligence layer, end to end"], ["/superintelligence", "Superintelligence", "Research, reasoning, execution"], ["/ai-employees", "Digital workforce", "A living organization"], ["/security", "Security & control", "Founder-first by design"]] },
  { title: "Build", links: [["/company", "From thought to company", "The complete transformation"], ["/company-setup", "Company setup", "Formation across six regions"], ["/product-development", "Product engineering", "$500 → $100,000+"], ["/marketplace", "Marketplace", "50+ ready-to-launch products"]] },
  { title: "Grow", links: [["/marketing", "Marketing", "Market to leads"], ["/sales", "Sales", "Lead to customer"], ["/resources", "Resources", "Guides and playbooks"], ["/about", "About", "Why Realy exists"]] },
];

export default function Nav() {
  const { links } = useData();
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [menu, setMenu] = useState(false); // desktop "System" panel
  const [sheet, setSheet] = useState(false); // mobile sheet
  const { pathname } = useLocation();
  const panelRef = useRef(null);

  useEffect(() => { setMenu(false); setSheet(false); window.dispatchEvent(new Event("scroll")); }, [pathname]);
  useEffect(() => {
    let raf = 0;
    // Nav turns dark over [data-dark] sections and compacts once scrolled.
    const check = () => {
      setScrolled(window.scrollY > 8);
      const y = 32;
      setOnDark([...document.querySelectorAll("[data-dark]")].some((el) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom >= y; }));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(check); };
    const onKey = (e) => { if (e.key === "Escape") { setMenu(false); setSheet(false); } };
    const onClick = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setMenu(false); };
    check();
    const t = setTimeout(check, 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t); cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick);
    };
  }, []);
  useEffect(() => { document.body.style.overflow = sheet ? "hidden" : ""; }, [sheet]);

  return (
    <>
    <header className={`nav ${scrolled || menu || sheet ? "is-solid" : ""} ${onDark && !sheet && !menu ? "is-dark" : ""} ${scrolled ? "is-compact" : ""}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__logo" aria-label="Realy.si home"><Logo height={24} onDark={onDark && !sheet && !menu} /></Link>

        <nav className="nav__links" aria-label="Primary" ref={panelRef}>
          {PRIMARY.map(([to, label]) => <NavLink key={to} to={to} className="nav__link">{label}</NavLink>)}
        </nav>

        <div className="nav__actions">
          <a className="nav__login" href={links.login}>Log in</a>
          <Button href={links.signup} size="sm" arrow>Start building</Button>
          <button className="nav__burger" aria-label={sheet ? "Close menu" : "Open menu"} aria-expanded={sheet} aria-controls="sheet" onClick={() => setSheet((s) => !s)}>
            <span /><span />
          </button>
        </div>
      </div>

    </header>
    {/* Outside <header>: its backdrop-filter would otherwise trap position:fixed */}
    <div id="sheet" className={`sheet ${sheet ? "is-open" : ""}`} hidden={!sheet}>
      <div className="container sheet__inner">
        {SYSTEM_MENU.map((col) => (
          <div key={col.title} className="sheet__col">
            <p className="mono sys__title">{col.title}</p>
            {col.links.map(([to, label]) => <Link key={to} to={to} className="sheet__link" onClick={() => setSheet(false)}>{label}</Link>)}
          </div>
        ))}
        <div className="sheet__col">
          <Link to="/pricing" className="sheet__link" onClick={() => setSheet(false)}>Pricing</Link>
          <a href={links.login} className="sheet__link">Log in</a>
        </div>
        <Button href={links.signup} arrow className="sheet__cta">Start building</Button>
      </div>
    </div>
    </>
  );
}
