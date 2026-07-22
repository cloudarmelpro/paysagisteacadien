"use client";

import Script from "next/script";
import { gaMeasurementId } from "@/config/site";
import { useConsent } from "@/components/layout/cookie-consent";

/**
 * Google Analytics (GA4), chargé **uniquement après consentement** (Loi 25) :
 * rien de Google n'est requis ni exécuté tant que le visiteur n'a pas cliqué
 * « Accepter ». `useConsent` est réactif — accepter plus tard monte le script,
 * et un nouveau refus via « Gérer mes témoins » le démonte (le prochain
 * chargement de page repart donc sans GA).
 *
 * L'identifiant vient de `siteConfig` (`gaMeasurementId`), surchargeable par
 * `NEXT_PUBLIC_GA_MEASUREMENT_ID` au build. Vide : ce composant ne rend rien.
 *
 * La CSP de next.config.ts autorise les hôtes Google requis ; sans eux, le
 * navigateur bloquerait ces requêtes.
 */
export function GoogleAnalytics() {
  const consent = useConsent();
  const measurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || gaMeasurementId;

  if (!measurementId || consent !== "granted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
          // Consent Mode : mesure d'audience oui, publicité non — cohérent avec
          // « aucun témoin publicitaire » de la politique. Sans ça, une propriété
          // GA4 avec Google Signals tenterait un ping publicitaire (bloqué par la
          // CSP aujourd'hui, mais on le refuse aussi à la source).
          `gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});` +
          `gtag('js',new Date());gtag('config','${measurementId}');`}
      </Script>
    </>
  );
}
