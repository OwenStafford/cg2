import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const year = 2026;

  return (
    <footer className="mt-24 border-t border-border bg-cream/50">
      <Container className="grid grid-cols-2 md:grid-cols-4 gap-10 py-14">
        <div className="col-span-2 md:col-span-1">
          <div className="font-serif text-xl text-coffee-dark">
            Café Gourmet
          </div>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            {t("tagline")}
          </p>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wider text-muted">
            {t("shop")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/shop?category=coffee" className="hover:text-coffee">
                {nav("signatureBlends")}
              </Link>
            </li>
            <li>
              <Link href="/shop?category=tea" className="hover:text-coffee">
                {nav("tea")}
              </Link>
            </li>
            <li>
              <Link href="/shop?category=gift" className="hover:text-coffee">
                {nav("gifts")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wider text-muted">
            {t("company")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/customized" className="hover:text-coffee">
                {nav("customService")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-coffee">
                {nav("about")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-coffee">
                {nav("contact")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wider text-muted">
            {t("legal")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="text-muted">{t("privacy")}</li>
            <li className="text-muted">{t("terms")}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="py-5 text-xs text-muted">
          © {year} Café Gourmet. {t("rights")}
        </Container>
      </div>
    </footer>
  );
}
