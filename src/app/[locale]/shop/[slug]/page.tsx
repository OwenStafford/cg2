import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/Container";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getProduct, listAllSlugs } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateStaticParams() {
  const slugs = await listAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return pageMetadata({
    locale,
    path: `/shop/${slug}`,
    title: product.name[locale],
    description: product.description[locale],
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await getProduct(slug);
  if (!product) notFound();

  const t = await getTranslations("product");

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name[locale],
    image: product.imageUrl,
    description: product.description[locale],
    brand: { "@type": "Brand", name: "Café Gourmet" },
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: (product.priceCents / 100).toFixed(2),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/${locale}/shop/${product.slug}`,
    },
  };

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative aspect-square overflow-hidden rounded-md bg-cream">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name[locale]}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div>
          {product.origin && (
            <div className="text-xs uppercase tracking-[0.2em] text-accent">
              {product.origin[locale]}
            </div>
          )}
          <h1 className="mt-3 font-serif text-4xl text-coffee-dark leading-tight">
            {product.name[locale]}
          </h1>
          <div className="mt-3 text-xl text-coffee">
            {formatPrice(product.priceCents, locale)}
          </div>

          <p className="mt-7 text-muted leading-relaxed">
            {product.description[locale]}
          </p>

          <dl className="mt-8 space-y-3 text-sm">
            {product.roast && (
              <div className="flex gap-3">
                <dt className="w-28 text-muted">{t("roast")}</dt>
                <dd className="text-coffee-dark capitalize">{product.roast}</dd>
              </div>
            )}
            {product.tastingNotes && (
              <div className="flex gap-3">
                <dt className="w-28 text-muted">{t("tastingNotes")}</dt>
                <dd className="text-coffee-dark">
                  {product.tastingNotes[locale].join(" · ")}
                </dd>
              </div>
            )}
            {product.weightGrams && (
              <div className="flex gap-3">
                <dt className="w-28 text-muted">{t("weight")}</dt>
                <dd className="text-coffee-dark">{product.weightGrams}g</dd>
              </div>
            )}
          </dl>

          <AddToCartButton
            product={{
              productId: product.id,
              slug: product.slug,
              nameEn: product.name.en,
              nameFr: product.name.fr,
              imageUrl: product.imageUrl,
              priceCents: product.priceCents,
            }}
            inStock={product.inStock}
          />
        </div>
      </div>
    </Container>
  );
}
