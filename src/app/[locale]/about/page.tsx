import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/Container";
import { FoundersPhoto } from "@/components/FoundersPhoto";
import type { Locale } from "@/i18n/routing";

const FOUNDERS_PHOTO_PATH = "/founders-1977.png";

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
        <Container className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 py-20 lg:py-24">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent">
              {t("eyebrow")}
            </div>
            <h1 className="mt-5 font-serif text-5xl lg:text-6xl leading-[1.05] tracking-tight text-coffee-dark">
              {t("title")}
            </h1>
            <p className="mt-7 text-lg text-muted leading-relaxed">
              {t("lede")}
            </p>
          </div>
          <figure className="lg:justify-self-end">
            <div className="relative aspect-[2/3] w-full max-w-sm overflow-hidden rounded-md bg-cream border border-border">
              <FoundersPhoto
                src={FOUNDERS_PHOTO_PATH}
                alt={t("foundersCaption")}
              />
            </div>
            <figcaption className="mt-3 max-w-sm text-xs uppercase tracking-wider text-muted">
              {t("foundersCaption")}
            </figcaption>
          </figure>
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

        <section>
          <h2 className="font-serif text-3xl text-coffee-dark">
            {t("section5Title")}
          </h2>
          <p className="mt-5 text-muted leading-relaxed">{t("section5Body")}</p>
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
