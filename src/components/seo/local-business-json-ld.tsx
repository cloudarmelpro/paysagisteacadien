import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { openingHours, services, siteConfig } from "@/config/site";
import { siteUrl } from "@/lib/seo";

/**
 * Données structurées LocalBusiness (schema.org) — le levier le plus fort pour
 * une entreprise locale : c'est ce qui alimente le panneau de connaissances et
 * les résultats enrichis (téléphone, horaires, zone desservie, services).
 *
 * Rendu dans le layout `[lang]` : il n'est réconcilié côté client que si la
 * locale change, ce qui provoque un rechargement complet — React ne re-rend donc
 * jamais ce <script> (pas d'avertissement React 19).
 *
 * Volontairement PAS déclaré : adresse municipale précise, fourchette de prix,
 * avis/notes — l'entreprise n'a pas de vitrine publique et inventer ces champs
 * serait faux (et sanctionné par Google).
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
    // Entreprise de services à domicile : pas de vitrine, donc localité seule.
    address: {
      "@type": "PostalAddress",
      addressLocality: "Laval",
      addressRegion: "QC",
      addressCountry: "CA",
    },
    areaServed: [
      { "@type": "City", name: "Laval" },
      { "@type": "AdministrativeArea", name: "Rive-Nord de Montréal" },
    ],
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
