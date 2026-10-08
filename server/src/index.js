import "dotenv/config";
import app, { ready } from "./app.js";

const PORT = Number(process.env.PORT) || 5000;

await ready();
app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`));
