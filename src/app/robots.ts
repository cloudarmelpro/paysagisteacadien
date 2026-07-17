import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * Pas de directive `Host:` : dépréciée et sans effet. L'indexation des hôtes non
 * canoniques (URL Vercel, previews) est bloquée par l'en-tête `X-Robots-Tag`
 * défini dans `next.config.ts`.
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
