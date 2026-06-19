import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  db,
  orders as ordersTable,
  orderItems as orderItemsTable,
  products as productsTable,
} from "@/lib/db";
import { inArray } from "drizzle-orm";

export const runtime = "nodejs";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured" },
      { status: 500 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const cartMetadata = session.metadata?.cart_item_ids ?? "";
  const cartItems = cartMetadata
    .split(",")
    .filter(Boolean)
    .map((entry) => {
      const [productId, qty] = entry.split(":");
      return { productId, quantity: Number(qty) };
    })
    .filter((i) => i.productId && Number.isFinite(i.quantity) && i.quantity > 0);

  const productSnapshots = cartItems.length
    ? await db
        .select()
        .from(productsTable)
        .where(
          inArray(
            productsTable.id,
            cartItems.map((i) => i.productId),
          ),
        )
    : [];
  const productById = new Map(productSnapshots.map((p) => [p.id, p]));

  const email =
    session.customer_details?.email ?? session.customer_email ?? "";

  const shippingAddress =
    (session.collected_information?.shipping_details ??
      session.customer_details) ||
    null;

  const subtotalCents = session.amount_subtotal ?? 0;
  const totalCents = session.amount_total ?? 0;
  const shippingCents = session.shipping_cost?.amount_total ?? 0;
  const taxCents = session.total_details?.amount_tax ?? 0;
  const currency = (session.currency ?? "cad").toUpperCase();

  const [order] = await db
    .insert(ordersTable)
    .values({
      email,
      stripeSessionId: session.id,
      status: "paid",
      subtotalCents,
      taxCents,
      shippingCents,
      totalCents,
      currency,
      shippingAddress,
    })
    .onConflictDoNothing({ target: ordersTable.stripeSessionId })
    .returning({ id: ordersTable.id });

  if (!order) return;

  if (cartItems.length > 0) {
    await db.insert(orderItemsTable).values(
      cartItems.map((item) => {
        const product = productById.get(item.productId);
        return {
          orderId: order.id,
          productId: product?.id ?? null,
          productSlug: product?.slug ?? item.productId,
          nameEn: product?.nameEn ?? "",
          nameFr: product?.nameFr ?? "",
          priceCents: product?.priceCents ?? 0,
          quantity: item.quantity,
        };
      }),
    );
  }
}
