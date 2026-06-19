"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1 text-xs uppercase tracking-wider">
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          disabled={isPending || l === locale}
          onClick={() =>
            startTransition(() => {
              router.replace(pathname, { locale: l });
            })
          }
          className={
            l === locale
              ? "px-1 font-semibold text-coffee-dark"
              : "px-1 text-muted hover:text-coffee-dark transition-colors"
          }
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
