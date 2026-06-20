import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/Container";
import { CartContents } from "@/components/CartContents";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cart");

  return (
    <Container className="py-14 max-w-5xl">
      <h1 className="font-serif text-4xl text-coffee-dark">{t("title")}</h1>
      <CartContents locale={locale} />
    </Container>
  );
}
