"use client";

import Script from "next/script";
import { useConsent } from "@/components/layout/cookie-consent";

/**
 * Google Analytics (GA4), chargé **uniquement après consentement** (Loi 25) :
 * rien de Google n'est requis ni exécuté tant que le visiteur n'a pas cliqué
 * « Accepter ». `useConsent` est réactif — accepter plus tard monte le script,
 * et un nouveau refus via « Gérer mes témoins » le démonte (le prochain
 * chargement de page repart donc sans GA).
 *
 * L'identifiant vient de `NEXT_PUBLIC_GA_MEASUREMENT_ID`, injecté au **build**.
 * Absent (dev, prévisualisation, ou build sans la variable) : ce composant ne
 * rend rien. L'ID GA est public par nature — pas un secret.
 *
 * La CSP de next.config.ts autorise les hôtes Google requis ; sans eux, le
 * navigateur bloquerait ces requêtes.
 */
export function GoogleAnalytics() {
  const consent = useConsent();
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!measurementId || consent !== "granted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}');`}
      </Script>
    </>
  );
}
