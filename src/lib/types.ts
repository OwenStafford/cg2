import type { Locale } from "@/i18n/routing";
import type { ProductCategory, RoastLevel } from "./db/enums";

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
