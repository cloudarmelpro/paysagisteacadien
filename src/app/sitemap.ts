import type { MetadataRoute } from "next";
import { i18n, localizedPath, type Locale } from "@/lib/i18n";
import {
  contactSegment,
  privacySegment,
  serviceDetailSlugs,
  servicesSegment,
} from "@/config/site";
import { siteUrl } from "@/lib/seo";

/**
 * Sitemap bilingue. Chaque page est listée une fois par locale, et déclare ses
 * équivalents via `alternates.languages` (hreflang) — Google associe ainsi les
 * versions FR/EN au lieu de les voir comme du contenu dupliqué.
 *
 * Les `<xhtml:link>` émis ici sont le MIROIR EXACT de `buildAlternates()`
 * (`src/lib/seo.ts`), qui produit les alternates du <head> : `fr`, `en` et
 * `x-default` (→ locale par défaut). Les deux déclarations doivent rester
 * cohérentes, sinon Google constate un conflit et ignore le signal.
 *
 * Volontairement ABSENTS de ce sitemap :
 *
 * - `lastModified` : site statique, sans CMS ni date de modification réelle par
 *   page. Le renseigner reviendrait à écrire `new Date()`, c.-à-d. l'heure du
 *   BUILD — les 24 URL porteraient toutes le même horodatage, et il changerait à
 *   chaque déploiement même sans modification de contenu. C'est l'anti-pattern
 *   « all identical lastmod » : Google détecte la date bidon, perd confiance
 *   dans le champ et l'ignore pour tout le site. Pas de date > fausse date.
 *   Ne le rajouter QUE le jour où une vraie date par page existe.
 * - `changeFrequency` et `priority` : officiellement ignorés par Google depuis
 *   des années (ce ne sont que des indices déclaratifs, jamais vérifiés). Les
 *   émettre n'apporte rien et donne l'illusion d'un contrôle inexistant.
 *
 * → Ne pas « re-corriger » ces omissions : elles sont délibérées.
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
      url: `${siteUrl}${localizedPath(lang as Locale, segment)}`,
      alternates: {
        languages: {
          ...Object.fromEntries(
            i18n.locales.map((loc) => [
              loc,
              `${siteUrl}${localizedPath(loc as Locale, segment)}`,
            ]),
          ),
          "x-default": `${siteUrl}${localizedPath(i18n.defaultLocale, segment)}`,
        },
      },
    })),
  );
}
