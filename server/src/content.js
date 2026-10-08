import defaults from "../../shared/siteData.js";
import { isConnected } from "./db.js";
import { DashboardView, MarketplaceItem, PricingPlan, Jurisdiction, SiteSetting } from "./models/index.js";

/**
 * Content repository. Reads from MongoDB when connected; any section that is
 * missing from the database falls back to the shared defaults, so the API
 * always returns the same shape the client expects.
 */
const lean = (q) => q.select("-_id -createdAt -updatedAt -order").lean();
const orNull = (arr) => (arr && arr.length ? arr : null);

async function settings() {
  const docs = await SiteSetting.find().lean();
  return Object.fromEntries(docs.map((d) => [d.key, d.value]));
}

export async function getDashboard() {
  if (!isConnected()) return defaults.dashboard;
  const [views, s] = await Promise.all([lean(DashboardView.find().sort("order")), settings()]);
  const mapped = orNull(views)?.map(({ key, ...v }) => ({ id: key, ...v }));
  return { company: s.dashboardCompany ?? defaults.dashboard.company, views: mapped ?? defaults.dashboard.views };
}

export async function getMarketplace(category) {
  let data = defaults.marketplace;
  if (isConnected()) {
    const [items, s] = await Promise.all([lean(MarketplaceItem.find({ published: true }).sort("order")).select("-published"), settings()]);
    const meta = s.marketplace ?? {};
    data = {
      total: meta.total ?? defaults.marketplace.total,
      categories: meta.categories ?? defaults.marketplace.categories,
      items: orNull(items) ?? defaults.marketplace.items,
    };
  }
  if (category && category !== "All") data = { ...data, items: data.items.filter((i) => i.category === category) };
  return data;
}

export async function getPricing() {
  if (!isConnected()) return defaults.pricing;
  return orNull(await lean(PricingPlan.find().sort("order"))) ?? defaults.pricing;
}

export async function getJurisdictions() {
  if (!isConnected()) return defaults.jurisdictions;
  const rows = orNull(await lean(Jurisdiction.find().sort("order")));
  return rows ? rows.map(({ code, ...j }) => ({ id: code, ...j })) : defaults.jurisdictions;
}

export async function getSite() {
  const s = isConnected() ? await settings() : {};
  const [dashboard, marketplace, pricing, jurisdictions] = await Promise.all([
    getDashboard(), getMarketplace(), getPricing(), getJurisdictions(),
  ]);
  return {
    links: s.links ?? defaults.links,
    hero: s.hero ?? defaults.hero,
    products: s.products ?? defaults.products,
    org: s.org ?? defaults.org,
    dashboard,
    marketplace,
    pricing,
    jurisdictions,
    source: isConnected() ? "mongodb" : "defaults",
  };
}
