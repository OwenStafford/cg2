"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";
import type { Locale } from "@/i18n/routing";
import type { ProductCategory } from "@/lib/db/enums";

type Filter = "all" | ProductCategory;

const CATEGORIES: { key: Filter; label: string }[] = [
  { key: "all", label: "filterAll" },
  { key: "coffee", label: "filterCoffee" },
  { key: "tea", label: "filterTea" },
  { key: "gift", label: "filterGifts" },
];

export function ShopBrowser({
  products,
  locale,
  initialCategory,
}: {
  products: Product[];
  locale: Locale;
  initialCategory: Filter;
}) {
  const t = useTranslations("shop");
  const [active, setActive] = useState<Filter>(initialCategory);

  // Filtering is instant (no navigation); we keep the URL in sync for sharing.
  function select(key: Filter) {
    setActive(key);
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (key === "all") params.delete("category");
    else params.set("category", key);
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
    );
  }

  const filtered =
    active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <>
      <nav className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => select(key)}
            className={clsx(
              "cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors",
              active === key
                ? "bg-coffee-dark text-cream"
                : "text-muted hover:text-coffee-dark",
            )}
          >
            {t(label)}
          </button>
        ))}
      </nav>

      <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} locale={locale} />
        ))}
      </div>
    </>
  );
}
