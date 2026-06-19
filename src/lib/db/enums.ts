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
