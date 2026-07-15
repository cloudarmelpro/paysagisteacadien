/**
 * Configuration centrale du site — Paysagiste Acadien Inc.
 *
 * Source de vérité unique pour les constantes de l'entreprise (coordonnées,
 * réseaux sociaux, catalogue de services). Les libellés traduits (nav, titres,
 * descriptions) vivent dans `src/dictionaries/{fr,en}.json`.
 * Données reprises du site actuel : https://paysagisteacadien.com
 */

export const siteConfig = {
  name: "Paysagiste Acadien",
  legalName: "Paysagiste Acadien Inc.",
  url: "https://paysagisteacadien.com",
  owner: "Cédric Babin",

  contact: {
    phone: "514-808-6549",
    phoneRaw: "5148086549",
    whatsapp: "https://wa.me/15148086549",
    email: "info@paysagisteacadien.com",
    quoteEmail: "soumission@paysagisteacadien.com",
  },

  social: {
    facebook: "https://www.facebook.com/111000204741617",
    instagram: "https://www.instagram.com/paysagiste_acadien",
    linkedin: "https://www.linkedin.com/in/cédric-babin-088b3a161",
  },
} as const;

/**
 * Catalogue des services (slugs stables = segments d'URL).
 * `category` regroupe l'affichage ; les noms/descriptions sont dans les dictionnaires
 * sous `services.items.<slug>`.
 */
export const services = [
  { slug: "entretien-paysager", category: "maintenance" },
  { slug: "entretien-de-terrain", category: "maintenance" },
  { slug: "entretien-de-rocaille", category: "maintenance" },
  { slug: "services-de-tailles", category: "maintenance" },
  { slug: "amenagement-paysager", category: "development" },
  { slug: "plantation", category: "development" },
  { slug: "tourbe", category: "development" },
  { slug: "pave-uni", category: "development" },
] as const;

/**
 * Navigation principale. `key` = clé de traduction dans `dict.nav`,
 * `segment` = segment d'URL après la locale ("" = accueil).
 */
export const navLinks = [
  { key: "home", segment: "" },
  { key: "services", segment: "services" },
  { key: "projects", segment: "realisations" },
  { key: "about", segment: "a-propos" },
] as const;

/** Segment de la page de contact / soumission (action à droite du header). */
export const contactSegment = "contact";

/** Segment parent des pages de service : /[lang]/services/[slug]. */
export const servicesSegment = "services";

/** Colonne « Entreprise » du footer (libellés dans dict.nav). */
export const footerCompanyLinks = [
  { key: "about", segment: "a-propos" },
  { key: "projects", segment: "realisations" },
  { key: "careers", segment: "emplois" },
  { key: "blog", segment: "blogue" },
] as const;

export type SiteConfig = typeof siteConfig;
export type ServiceSlug = (typeof services)[number]["slug"];
export type NavKey = (typeof navLinks)[number]["key"];
