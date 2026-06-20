import "server-only";
import { eq, inArray, desc } from "drizzle-orm";
import {
  db,
  orders as ordersTable,
  orderItems as orderItemsTable,
  type Order,
  type OrderItem,
} from "@/lib/db";

export type OrderWithItems = Order & { items: OrderItem[] };

// Fetch a customer's orders (newest first) with their line items, keyed by email.
export async function getOrdersForEmail(
  email: string,
): Promise<OrderWithItems[]> {
  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.email, email))
    .orderBy(desc(ordersTable.createdAt));

  if (orders.length === 0) return [];

  const items = await db
    .select()
    .from(orderItemsTable)
    .where(
      inArray(
        orderItemsTable.orderId,
        orders.map((o) => o.id),
      ),
    );

  const itemsByOrder = new Map<string, OrderItem[]>();
  for (const item of items) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrder.set(item.orderId, list);
  }

  return orders.map((o) => ({ ...o, items: itemsByOrder.get(o.id) ?? [] }));
}
