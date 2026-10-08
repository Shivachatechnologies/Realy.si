/**
 * Seeds MongoDB with the default site content from shared/siteData.js.
 * Usage: npm run seed   (requires MONGODB_URI)
 */
import "dotenv/config";
import mongoose from "mongoose";
import data from "../../shared/siteData.js";
import { DashboardView, MarketplaceItem, PricingPlan, Jurisdiction, SiteSetting } from "./models/index.js";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Copy server/.env.example to server/.env first.");
  process.exit(1);
}

await mongoose.connect(uri);
const withOrder = (arr, map = (x) => x) => arr.map((x, i) => ({ ...map(x), order: i }));

await Promise.all([DashboardView, MarketplaceItem, PricingPlan, Jurisdiction, SiteSetting].map((M) => M.deleteMany({})));

await DashboardView.insertMany(withOrder(data.dashboard.views, ({ id, ...v }) => ({ key: id, ...v })));
await MarketplaceItem.insertMany(withOrder(data.marketplace.items));
await PricingPlan.insertMany(withOrder(data.pricing));
await Jurisdiction.insertMany(withOrder(data.jurisdictions, ({ id, ...j }) => ({ code: id, ...j })));
await SiteSetting.insertMany([
  { key: "links", value: data.links },
  { key: "hero", value: data.hero },
  { key: "products", value: data.products },
  { key: "org", value: data.org },
  { key: "dashboardCompany", value: data.dashboard.company },
  { key: "marketplace", value: { total: data.marketplace.total, categories: data.marketplace.categories } },
]);

console.log("Seeded: %d dashboard views, %d marketplace items, %d plans, %d jurisdictions.",
  data.dashboard.views.length, data.marketplace.items.length, data.pricing.length, data.jurisdictions.length);
await mongoose.disconnect();
