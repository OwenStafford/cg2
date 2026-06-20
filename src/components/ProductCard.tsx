import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/lib/types";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/lib/format";
import { blurFor } from "@/lib/blur";

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
        <Image
          src={product.imageUrl}
          alt={product.name[locale]}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          placeholder="blur"
          blurDataURL={blurFor(product.imageUrl)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
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
