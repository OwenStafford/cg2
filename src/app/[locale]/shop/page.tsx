import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "@/i18n/navigation";
import { listProducts } from "@/lib/products";
import type { Locale } from "@/i18n/routing";
import type { ProductCategory } from "@/lib/types";
import { clsx } from "clsx";

const CATEGORIES: { key: "all" | ProductCategory; label: string }[] = [
  { key: "all", label: "filterAll" },
  { key: "coffee", label: "filterCoffee" },
  { key: "tea", label: "filterTea" },
  { key: "gift", label: "filterGifts" },
];

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

  const active: "all" | ProductCategory =
    category === "coffee" || category === "tea" || category === "gift"
      ? category
      : "all";
  const products = active === "all" ? listProducts() : listProducts(active);

  return (
    <Container className="py-14">
      <h1 className="font-serif text-4xl text-coffee-dark">{t("title")}</h1>

      <nav className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
        {CATEGORIES.map(({ key, label }) => {
          const isActive = active === key;
          const href = key === "all" ? "/shop" : `/shop?category=${key}`;
          return (
            <Link
              key={key}
              href={href}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-coffee-dark text-cream"
                  : "text-muted hover:text-coffee-dark",
              )}
            >
              {t(label)}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} locale={locale} />
        ))}
      </div>
    </Container>
  );
}
