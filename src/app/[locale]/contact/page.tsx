import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/Container";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const tel = t("phone").replace(/[^\d+]/g, "");
  const fax = t("fax");
  const email = t("email");

  return (
    <Container className="py-20 max-w-2xl">
      <h1 className="font-serif text-4xl text-coffee-dark">{t("title")}</h1>
      <p className="mt-6 text-muted leading-relaxed">{t("intro")}</p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <section className="rounded-md border border-border bg-cream/40 p-6">
          <h2 className="text-xs uppercase tracking-wider text-muted">
            {t("visitTitle")}
          </h2>
          <address className="mt-3 not-italic text-coffee-dark leading-relaxed">
            {t("orgName")}
            <br />
            {t("addressLine1")}
            <br />
            {t("addressLine2")}
          </address>
        </section>

        <section className="rounded-md border border-border p-6">
          <h2 className="text-xs uppercase tracking-wider text-muted">
            {t("reachUsTitle")}
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{t("phoneLabel")}</dt>
              <dd>
                <a
                  href={`tel:${tel}`}
                  className="text-coffee-dark hover:text-accent transition-colors"
                >
                  {t("phone")}
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{t("faxLabel")}</dt>
              <dd className="text-coffee-dark">{fax}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{t("emailLabel")}</dt>
              <dd>
                <a
                  href={`mailto:${email}`}
                  className="text-coffee-dark hover:text-accent transition-colors"
                >
                  {email}
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </Container>
  );
}
