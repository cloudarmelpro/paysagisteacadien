import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * `script-src` autorise `'unsafe-inline'` : une CSP à nonces imposerait le rendu
 * dynamique et supprimerait la génération statique des pages.
 * `'unsafe-eval'` et le WebSocket ne servent qu'au HMR en développement.
 *
 * Hôtes Google Analytics : la CSP est statique, elle ne peut pas dépendre du
 * consentement — ils sont donc toujours autorisés, mais ne sont contactés que si
 * GA se charge, c.-à-d. après « Accepter » (voir components/analytics).
 */
const gaScript = "https://www.googletagmanager.com";
const gaConnect =
  "https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com";
const gaImg = "https://www.googletagmanager.com https://*.google-analytics.com";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  `img-src 'self' data: blob: ${gaImg}`,
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline' ${gaScript}${isDev ? " 'unsafe-eval'" : ""}`,
  "font-src 'self' data:",
  `connect-src 'self' ${gaConnect}${isDev ? " ws: wss:" : ""}`,
  "upgrade-insecure-requests",
].join("; ");

/** HSTS est déclaré ici bien que Vercel l'ajoute par défaut, pour ne pas en dépendre. */
const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/**
 * URL de l'ancien site (unilingue français) vers l'arborescence localisée
 * `/fr/services/<slug>`. Sans ces 308, les liens indexés finissent en 404 et
 * l'autorité du domaine est perdue. Elles doivent s'appliquer avant le proxy de
 * locale, qui enverrait sinon `/tourbe` vers `/fr/tourbe` — route inexistante.
 * `/nous-joindre` et `/emplois` en sont absents : slug inchangé, le proxy suffit.
 */
const legacyRedirects = [
  // Pages-chapeaux de service
  { from: "/entretien-paysager-1", to: "/fr/services/entretien-paysager" },
  // Services individuels
  { from: "/entretien-de-terrain", to: "/fr/services/entretien-de-terrain" },
  // La rocaille est remplacée par la plate-bande : l'ancienne URL indexée y mène.
  { from: "/entretien-de-rocaille", to: "/fr/services/entretien-de-plate-bande" },
  { from: "/services-de-tailles", to: "/fr/services/services-de-tailles" },
  { from: "/plantation", to: "/fr/services/plantation" },
  { from: "/tourbe", to: "/fr/services/tourbe" },
  // Le blogue n'a pas d'équivalent : redirigé vers l'accueil plutôt qu'un 404.
  { from: "/blogue-1", to: "/fr" },

  /**
   * URL accentuées de l'ancien site. Next compare `source` au chemin
   * percent-encodé : « à-propos » ne matche jamais `/%C3%A0-propos`. La forme
   * encodée est donc requise ; la forme accentuée couvre les clients qui
   * envoient de l'UTF-8 brut.
   */
  { from: "/am%C3%A9nagement-paysager-1", to: "/fr/services/amenagement-paysager" },
  { from: "/aménagement-paysager-1", to: "/fr/services/amenagement-paysager" },
  { from: "/pav%C3%A9-unis-1", to: "/fr/services/pave-uni" },
  { from: "/pavé-unis-1", to: "/fr/services/pave-uni" },
  { from: "/%C3%A0-propos", to: "/fr/a-propos" },
  { from: "/à-propos", to: "/fr/a-propos" },
] as const;

const nextConfig: NextConfig = {
  reactCompiler: true,

  /**
   * Auto-hébergement (Hostinger, plan Business avec Node.js) : `standalone`
   * produit un serveur Node minimal dans `.next/standalone` avec ses seules
   * dépendances tracées. On lance `node .next/standalone/server.js`.
   * Rappel déploiement : copier `.next/static` et `public/` DANS le dossier
   * standalone (Next ne les y met pas), et fournir les variables d'environnement.
   */
  output: "standalone",

  async redirects() {
    return legacyRedirects.map(({ from, to }) => ({
      source: from,
      destination: to,
      permanent: true, // 308 — équivalent au 301 pour Google
    }));
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        /**
         * Bloque l'indexation de tout hôte autre que le domaine final
         * (`*.vercel.app`, prévisualisations) : leur canonical pointe vers
         * paysagisteacadien.com, qui sert encore l'ancien site, et l'URL Vercel
         * concurrencerait le vrai domaine. Réglé par négation de l'hôte, donc
         * les pages redeviennent indexables dès que le domaine pointe ici.
         */
        source: "/:path*",
        missing: [{ type: "host", value: "(www\\.)?paysagisteacadien\\.com" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
