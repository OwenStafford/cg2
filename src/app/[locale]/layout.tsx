import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const base = pageMetadata({
    locale: locale as Locale,
    path: "",
    title: t("title"),
    description: t("description"),
  });
  return {
    ...base,
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s · ${SITE_NAME}` },
  };
}

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  foundingDate: "1977",
  email: "info@cafegourmet.ca",
  telephone: "+1-514-631-1131",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1564 Ch. Herron, Suite 201",
    addressLocality: "Dorval",
    addressRegion: "QC",
    postalCode: "H9S 1B7",
    addressCountry: "CA",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${fraunces.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
