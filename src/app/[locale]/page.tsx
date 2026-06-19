import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import { listFeatured } from "@/lib/products";
import type { Locale } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const featured = listFeatured();

  return (
    <>
      <section className="border-b border-border bg-cream/40">
        <Container className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 py-20 lg:py-28">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent">
              {t("heroEyebrow")}
            </div>
            <h1 className="mt-5 font-serif text-5xl lg:text-6xl leading-[1.05] tracking-tight text-coffee-dark">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted leading-relaxed">
              {t("heroSubtitle")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-coffee-dark px-6 py-3 text-sm font-medium text-cream hover:bg-coffee transition-colors"
              >
                {t("heroCta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-full border border-coffee-dark px-6 py-3 text-sm font-medium text-coffee-dark hover:bg-coffee-dark hover:text-cream transition-colors"
              >
                {t("heroCtaSecondary")}
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=1400&q=80"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl text-coffee-dark">
                {t("featuredTitle")}
              </h2>
              <p className="mt-2 text-muted">{t("featuredSubtitle")}</p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-coffee-dark hover:text-coffee"
            >
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-cream/40">
        <Container className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 py-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md order-2 lg:order-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-serif text-3xl lg:text-4xl text-coffee-dark leading-tight">
              {t("storyTitle")}
            </h2>
            <p className="mt-5 text-muted leading-relaxed">{t("storyBody")}</p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-coffee-dark hover:text-coffee"
            >
              {t("storyCta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
