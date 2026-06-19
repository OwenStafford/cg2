import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import type { Locale } from "@/i18n/routing";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cart");

  return (
    <Container className="py-20 max-w-2xl">
      <h1 className="font-serif text-4xl text-coffee-dark">{t("title")}</h1>
      <p className="mt-6 text-muted">{t("empty")}</p>
      <Link
        href="/shop"
        className="mt-8 inline-flex rounded-full bg-coffee-dark px-6 py-3 text-sm font-medium text-cream hover:bg-coffee transition-colors"
      >
        {t("emptyCta")}
      </Link>
    </Container>
  );
}
