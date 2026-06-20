import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/Container";
import { AuthForm } from "@/components/AuthForm";
import { createClient } from "@/lib/supabase/server";
import { getOrdersForEmail } from "@/lib/orders";
import { formatPrice, formatDate } from "@/lib/format";
import { signOut } from "./actions";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const STATUS_KEY = {
  pending: "statusPending",
  paid: "statusPaid",
  fulfilled: "statusFulfilled",
  cancelled: "statusCancelled",
  refunded: "statusRefunded",
} as const;

function statusColor(status: string): string {
  if (status === "cancelled" || status === "refunded") return "text-accent";
  if (status === "pending") return "text-muted";
  return "text-coffee-dark";
}

export const dynamic = "force-dynamic";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
  const tOrders = await getTranslations("orders");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <AuthForm />
      </div>
    );
  }

  const orders = await getOrdersForEmail(user.email ?? "");

  return (
    <Container className="py-20 max-w-2xl">
      <div className="space-y-8">
        <h1 className="font-serif text-4xl text-coffee-dark">
          {t("accountTitle")}
        </h1>
        <div className="rounded-md border border-border bg-cream/40 p-6">
          <div className="text-xs uppercase tracking-wider text-muted">
            {t("signedInAs")}
          </div>
          <div className="mt-1 text-coffee-dark">{user.email}</div>
        </div>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-coffee-dark">
            {tOrders("title")}
          </h2>

          {orders.length === 0 ? (
            <p className="text-sm text-muted">{tOrders("empty")}</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="rounded-md border border-border p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-coffee-dark">
                        {tOrders("placedOn")}{" "}
                        {formatDate(order.createdAt, locale)}
                      </div>
                      <div className="mt-1 text-xs text-muted">
                        {tOrders("reference")}: #{order.id.slice(0, 8)}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border border-border px-2.5 py-0.5 text-xs font-medium ${statusColor(
                        order.status,
                      )}`}
                    >
                      {tOrders(STATUS_KEY[order.status] ?? "statusPending")}
                    </span>
                  </div>

                  {order.items.length > 0 && (
                    <ul className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
                      {order.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between gap-4 text-muted"
                        >
                          <span>
                            {locale === "fr" ? item.nameFr : item.nameEn} ×{" "}
                            {item.quantity}
                          </span>
                          <span className="text-coffee-dark">
                            {formatPrice(
                              item.priceCents * item.quantity,
                              locale,
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm font-medium text-coffee-dark">
                    <span>{tOrders("total")}</span>
                    <span>{formatPrice(order.totalCents, locale)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <form action={signOut}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="inline-flex rounded-full border border-coffee-dark px-6 py-3 text-sm font-medium text-coffee-dark hover:bg-cream transition-colors"
          >
            {t("signOut")}
          </button>
        </form>
      </div>
    </Container>
  );
}
