// Vercel serverless entry: every /api/* request is rewritten here (see vercel.json)
// and handled by the same Express app used for local/self-hosted runs.
import app, { ready } from "../server/src/app.js";

export default async function handler(req, res) {
  await ready();
  return app(req, res);
}
