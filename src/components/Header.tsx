import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { CartIconWithBadge } from "./CartIconWithBadge";
import { User } from "lucide-react";

export async function Header() {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <Container className="flex items-center justify-between gap-8 py-4">
        <Link
          href="/"
          className="font-serif text-2xl tracking-tight text-coffee-dark"
        >
          Café Gourmet
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          <Link href="/shop" className="hover:text-coffee transition-colors">
            {t("shop")}
          </Link>
          <Link
            href="/shop?category=coffee"
            className="hover:text-coffee transition-colors"
          >
            {t("signatureBlends")}
          </Link>
          <Link
            href="/shop?category=tea"
            className="hover:text-coffee transition-colors"
          >
            {t("tea")}
          </Link>
          <Link
            href="/shop?category=gift"
            className="hover:text-coffee transition-colors"
          >
            {t("gifts")}
          </Link>
          <Link href="/about" className="hover:text-coffee transition-colors">
            {t("about")}
          </Link>
          <Link
            href="/contact"
            className="hover:text-coffee transition-colors"
          >
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <Link
            href="/account"
            className="text-muted hover:text-coffee transition-colors"
            aria-label={t("account")}
          >
            <User className="h-5 w-5" />
          </Link>
          <CartIconWithBadge ariaLabel={t("cart")} />
        </div>
      </Container>
    </header>
  );
}
