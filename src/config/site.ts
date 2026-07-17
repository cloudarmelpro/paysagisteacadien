/**
 * Constantes non traduisibles de l'entreprise (coordonnées, réseaux, catalogue
 * de services). Les libellés traduits vivent dans `src/dictionaries/{fr,en}.json`.
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
    /*
     * Une seule boîte pour tout le site (contact, soumissions, recrutement). Les
     * trois clés sont conservées pour que chaque point d'entrée reste nommé, mais
     * pointent la même adresse. Doit rester identique au destinataire d'envoi des
     * formulaires (`RESEND_TO` par défaut, voir src/lib/email.ts).
     */
    email: "paysagisteacadien@outlook.com",
    quoteEmail: "paysagisteacadien@outlook.com",
    recruitmentEmail: "paysagisteacadien@outlook.com",
    /*
     * Aucun texte affiché ici : seulement des constantes non traduisibles.
     * La zone desservie est une chaîne traduite et vit dans les dictionnaires
     * (`contact.areaValue`).
     */
  },

  social: {
    facebook: "https://www.facebook.com/111000204741617",
    instagram: "https://www.instagram.com/paysagiste_acadien",
    linkedin: "https://www.linkedin.com/in/cédric-babin-088b3a161",
  },
} as const;

/**
 * Heures d'ouverture au format schema.org. Doit rester cohérent avec les
 * libellés traduits de `contact.hours` dans les dictionnaires.
 * Un jour fermé est absent de la liste.
 */
export const openingHours = [
  {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "19:00",
  },
  { days: ["Saturday"], opens: "09:00", closes: "15:00" },
] as const;

/**
 * Catalogue des services. Les slugs sont des segments d'URL : ils doivent rester
 * stables. Noms et descriptions dans les dictionnaires, sous `services.items.<slug>`.
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
  { slug: "optimisation-irrigation", category: "development" },
] as const;

/**
 * Photo de chaque service. Source unique : le hero et la section services
 * doivent afficher la même image pour un service donné.
 * Placeholders, à remplacer par les photos de chantiers réelles.
 */
export const serviceImages: Record<ServiceDetailSlug, string> = {
  "entretien-paysager": "/images/hero-pelouse.jpg",
  "entretien-de-terrain": "/images/hero-pelouse.jpg",
  "entretien-de-rocaille": "/images/jardin-4.jpg",
  "services-de-tailles": "/images/jardin-2.jpg",
  "amenagement-paysager": "/images/jardin-3.jpg",
  plantation: "/images/jardin-3.jpg",
  tourbe: "/images/jardin-1.jpg",
  "pave-uni": "/images/pave-uni.jpg",
  "optimisation-irrigation": "/images/jardin-1.jpg",
};

/**
 * Hiérarchie de l'offre : deux pages-chapeaux couvrant chacune trois services.
 * `services` ci-dessus reste le catalogue à plat, utilisé par le footer.
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
    services: ["plantation", "tourbe", "pave-uni", "optimisation-irrigation"],
  },
] as const;

/**
 * Navigation principale. `key` = clé de traduction dans `dict.nav`,
 * `segment` = segment d'URL après la locale ("" = accueil),
 * `hash` = ancre d'une section de l'accueil.
 */
export const navLinks = [
  { key: "home", segment: "" },
  { key: "services", segment: "", hash: "services" },
  { key: "faq", segment: "", hash: "faq" },
  { key: "about", segment: "a-propos" },
] as const;

/**
 * Segment de la page de contact. Tous les CTA de contact et de soumission y
 * mènent, faute de page « soumission » distincte.
 */
export const contactSegment = "nous-joindre";

/** Segment parent des pages de service : /[lang]/services/[slug]. */
export const servicesSegment = "services";

/**
 * Slugs ayant une page sous /[lang]/services/[slug] : pages-chapeaux et services
 * individuels. Source de `generateStaticParams`.
 *
 * N'y ajouter que des slugs ayant un contenu propre et vérifié dans les
 * dictionnaires. Décliner un service par ville produirait des doorway pages
 * pénalisables.
 */
export const serviceDetailSlugs = [
  ...serviceGroups.map((g) => g.segment),
  ...serviceGroups.flatMap((g) => g.services),
] as const;

export type ServiceDetailSlug = (typeof serviceDetailSlugs)[number];

type ServiceGroup = (typeof serviceGroups)[number];

/**
 * Résultat de résolution d'un slug de page service. Les slugs y sont des types
 * littéraux, pas `string` : ils indexent `serviceImages` sans cast.
 */
export type ResolvedService =
  | { kind: "category"; group: ServiceGroup }
  | { kind: "service"; group: ServiceGroup; slug: ServiceGroup["services"][number] };

/**
 * Résout un slug d'URL vers une famille ou un service individuel accompagné de
 * sa famille parente. `null` si le slug n'existe pas.
 */
export function resolveServiceSlug(slug: string): ResolvedService | null {
  const category = serviceGroups.find((g) => g.segment === slug);
  if (category) return { kind: "category", group: category };
  for (const group of serviceGroups) {
    const found = group.services.find((s) => s === slug);
    if (found) return { kind: "service", group, slug: found };
  }
  return null;
}

/** Segment de la page « Emplois » (candidatures spontanées). */
export const careersSegment = "emplois";

/** Segment de la politique de confidentialité (Loi 25). Le slug reste français
 *  dans les deux locales, comme `nous-joindre` et `emplois`. */
export const privacySegment = "confidentialite";

/** Colonne « Entreprise » du footer (libellés dans dict.nav). Ne lister ici que
 *  des pages existantes. Le lien LinkedIn est ajouté à part dans le footer. */
export const footerCompanyLinks = [
  { key: "about", segment: "a-propos" },
  { key: "careers", segment: "emplois" },
] as const;

export type SiteConfig = typeof siteConfig;
export type ServiceSlug = (typeof services)[number]["slug"];
export type NavKey = (typeof navLinks)[number]["key"];
