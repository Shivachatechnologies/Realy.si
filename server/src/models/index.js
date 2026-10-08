import mongoose from "mongoose";

const { Schema, model } = mongoose;
const opts = { timestamps: true, versionKey: false };

/* Command-center dashboard (DEMO values until wired to real company data) */
const MetricSchema = new Schema(
  { label: String, value: Number, format: { type: String, enum: ["currency", "number", "percent", "percent1"] }, suffix: String, delta: String },
  { _id: false }
);
const RowSchema = new Schema(
  { who: String, what: String, meta: String, tone: { type: String, enum: ["live", "info", "warn"] } },
  { _id: false }
);
export const DashboardView = model(
  "DashboardView",
  new Schema(
    {
      key: { type: String, required: true, unique: true },
      label: { type: String, required: true },
      title: String,
      subtitle: String,
      metrics: [MetricSchema],
      series: [Number],
      seriesLabel: String,
      rows: [RowSchema],
      order: { type: Number, default: 0 },
    },
    opts
  )
);

/* White-label marketplace catalog */
export const MarketplaceItem = model(
  "MarketplaceItem",
  new Schema(
    {
      name: { type: String, required: true },
      category: { type: String, required: true, index: true },
      desc: String,
      published: { type: Boolean, default: true },
      order: { type: Number, default: 0 },
    },
    opts
  )
);

/* Pricing plans */
export const PricingPlan = model(
  "PricingPlan",
  new Schema(
    {
      plan: { type: String, required: true, unique: true },
      name: String,
      price: String,
      period: String,
      blurb: String,
      features: [String],
      recommended: Boolean,
      cta: String,
      order: { type: Number, default: 0 },
    },
    opts
  )
);

/* Company-setup jurisdictions */
export const Jurisdiction = model(
  "Jurisdiction",
  new Schema(
    {
      code: { type: String, required: true, unique: true },
      name: String,
      entity: String,
      note: String,
      order: { type: Number, default: 0 },
    },
    opts
  )
);

/* Free-form site settings: hero, org chart, product scale, links, … */
export const SiteSetting = model(
  "SiteSetting",
  new Schema({ key: { type: String, required: true, unique: true }, value: Schema.Types.Mixed }, opts)
);
