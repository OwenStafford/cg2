import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";

const PRIVATE = ["account", "cart", "checkout"];

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/api/",
    ...routing.locales.flatMap((l) => PRIVATE.map((p) => `/${l}/${p}`)),
  ];

  return {
    rules: { userAgent: "*", allow: "/", disallow },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
