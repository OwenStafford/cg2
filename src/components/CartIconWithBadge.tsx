"use client";

import { useSyncExternalStore } from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCartStore, selectItemCount } from "@/lib/cart";

export function CartIconWithBadge({ ariaLabel }: { ariaLabel: string }) {
  const count = useCartStore(selectItemCount);
  // Cart is client-persisted; avoid SSR/client mismatch by gating on hydration.
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const visible = hydrated && count > 0;

  return (
    <Link
      href="/cart"
      aria-label={ariaLabel}
      className="relative text-muted hover:text-coffee transition-colors"
    >
      <ShoppingBag className="h-5 w-5" />
      {visible && (
        <span className="absolute -top-1.5 -right-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-cream">
          {count}
        </span>
      )}
    </Link>
  );
}
