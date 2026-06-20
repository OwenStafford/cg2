import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db, products as productsTable } from "./db";
import type { Product } from "./types";
import type { ProductCategory } from "./db/enums";
import type { Product as ProductRow } from "./db/schema";

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    name: { en: row.nameEn, fr: row.nameFr },
    origin:
      row.originEn && row.originFr
        ? { en: row.originEn, fr: row.originFr }
        : undefined,
    roast: row.roast ?? undefined,
    tastingNotes:
      row.tastingNotesEn && row.tastingNotesFr
        ? { en: row.tastingNotesEn, fr: row.tastingNotesFr }
        : undefined,
    description: { en: row.descriptionEn, fr: row.descriptionFr },
    priceCents: row.priceCents,
    weightGrams: row.weightGrams ?? undefined,
    imageUrl: row.imageUrl,
    featured: row.featured,
    inStock: row.inStock,
  };
}

export const getProduct = cache(
  async (slug: string): Promise<Product | undefined> => {
    const [row] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, slug))
      .limit(1);
    return row ? toProduct(row) : undefined;
  },
);

export const listProducts = cache(
  async (category?: ProductCategory): Promise<Product[]> => {
    const rows = category
      ? await db
          .select()
          .from(productsTable)
          .where(eq(productsTable.category, category))
      : await db.select().from(productsTable);
    return rows.map(toProduct);
  },
);

export const listFeatured = cache(async (): Promise<Product[]> => {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.featured, true));
  return rows.map(toProduct);
});

export const listAllSlugs = cache(async (): Promise<string[]> => {
  const rows = await db.select({ slug: productsTable.slug }).from(productsTable);
  return rows.map((r) => r.slug);
});
