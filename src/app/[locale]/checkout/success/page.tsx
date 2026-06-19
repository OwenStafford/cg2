import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/Container";
import { CartClearer } from "@/components/CartClearer";
import { Link } from "@/i18n/navigation";
import { stripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  const { session_id } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("checkout");

  if (!session_id) notFound();

  const session = await stripe.checkout.sessions
    .retrieve(session_id)
    .catch(() => null);

  if (!session) notFound();

  const isPaid = session.payment_status === "paid";
  const total = session.amount_total ?? 0;

  return (
    <Container className="py-20 max-w-2xl">
      {isPaid && <CartClearer />}
      <h1 className="font-serif text-4xl text-coffee-dark">
        {t("successTitle")}
      </h1>
      <p className="mt-6 text-muted leading-relaxed">{t("successBody")}</p>

      <div className="mt-10 rounded-md border border-border bg-cream/40 p-6 space-y-3">
        <div className="text-xs uppercase tracking-wider text-muted">
          {t("orderRef")}
        </div>
        <div className="font-mono text-xs text-coffee-dark break-all">
          {session.id}
        </div>
        {isPaid && (
          <div className="pt-3 border-t border-border flex justify-between text-sm font-medium text-coffee-dark">
            <span>Total</span>
            <span>{formatPrice(total, locale)}</span>
          </div>
        )}
      </div>

      <Link
        href="/shop"
        className="mt-10 inline-flex rounded-full bg-coffee-dark px-6 py-3 text-sm font-medium text-cream hover:bg-coffee transition-colors"
      >
        {t("continueShopping")}
      </Link>
    </Container>
  );
}
