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
    recruitmentEmail: "recrutement@paysagisteacadien.com",
    /** Zone desservie, telle qu'annoncée sur les pages de services du site actuel. */
    serviceArea: "Laval et la Rive-Nord",
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
 * Photo illustrant chaque service. Défini ici — et nulle part ailleurs — pour
 * que le hero et la section services ne puissent pas se contredire (une même
 * image étiquetée « Plantation » ici et « Rocaille » là).
 * Placeholders Unsplash, à remplacer par les photos de chantiers réelles.
 */
export const serviceImages: Record<ServiceSlug, string> = {
  "entretien-paysager": "/images/hero-pelouse.jpg",
  "entretien-de-terrain": "/images/hero-pelouse.jpg",
  "entretien-de-rocaille": "/images/jardin-4.jpg",
  "services-de-tailles": "/images/jardin-2.jpg",
  "amenagement-paysager": "/images/jardin-3.jpg",
  plantation: "/images/jardin-3.jpg",
  tourbe: "/images/jardin-1.jpg",
  "pave-uni": "/images/pave-uni.jpg",
};

/**
 * Structure réelle de l'offre, telle qu'organisée sur le site actuel : deux
 * pages-chapeaux (« Entretien paysager » et « Aménagement paysager »), chacune
 * couvrant trois services. `services` ci-dessus reste le catalogue à plat
 * (utilisé par le footer) ; ceci en donne la hiérarchie.
 */
export const serviceGroups = [
  {
    key: "maintenance",
    segment: "entretien-paysager",
    services: [
      "entretien-de-terrain",
      "entretien-de-rocaille",
      "services-de-tailles",
    ],
  },
  {
    key: "development",
    segment: "amenagement-paysager",
    services: ["plantation", "tourbe", "pave-uni"],
  },
] as const;

/**
 * Navigation principale. `key` = clé de traduction dans `dict.nav`,
 * `segment` = segment d'URL après la locale ("" = accueil).
 * `hash` (optionnel) = ancre d'une section de l'accueil : le lien défile en
 * douceur vers cette section (ex. « Services » → section #services de l'accueil).
 */
export const navLinks = [
  { key: "home", segment: "" },
  { key: "services", segment: "", hash: "services" },
  { key: "faq", segment: "", hash: "faq" },
  { key: "about", segment: "a-propos" },
] as const;

/**
 * Segment de la page de contact. Tous les CTA de contact/soumission y mènent
 * pour l'instant ; quand la page « soumission » (devis détaillé) existera, on
 * séparera son segment de celui-ci.
 */
export const contactSegment = "nous-joindre";

/** Segment parent des pages de service : /[lang]/services/[slug]. */
export const servicesSegment = "services";

/**
 * Tous les slugs ayant une page de détail sous /[lang]/services/[slug] :
 * les 2 pages-chapeaux (segments de famille) + les 6 services individuels.
 * Sert de source à `generateStaticParams`.
 */
export const serviceDetailSlugs = [
  ...serviceGroups.map((g) => g.segment),
  ...serviceGroups.flatMap((g) => g.services),
] as const;

type ServiceGroup = (typeof serviceGroups)[number];

/** Résultat de résolution d'un slug de page service. */
export type ResolvedService =
  | { kind: "category"; group: ServiceGroup }
  | { kind: "service"; group: ServiceGroup; slug: string };

/**
 * Résout un slug d'URL vers son type de page : une famille (« chapeau », qui
 * liste ses sous-services) ou un service individuel (page de détail), en
 * remontant à sa famille parente. `null` si le slug n'existe pas.
 */
export function resolveServiceSlug(slug: string): ResolvedService | null {
  const category = serviceGroups.find((g) => g.segment === slug);
  if (category) return { kind: "category", group: category };
  const group = serviceGroups.find((g) =>
    (g.services as readonly string[]).includes(slug),
  );
  if (!group) return null;
  return { kind: "service", group, slug };
}

/** Segment de la page « Emplois » (candidatures spontanées). */
export const careersSegment = "emplois";

/** Colonne « Entreprise » du footer (libellés dans dict.nav). On ne liste que
 *  les pages qui existent réellement : À propos et Emplois (LinkedIn est ajouté
 *  à part dans le footer). Réalisations et Blogue n'ont pas de page → retirés. */
export const footerCompanyLinks = [
  { key: "about", segment: "a-propos" },
  { key: "careers", segment: "emplois" },
] as const;

export type SiteConfig = typeof siteConfig;
export type ServiceSlug = (typeof services)[number]["slug"];
export type NavKey = (typeof navLinks)[number]["key"];
