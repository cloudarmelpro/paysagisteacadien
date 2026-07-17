import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * robots.txt : tout est indexable (site vitrine public) et on pointe le sitemap.
 * `/api/` est exclu par précaution — rien d'utile à indexer côté endpoints.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
