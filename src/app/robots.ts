import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * robots.txt : tout est indexable (site vitrine public) et on pointe le sitemap.
 * `/api/` est exclu par précaution — rien d'utile à indexer côté endpoints.
 *
 * Pas de directive `Host:` : elle est spécifique à Yandex et dépréciée par
 * Yandex lui-même depuis 2018 — aucun moteur ne l'utilise aujourd'hui.
 * L'indexation des hôtes non canoniques (URL Vercel, previews) est gérée par
 * l'en-tête `X-Robots-Tag` dans `next.config.ts`, qui est, lui, respecté.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
