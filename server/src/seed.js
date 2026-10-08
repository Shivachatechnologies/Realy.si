/**
 * Seeds MongoDB with the default site content from shared/siteData.js.
 * Usage: npm run seed   (requires MONGODB_URI)
 */
import "dotenv/config";
import mongoose from "mongoose";
import data from "../../shared/siteData.js";
import { MarketplaceItem, PricingPlan, SiteSetting } from "./models/index.js";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Copy server/.env.example to server/.env first.");
  process.exit(1);
}

await mongoose.connect(uri);
await Promise.all([MarketplaceItem, PricingPlan, SiteSetting].map((M) => M.deleteMany({})));

const { items, ...marketplaceMeta } = data.marketplace;
await MarketplaceItem.insertMany(items.map((x, i) => ({ ...x, order: i })));
await PricingPlan.insertMany(data.pricing.map((x, i) => ({ ...x, order: i })));

const sections = Object.entries(data).filter(([k]) => !["marketplace", "pricing"].includes(k));
await SiteSetting.insertMany([
  ...sections.map(([key, value]) => ({ key, value })),
  { key: "marketplace", value: marketplaceMeta },
]);

console.log("Seeded %d sections, %d marketplace items, %d plans.", sections.length + 1, items.length, data.pricing.length);
await mongoose.disconnect();
