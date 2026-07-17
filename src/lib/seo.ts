import type { Metadata } from "next";
import { i18n, localizedPath, type Locale } from "./i18n";
import { siteConfig } from "@/config/site";

/** Base absolue de toutes les URL de métadonnées (canonical, hreflang, OG). */
export const siteUrl = siteConfig.url;

/**
 * Construit `canonical` + `hreflang` pour une page donnée.
 *
 * `segment` est le chemin APRÈS la locale, sans slash de tête ("" = accueil,
 * "services/tourbe", …). Chaque page se déclare elle-même comme canonique et
 * liste ses équivalents dans les autres langues — c'est le signal principal que
 * Google utilise pour servir la bonne version linguistique.
 * `x-default` pointe vers le français, la locale par défaut du site.
 */
export function buildAlternates(
  lang: Locale,
  segment: string,
): NonNullable<Metadata["alternates"]> {
  const languages = Object.fromEntries(
    i18n.locales.map((loc) => [loc, localizedPath(loc, segment)]),
  ) as Record<Locale, string>;

  return {
    canonical: localizedPath(lang, segment),
    languages: {
      ...languages,
      "x-default": localizedPath(i18n.defaultLocale, segment),
    },
  };
}

/**
 * Zone desservie au format schema.org, localisée.
 *
 * La Rive-Nord doit porter le nom que le lecteur de la page reconnaît : une page
 * déclarée `inLanguage: en-CA` qui annonce « Rive-Nord de Montréal » est
 * incohérente. Partagé par les schémas LocalBusiness et Service pour que les
 * deux ne puissent pas diverger.
 */
export function buildAreaServed(lang: Locale) {
  return [
    { "@type": "City", name: "Laval" },
    {
      "@type": "AdministrativeArea",
      name: lang === "fr" ? "Rive-Nord de Montréal" : "North Shore of Montreal",
    },
  ];
}

/**
 * Métadonnées Open Graph / Twitter d'une page. Les URL relatives sont résolues
 * par `metadataBase`. L'image est une photo réelle de chantier (1200×630 étant
 * l'idéal, on réutilise la photo du hero à défaut d'un visuel dédié).
 */
export function buildOpenGraph(
  lang: Locale,
  segment: string,
  title: string,
  description: string,
): Metadata {
  const url = localizedPath(lang, segment);
  const images = [{ url: "/images/hero-pelouse.jpg", alt: siteConfig.name }];

  return {
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: lang === "fr" ? "fr_CA" : "en_CA",
      alternateLocale: lang === "fr" ? "en_CA" : "fr_CA",
      url,
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}
