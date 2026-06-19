import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/Container";
import type { Locale } from "@/i18n/routing";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <Container className="py-20 max-w-2xl">
      <h1 className="font-serif text-4xl text-coffee-dark">{t("title")}</h1>
      <p className="mt-6 text-muted">{t("comingSoon")}</p>
    </Container>
  );
}
