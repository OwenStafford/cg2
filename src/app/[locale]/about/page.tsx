import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/Container";
import type { Locale } from "@/i18n/routing";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <section className="border-b border-border bg-cream/40">
        <Container className="max-w-3xl py-20 lg:py-24">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">
            {t("eyebrow")}
          </div>
          <h1 className="mt-5 font-serif text-5xl lg:text-6xl leading-[1.05] tracking-tight text-coffee-dark">
            {t("title")}
          </h1>
          <p className="mt-7 text-lg text-muted leading-relaxed">
            {t("lede")}
          </p>
        </Container>
      </section>

      <Container className="max-w-3xl py-20 space-y-16">
        <section>
          <h2 className="font-serif text-3xl text-coffee-dark">
            {t("section1Title")}
          </h2>
          <p className="mt-5 text-muted leading-relaxed">{t("section1Body")}</p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-coffee-dark">
            {t("section2Title")}
          </h2>
          <p className="mt-5 text-muted leading-relaxed">{t("section2Body")}</p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-coffee-dark">
            {t("section3Title")}
          </h2>
          <p className="mt-5 text-muted leading-relaxed">{t("section3Body")}</p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-coffee-dark">
            {t("section4Title")}
          </h2>
          <p className="mt-5 text-muted leading-relaxed">{t("section4Body")}</p>
        </section>

        <section className="border-t border-border pt-12">
          <h2 className="font-serif text-2xl text-coffee-dark">
            {t("visitTitle")}
          </h2>
          <address className="mt-4 not-italic text-muted leading-relaxed">
            {t("visitBody")}
            <br />
            <a
              href={`tel:${t("visitPhone").replace(/[^\d+]/g, "")}`}
              className="text-coffee-dark hover:text-accent transition-colors"
            >
              {t("visitPhone")}
            </a>
          </address>
        </section>
      </Container>
    </>
  );
}
