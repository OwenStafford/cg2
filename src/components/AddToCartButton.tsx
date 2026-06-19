"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Minus, Plus, Check } from "lucide-react";
import { useCartStore, type CartItem } from "@/lib/cart";

type Snapshot = Omit<CartItem, "quantity">;

export function AddToCartButton({
  product,
  inStock,
}: {
  product: Snapshot;
  inStock: boolean;
}) {
  const t = useTranslations("product");
  const tShop = useTranslations("shop");
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  if (!inStock) {
    return (
      <button
        type="button"
        disabled
        className="mt-10 inline-flex items-center justify-center rounded-full bg-muted px-8 py-3 text-sm font-medium text-cream cursor-not-allowed"
      >
        {tShop("outOfStock")}
      </button>
    );
  }

  const handleAdd = () => {
    addItem(product, qty);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="mt-10 flex items-center gap-3">
      <div className="flex items-center rounded-full border border-coffee-dark">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label={t("decrease")}
          className="flex h-11 w-11 items-center justify-center text-coffee-dark hover:bg-cream rounded-l-full transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-8 text-center text-sm font-medium text-coffee-dark">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          aria-label={t("increase")}
          className="flex h-11 w-11 items-center justify-center text-coffee-dark hover:bg-cream rounded-r-full transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex items-center gap-2 rounded-full bg-coffee-dark px-8 py-3 text-sm font-medium text-cream hover:bg-coffee transition-colors"
      >
        {justAdded ? (
          <>
            <Check className="h-4 w-4" />
            {t("added")}
          </>
        ) : (
          t("addToCart")
        )}
      </button>
    </div>
  );
}
