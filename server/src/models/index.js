import mongoose from "mongoose";

const { Schema, model } = mongoose;
const opts = { timestamps: true, versionKey: false };

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

/* Every other content section (command center, workforce, pipeline, …), keyed by section name */
export const SiteSetting = model(
  "SiteSetting",
  new Schema({ key: { type: String, required: true, unique: true }, value: Schema.Types.Mixed }, opts)
);
