"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Minus, Plus, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  useCartStore,
  selectSubtotalCents,
  type CartItem,
} from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { CheckoutButton } from "./CheckoutButton";
import type { Locale } from "@/i18n/routing";

export function CartContents({ locale }: { locale: Locale }) {
  const t = useTranslations("cart");
  const tProduct = useTranslations("product");
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectSubtotalCents);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="mt-10 h-40" aria-hidden="true" />;
  }

  if (items.length === 0) {
    return (
      <div className="mt-10">
        <p className="text-muted">{t("empty")}</p>
        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-full bg-coffee-dark px-6 py-3 text-sm font-medium text-cream hover:bg-coffee transition-colors"
        >
          {t("emptyCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12">
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <Row
            key={item.productId}
            item={item}
            locale={locale}
            onQty={(q) => updateQuantity(item.productId, q)}
            onRemove={() => removeItem(item.productId)}
            decreaseLabel={tProduct("decrease")}
            increaseLabel={tProduct("increase")}
            removeLabel={t("remove")}
          />
        ))}
      </ul>

      <aside className="lg:w-80 self-start rounded-md border border-border bg-cream/40 p-6 space-y-4">
        <div className="flex items-center justify-between text-coffee-dark">
          <span className="text-sm uppercase tracking-wider text-muted">
            {t("subtotal")}
          </span>
          <span className="font-medium">{formatPrice(subtotal, locale)}</span>
        </div>
        <p className="text-xs text-muted">{t("shipping")}</p>
        <CheckoutButton />
      </aside>
    </div>
  );
}

function Row({
  item,
  locale,
  onQty,
  onRemove,
  decreaseLabel,
  increaseLabel,
  removeLabel,
}: {
  item: CartItem;
  locale: Locale;
  onQty: (qty: number) => void;
  onRemove: () => void;
  decreaseLabel: string;
  increaseLabel: string;
  removeLabel: string;
}) {
  const name = locale === "fr" ? item.nameFr : item.nameEn;
  const lineTotal = item.priceCents * item.quantity;

  return (
    <li className="flex items-center gap-5 py-5">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <Link
          href={`/shop/${item.slug}`}
          className="font-serif text-lg text-coffee-dark hover:text-coffee transition-colors"
        >
          {name}
        </Link>
        <div className="mt-1 text-sm text-muted">
          {formatPrice(item.priceCents, locale)}
        </div>
      </div>
      <div className="flex items-center rounded-full border border-coffee-dark">
        <button
          type="button"
          onClick={() => onQty(item.quantity - 1)}
          aria-label={decreaseLabel}
          className="flex h-9 w-9 items-center justify-center text-coffee-dark hover:bg-cream rounded-l-full transition-colors"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-7 text-center text-sm font-medium text-coffee-dark">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => onQty(item.quantity + 1)}
          aria-label={increaseLabel}
          className="flex h-9 w-9 items-center justify-center text-coffee-dark hover:bg-cream rounded-r-full transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="w-20 text-right text-sm font-medium text-coffee-dark">
        {formatPrice(lineTotal, locale)}
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="text-muted hover:text-coffee-dark transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </li>
  );
}
