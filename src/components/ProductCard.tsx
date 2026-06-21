import { Link } from "@/i18n/navigation";
import { FadeImage } from "./FadeImage";
import type { Product } from "@/lib/types";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/lib/format";

export function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block focus:outline-none"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-cream">
        <FadeImage
          src={product.imageUrl}
          alt={product.name[locale]}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-1">
        {product.origin && (
          <div className="text-xs uppercase tracking-wider text-muted">
            {product.origin[locale]}
          </div>
        )}
        <h3 className="font-serif text-lg leading-tight text-coffee-dark">
          {product.name[locale]}
        </h3>
        <div className="text-sm text-coffee">
          {formatPrice(product.priceCents, locale)}
        </div>
      </div>
    </Link>
  );
}
