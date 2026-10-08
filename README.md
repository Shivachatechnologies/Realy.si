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

### Deploying on Vercel

`vercel.json` is already configured: Vercel installs `server/` + `client/`,
builds the React app to `client/dist`, and runs the Express API as a serverless
function (`api/index.js`) for every `/api/*` request. In the Vercel project:

- **Root Directory**: leave empty (repo root) — do **not** set it to `client`
- **Environment variable**: `MONGODB_URI` (optional; without it the API serves demo data)

No database? Leave `MONGODB_URI` empty — the API serves the built-in demo data
from `shared/siteData.js`, so the site always works.

## Structure

```
shared/siteData.js        Default content & DEMO data (used by seed, API fallback, client first paint)
server/
  src/index.js            Express app (API + static client in production)
  src/db.js               Mongo connection with graceful fallback
  src/models/index.js     DashboardView, MarketplaceItem, PricingPlan, Jurisdiction, SiteSetting
  src/content.js          Repository: Mongo → shared defaults per section
  src/routes/api.js       REST endpoints
  src/seed.js             Seeds MongoDB from shared/siteData.js
client/
  src/App.jsx             Page composition
  src/components/*.jsx    One component per section
  src/hooks/              useSiteData (fetches /api/site), useInView
  src/styles.css          Design tokens (brand book v2) and all styles
```

## API

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/api/health` | `{ ok, db: "connected" \| "fallback" }` |
| GET | `/api/site` | Everything the page renders, in one payload |
| GET | `/api/dashboard` | Command-center views |
| GET | `/api/marketplace?category=AI` | Marketplace catalog (optional filter) |
| GET | `/api/pricing` | Pricing plans |
| GET | `/api/jurisdictions` | Company-setup jurisdictions |

## Connecting real data

Dashboard, hero and marketplace values are **demo UI values only**. Replace them
by editing the MongoDB collections (or `shared/siteData.js` and re-running
`npm run seed`) — the client picks up whatever `/api/site` returns, as long as
the shape stays the same.

## Brand

- Realy Blue `#1764FF`, Midnight `#0B1220`, Slate `#5A6478`, Cloud `#F4F6FA`, Mist `#E8F0FF`
- Sora (display) · Inter (body/UI) · JetBrains Mono (technical labels)
- Motion respects `prefers-reduced-motion`.
