import defaults from "../../shared/siteData.js";
import { isConnected } from "./db.js";
import { MarketplaceItem, PricingPlan, SiteSetting } from "./models/index.js";

/**
 * Content repository. Reads from MongoDB when connected; any section missing
 * from the database falls back to shared/siteData.js, so the API always
 * returns the shape the client expects.
 */
const lean = (q) => q.select("-_id -createdAt -updatedAt -order").lean();
const orNull = (arr) => (arr && arr.length ? arr : null);

async function settings() {
  if (!isConnected()) return {};
  const docs = await SiteSetting.find().lean();
  return Object.fromEntries(docs.map((d) => [d.key, d.value]));
}

export async function getMarketplace(category) {
  let data = defaults.marketplace;
  if (isConnected()) {
    const [items, s] = await Promise.all([
      lean(MarketplaceItem.find({ published: true }).sort("order")).select("-published"),
      settings(),
    ]);
    data = { ...defaults.marketplace, ...(s.marketplace || {}), items: orNull(items) ?? defaults.marketplace.items };
  }
  if (category && category !== "All") data = { ...data, items: data.items.filter((i) => i.category === category) };
  return data;
}

export async function getPricing() {
  if (!isConnected()) return defaults.pricing;
  return orNull(await lean(PricingPlan.find().sort("order"))) ?? defaults.pricing;
}

export async function getSection(key) {
  const s = await settings();
  return s[key] ?? defaults[key];
}

export async function getSite() {
  const s = await settings();
  const [marketplace, pricing] = await Promise.all([getMarketplace(), getPricing()]);
  const merged = Object.fromEntries(Object.keys(defaults).map((k) => [k, s[k] ?? defaults[k]]));
  return { ...merged, marketplace, pricing, source: isConnected() ? "mongodb" : "defaults" };
}
