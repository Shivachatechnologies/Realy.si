/**
 * Vite plugin: after the client build, write one HTML file per public route
 * with route-specific <title>, description, canonical and Open Graph tags,
 * plus sitemap.xml, robots.txt and 404.html. Static hosts (Vercel, Netlify,
 * Express) then serve correct metadata and deep links without rewrites.
 */
import fs from "node:fs";
import path from "node:path";
import routes, { SITE_URL, fullTitle } from "../../shared/routes.js";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function withMeta(html, { title, description, url, noindex }) {
  const t = esc(title), d = esc(description);
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${d}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${t}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${d}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:image:alt" content=")[^"]*/, `$1${t}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${t}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${d}`)
    .replace(/(<meta name="robots" content=")[^"]*/, `$1${noindex ? "noindex, follow" : "index, follow"}`);
}

export default function prerender() {
  let outDir;
  return {
    name: "realy-prerender",
    apply: "build",
    configResolved(c) { outDir = path.resolve(c.root, c.build.outDir); },
    writeBundle() {
      const base = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      for (const r of routes) {
        const url = SITE_URL + (r.path === "/" ? "/" : r.path);
        const html = withMeta(base, { title: fullTitle(r), description: r.description, url });
        const file = r.path === "/" ? path.join(outDir, "index.html") : path.join(outDir, r.path.slice(1), "index.html");
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, html);
      }
      fs.writeFileSync(path.join(outDir, "404.html"), withMeta(base, { title: "Page not found — Realy", description: "This page does not exist.", url: SITE_URL + "/404", noindex: true }));

      const today = new Date().toISOString().slice(0, 10);
      const urls = routes.map((r) => `  <url><loc>${SITE_URL}${r.path === "/" ? "/" : r.path}</loc><lastmod>${today}</lastmod><priority>${r.path === "/" ? "1.0" : "0.8"}</priority></url>`).join("\n");
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
      fs.writeFileSync(path.join(outDir, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
      console.log(`[prerender] ${routes.length} routes, sitemap.xml, robots.txt, 404.html`);
    },
  };
}
