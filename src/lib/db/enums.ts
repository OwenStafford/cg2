// Single source of truth for our DB-level enums.
// Imported by schema.ts (to build pgEnum columns) and anywhere that needs the
// values for forms, validation, dropdowns, etc. Use `as const` so each array
// element narrows to its literal — the derived TS type is a proper union.

export const PRODUCT_CATEGORIES = ["coffee", "tea", "gift"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const ROAST_LEVELS = [
  "light",
  "medium",
  "medium-dark",
  "dark",
  "espresso",
] as const;
export type RoastLevel = (typeof ROAST_LEVELS)[number];

export const ORDER_STATUSES = [
  "pending",
  "paid",
  "fulfilled",
  "cancelled",
  "refunded",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
