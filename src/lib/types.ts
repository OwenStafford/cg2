import type { Locale } from "@/i18n/routing";

export type ProductCategory = "coffee" | "tea" | "gift";

export type RoastLevel = "light" | "medium" | "medium-dark" | "dark" | "espresso";

export type Localized<T> = Record<Locale, T>;

export interface Product {
  id: string;
  slug: string;
  category: ProductCategory;
  name: Localized<string>;
  origin?: Localized<string>;
  roast?: RoastLevel;
  tastingNotes?: Localized<string[]>;
  description: Localized<string>;
  priceCents: number;
  weightGrams?: number;
  imageUrl: string;
  featured?: boolean;
  inStock: boolean;
}
