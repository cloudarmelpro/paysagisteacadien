import type { Metadata } from "next";
import { i18n, localizedPath, type Locale } from "./i18n";
import { siteConfig } from "@/config/site";

/** Base absolue de toutes les URL de métadonnées (canonical, hreflang, OG). */
export const siteUrl = siteConfig.url;

/**
 * `segment` est le chemin après la locale, sans slash de tête ("" = accueil,
 * "services/tourbe", …).
 *
 * Doit rester le miroir des alternates émis par `src/app/sitemap.ts`.
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
 * Tout composant JSON-LD doit passer par ici : `JSON.stringify` seul laisse un `<`
 * fermer la balise script depuis une donnée dynamique (XSS). Échappement `<`
 * recommandé par node_modules/next/dist/docs/01-app/02-guides/json-ld.md.
 */
export function jsonLdScript(jsonLd: object): string {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

/**
 * Zone desservie au format schema.org. Le nom de la région suit la locale de la
 * page (`inLanguage`). Partagé par les schémas LocalBusiness et Service, qui
 * doivent rester identiques.
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
 * par `metadataBase`.
 *
 * L'image est un visuel de marque, une par locale, et non une photo : ce choix
 * reste valable après le remplacement des placeholders Unsplash du site.
 */
export function buildOpenGraph(
  lang: Locale,
  segment: string,
  title: string,
  description: string,
): Metadata {
  const url = localizedPath(lang, segment);
  const images = [
    {
      url: `/og-${lang}.png`,
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} — ${siteConfig.legalName}`,
    },
  ];

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
