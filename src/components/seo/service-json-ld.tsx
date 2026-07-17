import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { servicesSegment } from "@/config/site";
import { siteUrl } from "@/lib/seo";

/**
 * Données structurées Service (schema.org) pour une page /services/<slug>.
 *
 * `provider` RÉFÉRENCE l'entité LocalBusiness du layout via son `@id` plutôt que
 * de la redéclarer : Google recoud alors les deux nœuds en une seule entité, là
 * où une copie créerait un doublon concurrent.
 *
 * Volontairement PAS déclaré : `offers` / `price` / avis — le site ne publie
 * aucun prix, l'inventer serait faux (et sanctionné par Google).
 */
export function ServiceJsonLd({
  lang,
  dict,
  slug,
}: {
  lang: Locale;
  dict: Dictionary;
  slug: string;
}) {
  const name = dict.services.items[slug as keyof typeof dict.services.items];
  const { intro } =
    dict.serviceDetail.items[slug as keyof typeof dict.serviceDetail.items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description: intro,
    url: `${siteUrl}${localizedPath(lang, `${servicesSegment}/${slug}`)}`,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: [
      { "@type": "City", name: "Laval" },
      { "@type": "AdministrativeArea", name: "Rive-Nord de Montréal" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
