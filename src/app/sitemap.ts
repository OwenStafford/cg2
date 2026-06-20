import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { listAllSlugs } from "@/lib/products";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/shop", "/customized", "/about", "/contact"];
  const slugs = await listAllSlugs();
  const paths = [...staticPaths, ...slugs.map((s) => `/shop/${s}`)];
  const now = new Date();

  return paths.map((path) => ({
    url: `${SITE_URL}/${routing.defaultLocale}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/shop/") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/shop") ? 0.8 : 0.6,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
      ),
    },
  }));
}
