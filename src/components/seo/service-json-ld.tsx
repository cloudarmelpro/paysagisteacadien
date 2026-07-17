import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { servicesSegment } from "@/config/site";
import { buildAreaServed, jsonLdScript, siteUrl } from "@/lib/seo";

/**
 * Données structurées Service (schema.org) pour une page /services/<slug>.
 *
 * `provider` référence l'entité LocalBusiness du layout par son `@id` au lieu de
 * la redéclarer, sinon les deux nœuds forment un doublon concurrent.
 *
 * Non déclarés faute de données réelles : `offers`, `price`, avis.
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
    areaServed: buildAreaServed(lang),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
    />
  );
}
