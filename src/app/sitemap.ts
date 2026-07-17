import type { MetadataRoute } from "next";
import { i18n, localizedPath, type Locale } from "@/lib/i18n";
import { contactSegment, serviceDetailSlugs, servicesSegment } from "@/config/site";
import { siteUrl } from "@/lib/seo";

/**
 * Sitemap bilingue. Chaque page est listée une fois par locale, et déclare ses
 * équivalents via `alternates.languages` (hreflang) — Google associe ainsi les
 * versions FR/EN au lieu de les voir comme du contenu dupliqué.
 *
 * `priority` reflète l'importance relative : accueil > pages de service /
 * contact > pages secondaires.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Segments après la locale ("" = accueil).
  const pages: { segment: string; priority: number }[] = [
    { segment: "", priority: 1 },
    { segment: contactSegment, priority: 0.9 },
    ...serviceDetailSlugs.map((slug) => ({
      segment: `${servicesSegment}/${slug}`,
      priority: 0.8,
    })),
    { segment: "a-propos", priority: 0.6 },
    { segment: "emplois", priority: 0.5 },
  ];

  const lastModified = new Date();

  return pages.flatMap(({ segment, priority }) =>
    i18n.locales.map((lang) => ({
      url: `${siteUrl}${localizedPath(lang as Locale, segment)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          i18n.locales.map((loc) => [
            loc,
            `${siteUrl}${localizedPath(loc as Locale, segment)}`,
          ]),
        ),
      },
    })),
  );
}
