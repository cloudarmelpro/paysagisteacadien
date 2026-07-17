import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { openingHours, services, siteConfig } from "@/config/site";
import { buildAreaServed, siteUrl } from "@/lib/seo";

/**
 * Données structurées LocalBusiness (schema.org), rendues dans le layout `[lang]`.
 * L'`@id` `${siteUrl}/#business` est référencé par ServiceJsonLd : le garder stable.
 *
 * Doit rester un Server Component : re-rendu côté client, ce <script> déclenche
 * l'erreur React 19 « script tag in component ».
 *
 * Non déclarés faute de données réelles : adresse municipale précise, fourchette
 * de prix, avis/notes.
 */
export function LocalBusinessJsonLd({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const home = `${siteUrl}${localizedPath(lang, "")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: dict.metadata.description,
    url: home,
    image: `${siteUrl}/images/hero-pelouse.jpg`,
    logo: `${siteUrl}/logo-512.png`,
    telephone: `+1-${siteConfig.contact.phone}`,
    email: siteConfig.contact.email,
    inLanguage: lang === "fr" ? "fr-CA" : "en-CA",
    founder: { "@type": "Person", name: siteConfig.owner },
    // Services à domicile, pas de vitrine : localité seule, sans rue.
    address: {
      "@type": "PostalAddress",
      addressLocality: "Laval",
      addressRegion: "QC",
      addressCountry: "CA",
    },
    areaServed: buildAreaServed(lang),
    openingHoursSpecification: openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...h.days],
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: dict.services.title + " " + dict.services.titleAccent,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: dict.services.items[s.slug],
          url: `${siteUrl}${localizedPath(lang, `services/${s.slug}`)}`,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
