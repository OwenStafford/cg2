"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";

const LINKS = [
  { href: "/shop", key: "shop" },
  { href: "/shop?category=coffee", key: "signatureBlends" },
  { href: "/shop?category=tea", key: "tea" },
  { href: "/shop?category=gift", key: "gifts" },
  { href: "/customized", key: "customService" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function MobileMenu() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("menu")}
        aria-expanded={open}
        className="flex cursor-pointer items-center text-coffee-dark hover:text-coffee transition-colors"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background shadow-sm">
          <Container className="flex flex-col py-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 text-coffee-dark hover:text-coffee transition-colors last:border-0"
              >
                {t(l.key)}
              </Link>
            ))}
          </Container>
        </div>
      )}
    </div>
  );
}
