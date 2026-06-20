import { NextResponse, type NextRequest } from "next/server";
import { inArray } from "drizzle-orm";
import type Stripe from "stripe";
import { db, products as productsTable } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { routing } from "@/i18n/routing";

type RequestBody = {
  items: { productId: string; quantity: number }[];
  locale: "en" | "fr";
};

function parseBody(input: unknown): RequestBody | null {
  if (!input || typeof input !== "object") return null;
  const b = input as Record<string, unknown>;

  if (!Array.isArray(b.items) || b.items.length === 0) return null;
  const items: RequestBody["items"] = [];
  for (const raw of b.items) {
    if (!raw || typeof raw !== "object") return null;
    const r = raw as Record<string, unknown>;
    if (typeof r.productId !== "string") return null;
    if (
      typeof r.quantity !== "number" ||
      !Number.isInteger(r.quantity) ||
      r.quantity < 1 ||
      r.quantity > 99
    ) {
      return null;
    }
    items.push({ productId: r.productId, quantity: r.quantity });
  }

  const locale = (routing.locales as readonly string[]).includes(
    b.locale as string,
  )
    ? (b.locale as "en" | "fr")
    : routing.defaultLocale;

  return { items, locale };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseBody(body);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { items, locale } = parsed;

  const ids = items.map((i) => i.productId);
  const dbProducts = await db
    .select()
    .from(productsTable)
    .where(inArray(productsTable.id, ids));

  if (dbProducts.length !== ids.length) {
    return NextResponse.json(
      { error: "Some products not found" },
      { status: 400 },
    );
  }

  const outOfStock = dbProducts.filter((p) => !p.inStock).map((p) => p.slug);
  if (outOfStock.length > 0) {
    return NextResponse.json(
      { error: "Some items are out of stock", outOfStock },
      { status: 409 },
    );
  }

  const productById = new Map(dbProducts.map((p) => [p.id, p]));

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item) => {
      const product = productById.get(item.productId)!;
      return {
        quantity: item.quantity,
        price_data: {
          currency: "cad",
          unit_amount: product.priceCents,
          product_data: {
            name: locale === "fr" ? product.nameFr : product.nameEn,
            images: [product.imageUrl],
            metadata: { product_id: product.id, slug: product.slug },
          },
        },
      };
    },
  );

  const origin = req.headers.get("origin") ?? req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded_page",
    mode: "payment",
    line_items: lineItems,
    return_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    shipping_address_collection: {
      allowed_countries: ["CA", "US"],
    },
    locale: locale === "fr" ? "fr-CA" : "en",
    automatic_tax: { enabled: false },
    metadata: {
      cart_item_ids: items.map((i) => `${i.productId}:${i.quantity}`).join(","),
    },
  });

  return NextResponse.json({ clientSecret: session.client_secret });
}
