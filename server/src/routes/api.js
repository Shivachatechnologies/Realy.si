import { Router } from "express";
import { isConnected } from "../db.js";
import { getSite, getMarketplace, getPricing, getSection } from "../content.js";

const router = Router();

// Express 5 forwards rejected promises to the error handler.
router.get("/health", (_req, res) => res.json({ ok: true, db: isConnected() ? "connected" : "fallback" }));
router.get("/site", async (_req, res) => res.json(await getSite()));
router.get("/command-center", async (_req, res) => res.json(await getSection("commandCenter")));
router.get("/marketplace", async (req, res) => res.json(await getMarketplace(req.query.category)));
router.get("/pricing", async (_req, res) => res.json(await getPricing()));

export default router;
