import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { products as productsTable } from "../src/lib/db/schema";
import { seedProducts as mockProducts } from "./seed-data";
import type { NewProduct } from "../src/lib/db/schema";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const client = postgres(url, { prepare: false });
  const db = drizzle(client);

  const rows: NewProduct[] = mockProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    category: p.category,
    nameEn: p.name.en,
    nameFr: p.name.fr,
    originEn: p.origin?.en ?? null,
    originFr: p.origin?.fr ?? null,
    roast: p.roast ?? null,
    tastingNotesEn: p.tastingNotes?.en ?? null,
    tastingNotesFr: p.tastingNotes?.fr ?? null,
    descriptionEn: p.description.en,
    descriptionFr: p.description.fr,
    priceCents: p.priceCents,
    weightGrams: p.weightGrams ?? null,
    imageUrl: p.imageUrl,
    featured: p.featured ?? false,
    inStock: p.inStock,
  }));

  console.log(`Seeding ${rows.length} products...`);

  for (const row of rows) {
    await db
      .insert(productsTable)
      .values(row)
      .onConflictDoUpdate({
        target: productsTable.id,
        set: {
          slug: row.slug,
          category: row.category,
          nameEn: row.nameEn,
          nameFr: row.nameFr,
          originEn: row.originEn,
          originFr: row.originFr,
          roast: row.roast,
          tastingNotesEn: row.tastingNotesEn,
          tastingNotesFr: row.tastingNotesFr,
          descriptionEn: row.descriptionEn,
          descriptionFr: row.descriptionFr,
          priceCents: row.priceCents,
          weightGrams: row.weightGrams,
          imageUrl: row.imageUrl,
          featured: row.featured,
          inStock: row.inStock,
          updatedAt: new Date(),
        },
      });
    console.log(`  ✓ ${row.slug}`);
  }

  console.log("Seed complete.");
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
