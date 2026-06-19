import {
  pgTable,
  pgEnum,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";
import { PRODUCT_CATEGORIES, ROAST_LEVELS, ORDER_STATUSES } from "./enums";

export const productCategory = pgEnum("product_category", PRODUCT_CATEGORIES);
export const roastLevel = pgEnum("roast_level", ROAST_LEVELS);
export const orderStatus = pgEnum("order_status", ORDER_STATUSES);

export { PRODUCT_CATEGORIES, ROAST_LEVELS, ORDER_STATUSES } from "./enums";
export type { ProductCategory, RoastLevel, OrderStatus } from "./enums";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  category: productCategory("category").notNull(),
  nameEn: text("name_en").notNull(),
  nameFr: text("name_fr").notNull(),
  originEn: text("origin_en"),
  originFr: text("origin_fr"),
  roast: roastLevel("roast"),
  tastingNotesEn: jsonb("tasting_notes_en").$type<string[] | null>(),
  tastingNotesFr: jsonb("tasting_notes_fr").$type<string[] | null>(),
  descriptionEn: text("description_en").notNull(),
  descriptionFr: text("description_fr").notNull(),
  priceCents: integer("price_cents").notNull(),
  weightGrams: integer("weight_grams"),
  imageUrl: text("image_url").notNull(),
  featured: boolean("featured").default(false).notNull(),
  inStock: boolean("in_stock").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Mirrors Supabase Auth users — id matches auth.users.id (UUID).
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => customers.id, {
    onDelete: "set null",
  }),
  email: text("email").notNull(),
  stripeSessionId: text("stripe_session_id").unique(),
  status: orderStatus("status").default("pending").notNull(),
  subtotalCents: integer("subtotal_cents").notNull(),
  taxCents: integer("tax_cents").default(0).notNull(),
  shippingCents: integer("shipping_cents").default(0).notNull(),
  totalCents: integer("total_cents").notNull(),
  currency: text("currency").default("CAD").notNull(),
  shippingAddress: jsonb("shipping_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  productSlug: text("product_slug").notNull(),
  nameEn: text("name_en").notNull(),
  nameFr: text("name_fr").notNull(),
  priceCents: integer("price_cents").notNull(),
  quantity: integer("quantity").notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
