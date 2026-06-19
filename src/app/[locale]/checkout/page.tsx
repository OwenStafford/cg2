import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/Container";
import type { Locale } from "@/i18n/routing";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("checkout");

  return (
    <Container className="py-20 max-w-2xl">
      <h1 className="font-serif text-4xl text-coffee-dark">{t("title")}</h1>
      <p className="mt-6 text-muted">{t("comingSoon")}</p>
    </Container>
  );
}
