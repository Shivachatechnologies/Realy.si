import { useEffect } from "react";
import { useLocation } from "react-router";
import routes, { SITE_URL, fullTitle } from "@shared/routes.js";

const setMeta = (sel, attr, value) => {
  const el = document.head.querySelector(sel);
  if (el) el.setAttribute(attr, value);
};

/** Keeps <title>, description, canonical and Open Graph tags in sync on client navigation. */
export function usePageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const r = routes.find((x) => x.path === pathname);
    const title = r ? fullTitle(r) : "Page not found — Realy";
    const url = SITE_URL + (r ? r.path : pathname);
    document.title = title;
    if (r) {
      setMeta('meta[name="description"]', "content", r.description);
      setMeta('meta[property="og:description"]', "content", r.description);
      setMeta('meta[name="twitter:description"]', "content", r.description);
    }
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('link[rel="canonical"]', "href", url);
  }, [pathname]);
}
