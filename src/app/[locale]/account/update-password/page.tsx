import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/Container";
import { UpdatePasswordForm } from "@/components/UpdatePasswordForm";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function UpdatePasswordPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <Container className="py-20 max-w-2xl">
      <h1 className="font-serif text-4xl text-coffee-dark">
        {t("updatePasswordTitle")}
      </h1>
      <UpdatePasswordForm />
    </Container>
  );
}
