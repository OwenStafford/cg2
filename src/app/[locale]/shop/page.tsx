import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/Container";
import { ShopBrowser } from "@/components/ShopBrowser";
import { listProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

// Dynamic so `ShopBrowser`'s useSearchParams renders the correct category
// server-side (keeps the grid in the SSR HTML for SEO), without a Suspense bail.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });
  const tSeo = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/shop",
    title: t("title"),
    description: tSeo("shopDescription"),
  });
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("shop");

  const products = await listProducts();

  return (
    <Container className="py-14">
      <h1 className="font-serif text-4xl text-coffee-dark">{t("title")}</h1>
      <ShopBrowser products={products} locale={locale} />
    </Container>
  );
}
