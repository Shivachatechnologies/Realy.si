import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import compression from "compression";
import { connectDB } from "./db.js";
import api from "./routes/api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIST = path.resolve(__dirname, "../../client/dist");

const app = express();
app.disable("x-powered-by");
app.use(compression());
app.use(express.json({ limit: "100kb" }));
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((s) => s.trim()) }));

app.use("/api", api);
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// Production: serve the built React app. Each public route has its own
// prerendered HTML (route-specific metadata); unknown paths get 404.html.
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST, { maxAge: "1h", index: false, redirect: false }));
  app.get("/{*splat}", (req, res) => {
    const clean = path.normalize(req.path).replace(/^([/\\])+|[/\\]+$/g, "");
    const file = path.join(CLIENT_DIST, clean, "index.html");
    if (file.startsWith(CLIENT_DIST) && fs.existsSync(file)) return res.sendFile(file);
    res.status(404).sendFile(path.join(CLIENT_DIST, "404.html"));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Connect once per process.
let connecting;
export const ready = () => (connecting ??= connectDB(process.env.MONGODB_URI));

export default app;
