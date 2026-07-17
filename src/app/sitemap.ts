import type { MetadataRoute } from "next";
import { i18n, localizedPath } from "@/lib/i18n";
import {
  contactSegment,
  privacySegment,
  serviceDetailSlugs,
  servicesSegment,
} from "@/config/site";
import { siteUrl } from "@/lib/seo";

/**
 * Les alternates hreflang émis ici doivent rester le miroir de `buildAlternates()`
 * (`src/lib/seo.ts`) : `fr`, `en`, `x-default` vers la locale par défaut. Deux
 * déclarations divergentes annulent le signal.
 *
 * Omissions à conserver : `lastModified` (aucune date de modification réelle par
 * page ; une date de build identique sur toutes les URL discrédite le champ) ;
 * `changeFrequency` et `priority` (ignorés par Google).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Segments après la locale ("" = accueil).
  const segments: string[] = [
    "",
    contactSegment,
    ...serviceDetailSlugs.map((slug) => `${servicesSegment}/${slug}`),
    "a-propos",
    "emplois",
    privacySegment,
  ];

  return segments.flatMap((segment) =>
    i18n.locales.map((lang) => ({
      url: `${siteUrl}${localizedPath(lang, segment)}`,
      alternates: {
        languages: {
          ...Object.fromEntries(
            i18n.locales.map((loc) => [
              loc,
              `${siteUrl}${localizedPath(loc, segment)}`,
            ]),
          ),
          "x-default": `${siteUrl}${localizedPath(i18n.defaultLocale, segment)}`,
        },
      },
    })),
  );
}
