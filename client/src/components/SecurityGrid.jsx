import { Reveal } from "./ui.jsx";
import { useData } from "../hooks/useSiteData.jsx";

const ICONS = {
  "Encrypted data": "M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5z",
  "Secure authentication": "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  "Least-privilege access": "M15 7a4 4 0 1 1-3.9 5H3v3h3v3h3v-3h2.1A4 4 0 0 1 15 7z",
  Auditability: "M5 4h14v16H5zM8 8h8M8 12h8M8 16h5",
  "Isolated workspaces": "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
  "Controlled autonomy": "M12 3v4M12 17v4M3 12h4M17 12h4M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z",
};

/** Security architecture. Describes how the platform is designed, not certifications. */
export default function SecurityGrid() {
  const { security } = useData();
  return (
    <>
      <Reveal as="ul" className="sec">
        {security.map((s) => (
          <li key={s.name}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICONS[s.name] || ICONS.Auditability} /></svg>
            <strong>{s.name}</strong>
            <p>{s.text}</p>
          </li>
        ))}
      </Reveal>
      <p className="footnote">This describes Realy’s security architecture and design principles. Independent certifications are not claimed here.</p>
    </>
  );
}
