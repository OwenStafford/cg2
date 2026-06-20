import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/Container";
import { ShopBrowser } from "@/components/ShopBrowser";
import { listProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import type { ProductCategory } from "@/lib/db/enums";

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
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("shop");

  const products = await listProducts();
  const initialCategory: "all" | ProductCategory =
    category === "coffee" || category === "tea" || category === "gift"
      ? category
      : "all";

  return (
    <Container className="py-14">
      <h1 className="font-serif text-4xl text-coffee-dark">{t("title")}</h1>
      <ShopBrowser
        products={products}
        locale={locale}
        initialCategory={initialCategory}
      />
    </Container>
  );
}
