import { createContext, useContext, useEffect, useState } from "react";
import defaults from "@shared/siteData.js";

const SiteDataContext = createContext(defaults);
export const useData = () => useContext(SiteDataContext);

/**
 * Renders the bundled defaults immediately, then swaps in the live payload
 * from the Express API (MongoDB-backed). If the API is unreachable (e.g. a
 * static deployment) the defaults simply stay in place.
 */
export function SiteDataProvider({ children }) {
  const [data, setData] = useState(defaults);
  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/site", { signal: ctrl.signal, headers: { accept: "application/json" } })
      .then((r) => {
        const json = r.ok && (r.headers.get("content-type") || "").includes("application/json");
        return json ? r.json() : Promise.reject(new Error(`no api (${r.status})`));
      })
      .then((live) => setData((d) => ({ ...d, ...live })))
      .catch((err) => { if (err.name !== "AbortError") console.info("[realy] using bundled content:", err.message); });
    return () => ctrl.abort();
  }, []);
  return <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>;
}
