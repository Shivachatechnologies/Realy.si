import { Router } from "express";
import { isConnected } from "../db.js";
import { getSite, getDashboard, getMarketplace, getPricing, getJurisdictions } from "../content.js";

const router = Router();

// Express 5 forwards rejected promises to the error handler.
router.get("/health", (_req, res) => res.json({ ok: true, db: isConnected() ? "connected" : "fallback" }));
router.get("/site", async (_req, res) => res.json(await getSite()));
router.get("/dashboard", async (_req, res) => res.json(await getDashboard()));
router.get("/marketplace", async (req, res) => res.json(await getMarketplace(req.query.category)));
router.get("/pricing", async (_req, res) => res.json(await getPricing()));
router.get("/jurisdictions", async (_req, res) => res.json(await getJurisdictions()));

export default router;
