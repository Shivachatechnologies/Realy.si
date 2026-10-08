import { useEffect, useState } from "react";
import defaults from "@shared/siteData.js";

/**
 * Renders the bundled defaults immediately, then swaps in the live payload
 * from the Express API (MongoDB-backed). If the API is unreachable the
 * defaults simply stay in place.
 */
export function useSiteData() {
  const [data, setData] = useState(defaults);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/site", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then((live) => setData((d) => ({ ...d, ...live })))
      .catch((err) => { if (err.name !== "AbortError") console.info("[realy] using bundled content:", err.message); });
    return () => ctrl.abort();
  }, []);

  return data;
}
