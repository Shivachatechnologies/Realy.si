# realy.si

Marketing site for **Realy — the AI company operating system**, built on the **MERN** stack.

| Layer | Tech |
| --- | --- |
| **M**ongoDB | Site content + demo data (Mongoose models) |
| **E**xpress | REST API (`/api/*`), serves the built React app in production |
| **R**eact | Vite + React 19 single-page site |
| **N**ode | Node 20+ |

## Quick start

```sh
npm install            # root tooling (concurrently)
npm run install:all    # server + client dependencies
cp server/.env.example server/.env   # set MONGODB_URI
npm run seed           # load default content into MongoDB
npm run dev            # API on :5000, React on :5173 (proxied /api)
```

Production:

```sh
npm run build          # builds client/dist
npm start              # Express serves the API and client/dist on PORT
```

No database? Leave `MONGODB_URI` empty — the API serves the built-in demo data
from `shared/siteData.js`, so the site always works.

## Structure

```
shared/siteData.js        All content + DEMO data (seed source, API fallback, client first paint)
shared/routes.js          Public routes + SEO metadata (router titles, prerender, sitemap)
server/
  src/app.js              Express app: /api + serves client/dist (per-route HTML, 404)
  src/index.js            Starts the server
  src/models/index.js     MarketplaceItem, PricingPlan, SiteSetting (every other section)
  src/content.js          Repository: MongoDB → shared defaults per section
  src/seed.js             Seeds MongoDB from shared/siteData.js
client/
  src/App.jsx             Router (14 pages, code-split)
  src/pages/              Home, Platform, Superintelligence, Workforce, Company, ProductDevelopment,
                          Marketplace, Growth (marketing/sales), CompanySetup, Pricing, Security,
                          Resources, About, NotFound
  src/viz/                System visualizations
    core/engine.js        WebGL "Superintelligence Core" (Three.js, lazy-loaded, GPU shaders)
    DecompositionGraph, WorkforceMap, Pipeline, CommandCenter, AutonomyControl,
    ProductEngineering, Marketplace, GlobalNetwork (canvas globe), GrowthEngine,
    ReasoningTrace, SystemArchitecture, HeroOrbit
  build/prerender.js      Vite plugin: per-route HTML + OG tags, sitemap.xml, robots.txt, 404.html
  public/brand/           Official Realy logo (extracted from brand book v2, "on dark" variant)
```

## Pages

`/` · `/platform` · `/superintelligence` · `/ai-employees` · `/company` · `/product-development` ·
`/marketplace` · `/marketing` · `/sales` · `/company-setup` · `/pricing` · `/security` · `/resources` · `/about`

## API

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/api/health` | `{ ok, db: "connected" \| "fallback" }` |
| GET | `/api/site` | Everything the site renders, in one payload |
| GET | `/api/command-center` | Founder command-center data |
| GET | `/api/marketplace?category=AI` | Marketplace catalog (optional filter) |
| GET | `/api/pricing` | Pricing plans |

## Connecting real data

Command-center values, workforce statuses and marketplace listings are **demo
values only**. Replace them by editing MongoDB (or `shared/siteData.js` and
re-running `npm run seed`). The client renders whatever `/api/site` returns, as
long as the shape stays the same. On a static deployment without the API the
bundled defaults are shown.

## Performance

- First paint ships React + the app shell (~130 KB gzipped incl. CSS and logo).
- Three.js (~126 KB gzipped) loads only after first paint, only when WebGL is available.
- All particle motion runs in vertex shaders; animation loops pause offscreen and in background tabs.
- `prefers-reduced-motion`: the core renders one static frame and all motion is disabled.
- Small screens and low-core devices get a lighter particle budget; no WebGL → static poster.

## Brand

- Official logo only (brand book v2, "on dark" variant) — never redrawn or recolored
- Deep-space navy `#04060B`, Realy Blue `#1764FF` as the intelligence signal, ice `#CFE0FF` / cyan `#6FD3FF` accents
- Geist (display + UI) · Geist Mono (technical labels)
- Fluid type and layout: root size scales with the viewport, so 4K uses the full width
- Motion respects `prefers-reduced-motion`.
