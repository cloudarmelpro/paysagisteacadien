import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Politique de sécurité du contenu.
 *
 * Choix assumé : `script-src` autorise `'unsafe-inline'`. Une CSP stricte
 * imposerait des nonces par requête, ce qui forcerait le rendu dynamique et
 * ferait perdre la génération statique des 27 pages — prix trop élevé pour un
 * site vitrine sans saisie de contenu tiers. La CSP garde malgré tout une vraie
 * valeur : elle bloque les scripts d'origines externes, les objets/embeds, le
 * détournement de `<base>`, l'exfiltration de formulaire vers un autre domaine
 * et l'affichage du site dans une iframe tierce.
 *
 * En développement, Next a besoin de `'unsafe-eval'` et d'un WebSocket pour le
 * HMR — ajoutés uniquement dans ce mode.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "upgrade-insecure-requests",
].join("; ");

/** En-têtes de sécurité. Seul HSTS était présent — et c'est Vercel qui l'ajoute
 *  par défaut, pas nous ; on le déclare donc ici aussi pour ne pas en dépendre. */
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

const nextConfig: NextConfig = {
  reactCompiler: true,

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        /**
         * Empêche l'indexation de tout hôte qui n'est PAS le domaine final :
         * aujourd'hui l'URL de transition `*.vercel.app` et les déploiements de
         * prévisualisation.
         *
         * Pourquoi : chaque page déclare un canonical vers paysagisteacadien.com,
         * mais ce domaine sert encore l'ancien site (et /en y répond 404). Google
         * ignore un canonical dont la cible n'existe pas ou diffère — sans cet
         * en-tête, l'URL Vercel s'indexerait et concurrencerait le vrai domaine.
         *
         * Réglé par NÉGATION du domaine final : le jour où paysagisteacadien.com
         * pointera ici, les pages redeviendront indexables sans toucher au code.
         * `www.` est toléré pour ne pas désindexer par erreur.
         */
        source: "/:path*",
        missing: [{ type: "host", value: "(www\\.)?paysagisteacadien\\.com" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
