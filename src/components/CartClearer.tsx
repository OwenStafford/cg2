"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart";

export function CartClearer() {
  const clear = useCartStore((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
