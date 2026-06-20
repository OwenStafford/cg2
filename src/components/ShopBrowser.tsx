"use client";

import { useSearchParams } from "next/navigation";
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
}: {
  products: Product[];
  locale: Locale;
}) {
  const t = useTranslations("shop");
  // The URL is the single source of truth — so it stays correct whether the
  // category changes from a tab click here or from any nav link elsewhere.
  const searchParams = useSearchParams();
  const raw = searchParams.get("category");
  const active: Filter =
    raw === "coffee" || raw === "tea" || raw === "gift" ? raw : "all";

  // Tab clicks update the URL via the History API: instant, no server
  // round-trip, and useSearchParams re-renders to reflect it.
  function select(key: Filter) {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (key === "all") params.delete("category");
    else params.set("category", key);
    const qs = params.toString();
    window.history.pushState(
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
