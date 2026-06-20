import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

// Canonical production origin. Override per-environment with NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cafegourmet.ca"
).replace(/\/$/, "");

export const SITE_NAME = "Café Gourmet";

export function ogLocale(locale: Locale): string {
  return locale === "fr" ? "fr_CA" : "en_CA";
}

// Build canonical + hreflang alternates for a locale-prefixed path.
// `path` is the part after the locale, e.g. "" (home), "/shop", "/shop/kenya-aa".
export function buildAlternates(locale: Locale, path: string) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}${path}`;
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
  return { canonical: `/${locale}${path}`, languages };
}

export function pageMetadata(opts: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  images?: string[];
}): Metadata {
  const { locale, path, title, description, images } = opts;
  const alternates = buildAlternates(locale, path);
  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      type: "website",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}
