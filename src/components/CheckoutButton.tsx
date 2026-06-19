"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCartStore } from "@/lib/cart";

export function CheckoutButton() {
  const items = useCartStore((s) => s.items);
  const tCart = useTranslations("cart");
  const tCheckout = useTranslations("checkout");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          locale,
        }),
      });
      if (!res.ok) throw new Error("checkout failed");
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("no url");
      window.location.href = data.url;
    } catch {
      setError(tCheckout("failed"));
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || items.length === 0}
        className="inline-flex w-full items-center justify-center rounded-full bg-coffee-dark px-6 py-3 text-sm font-medium text-cream hover:bg-coffee transition-colors disabled:opacity-60"
      >
        {loading ? tCheckout("preparing") : tCart("checkout")}
      </button>
      {error && <p className="mt-2 text-xs text-accent">{error}</p>}
    </>
  );
}
