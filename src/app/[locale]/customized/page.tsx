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
  const t = await getTranslations({ locale, namespace: "customService" });
  return pageMetadata({
    locale,
    path: "/customized",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function CustomServicePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("customService");

  const tel = t("phone").replace(/[^\d+]/g, "");
  const email = t("email");

  const offerings = [
    { title: t("blendTitle"), body: t("blendBody") },
    { title: t("teaTitle"), body: t("teaBody") },
  ];

  return (
    <Container className="py-20 max-w-3xl">
      <h1 className="font-serif text-4xl text-coffee-dark">{t("title")}</h1>
      <p className="mt-6 text-lg text-muted leading-relaxed">{t("intro")}</p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {offerings.map((o) => (
          <section
            key={o.title}
            className="rounded-md border border-border p-6"
          >
            <h2 className="font-serif text-xl text-coffee-dark">{o.title}</h2>
            <p className="mt-3 text-muted leading-relaxed">{o.body}</p>
          </section>
        ))}

        <section className="rounded-md border border-border p-6 sm:col-span-2">
          <h2 className="font-serif text-xl text-coffee-dark">
            {t("basketsTitle")}
          </h2>
          <p className="mt-3 text-muted leading-relaxed">{t("basketsBody")}</p>
          <p className="mt-3 text-sm font-medium text-coffee-dark">
            {t("basketThemes")}
          </p>
        </section>

        <section className="rounded-md border border-border bg-cream/40 p-6 sm:col-span-2">
          <h2 className="font-serif text-xl text-coffee-dark">
            {t("fundraisingTitle")}
          </h2>
          <p className="mt-3 text-muted leading-relaxed">
            {t("fundraisingBody")}
          </p>
        </section>
      </div>

      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-serif text-2xl text-coffee-dark">{t("ctaTitle")}</h2>
        <p className="mt-3 text-muted">{t("ctaBody")}</p>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <span>
            <span className="text-muted">{t("phoneLabel")}: </span>
            <a
              href={`tel:${tel}`}
              className="text-coffee-dark hover:text-accent transition-colors"
            >
              {t("phone")}
            </a>
          </span>
          <span>
            <span className="text-muted">{t("emailLabel")}: </span>
            <a
              href={`mailto:${email}`}
              className="text-coffee-dark hover:text-accent transition-colors"
            >
              {email}
            </a>
          </span>
        </div>
      </section>
    </Container>
  );
}
