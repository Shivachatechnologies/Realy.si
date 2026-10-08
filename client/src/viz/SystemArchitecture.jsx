import { Mark } from "../components/ui.jsx";

const LAYERS = [
  { name: "Founder interface", items: ["Command center", "Objectives", "Approvals", "Natural-language instructions"] },
  { name: "Intelligence core", items: ["Research", "Reasoning", "Planning", "Memory", "Evaluation"], core: true },
  { name: "Orchestration", items: ["Decomposition", "Routing", "Scheduling", "Verification", "Escalation"] },
  { name: "Digital workforce", items: ["Executives", "Product", "Engineering", "Marketing", "Sales", "Finance", "Operations"] },
  { name: "Company infrastructure", items: ["Entity & legal", "Accounting", "Banking prep", "Tooling", "Data"] },
];

/** Layered system architecture with a live signal traveling through the stack. */
export default function SystemArchitecture() {
  return (
    <div className="arch">
      <div className="arch__spine" aria-hidden="true"><span /></div>
      {LAYERS.map((l, i) => (
        <div key={l.name} className={`arch__layer ${l.core ? "is-core" : ""}`}>
          <div className="arch__name">
            <span className="mono">L{i}</span>
            {l.core && <Mark size={16} />}
            <strong>{l.name}</strong>
          </div>
          <ul className="arch__items">{l.items.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}
