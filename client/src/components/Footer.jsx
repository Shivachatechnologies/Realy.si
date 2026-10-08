import { Link } from "react-router";
import { Logo } from "./ui.jsx";
import { SYSTEM_MENU } from "./Nav.jsx";
import { useData } from "../hooks/useSiteData.jsx";

export default function Footer() {
  const { links } = useData();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo height={26} />
          <p>The company intelligence platform.<br />One intelligence. Every function.</p>
        </div>
        {SYSTEM_MENU.map((col) => (
          <nav key={col.title} className="footer__col" aria-label={col.title}>
            <p className="mono">{col.title}</p>
            {col.links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
          </nav>
        ))}
        <nav className="footer__col" aria-label="Account">
          <p className="mono">Account</p>
          <Link to="/pricing">Pricing</Link>
          <a href={links.login}>Log in</a>
          <a href={links.signup}>Start building</a>
          <a href={links.app}>app.realy.si</a>
        </nav>
      </div>
      <div className="container footer__base">
        <span>© {new Date().getFullYear()} Realy.si</span>
        <span className="mono">Keep it Realy.</span>
      </div>
    </footer>
  );
}
