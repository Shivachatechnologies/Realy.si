import { useEffect, useState } from "react";
import { useVisible } from "../hooks/useInView.js";
import { prefersReducedMotion } from "../lib/motion.js";

/* What the build environment shows for each product type (illustrative). */
const BUILD = {
  "Landing Pages": { files: ["app/page.tsx", "components/Hero.tsx", "lib/analytics.ts"], checks: ["Performance budget", "SEO metadata", "Forms wired"] },
  Websites: { files: ["app/(site)/layout.tsx", "cms/schema.ts", "app/blog/[slug]/page.tsx"], checks: ["CMS connected", "Sitemap", "Analytics"] },
  SaaS: { files: ["api/billing/route.ts", "db/schema.sql", "app/(app)/dashboard.tsx"], checks: ["Auth", "Billing", "Admin"] },
  "Mobile Apps": { files: ["app/(tabs)/home.tsx", "services/sync.ts", "store.config.ts"], checks: ["iOS build", "Android build", "Push"] },
  "AI Products": { files: ["agents/planner.ts", "evals/suite.yaml", "api/inference.ts"], checks: ["Evals passing", "Guardrails", "Latency budget"] },
  FinTech: { files: ["ledger/double-entry.ts", "kyc/flow.ts", "audit/log.ts"], checks: ["Ledger balanced", "KYC flow", "Audit trail"] },
  Web3: { files: ["contracts/Token.sol", "test/Token.t.sol", "app/wallet.tsx"], checks: ["Contracts tested", "Wallets", "Indexer"] },
  "Enterprise Platforms": { files: ["services/identity/sso.ts", "infra/terraform/main.tf", "rbac/policies.ts"], checks: ["SSO", "RBAC", "Infrastructure as code"] },
};

/**
 * Product engineering: complexity spectrum ($500 → $100,000+) plus a live build
 * environment for the selected product type.
 */
export default function ProductEngineering({ data }) {
  const types = [...data.types].sort((a, b) => a.level - b.level);
  const [sel, setSel] = useState(2);
  const [phase, setPhase] = useState(0);
  const [ref, visible] = useVisible();
  const T = types[sel];
  const B = BUILD[T.name] || BUILD.SaaS;

  useEffect(() => { setPhase(0); }, [sel]);
  useEffect(() => {
    if (!visible) return;
    if (prefersReducedMotion()) { setPhase(data.process.length); return; }
    const iv = setInterval(() => setPhase((p) => (p > data.process.length + 2 ? 0 : p + 1)), 700);
    return () => clearInterval(iv);
  }, [visible, sel, data.process.length]);

  return (
    <div ref={ref} className="pe">
      <div className="pe__types">
        <div className="pe__scale"><span>{data.min}</span><span className="pe__axis">Scope &amp; complexity</span><span>{data.max}</span></div>
        <div className="pe__track" aria-hidden="true">
          <span className="pe__fill" style={{ width: `${Math.max(4, T.level * 100)}%` }} />
        </div>
        <ul className="pe__list" role="listbox" aria-label="Product type">
          {types.map((t, i) => (
            <li key={t.name}>
              <button role="option" aria-selected={i === sel} className={i === sel ? "is-sel" : ""} onClick={() => setSel(i)}>
                <span className="pe__name">{t.name}</span>
                <span className="pe__bar" aria-hidden="true"><i style={{ width: `${Math.max(6, t.level * 100)}%` }} /></span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="ide" aria-label={`Build environment: ${T.name}`}>
        <div className="ide__top">
          <span className="ide__dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="ide__title">realy build · {T.name.toLowerCase()}</span>
          <span className={`ide__status ${phase >= data.process.length ? "is-ok" : ""}`}>{phase >= data.process.length ? "Deployed" : "Building"}</span>
        </div>
        <div className="ide__body">
          <div className="ide__spec">
            <span className="ide__k">Specification</span>
            <p className="ide__goal">{T.scope}</p>
            <span className="ide__k">Files</span>
            <ul className="ide__files code">
              {B.files.map((f, i) => <li key={f} className={phase > i ? "is-on" : ""}>{f}</li>)}
            </ul>
          </div>
          <div className="ide__pipe">
            <span className="ide__k">Pipeline</span>
            <ol>
              {data.process.map((p, i) => (
                <li key={p} className={i < phase ? "is-done" : i === phase ? "is-now" : ""}>
                  <span className="ide__dot" aria-hidden="true" />{p}
                </li>
              ))}
            </ol>
            <span className="ide__k">Checks</span>
            <ul className="ide__checks">
              {B.checks.map((c, i) => <li key={c} className={phase >= data.process.length - 1 + (i > 0 ? 1 : 0) ? "is-ok" : ""}>{c}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
